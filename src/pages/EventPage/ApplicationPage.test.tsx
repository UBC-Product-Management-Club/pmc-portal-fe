import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useApplicationDraft } from '../../hooks/useApplicationDraft';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { ApiError } from '../../service/RestClient';
import { showToast } from '../../utils';
import ApplicationPage from './ApplicationPage';

vi.mock('../../hooks/useEvents');
vi.mock('../../hooks/useAttendee');
vi.mock('../../hooks/usePaymentService');
vi.mock('../../hooks/useApplicationDraft');
vi.mock('../../providers/UserData/UserDataProvider', () => ({ useUserData: vi.fn() }));
vi.mock('../../utils', async (original) => ({
    ...(await original<typeof import('../../utils')>()),
    showToast: vi.fn(),
}));

const DAY = 24 * 60 * 60 * 1000;
const fromNow = (ms: number) => new Date(Date.now() + ms).toISOString();

const baseEvent = {
    eventId: 'e1',
    name: 'Product Jackpot',
    startTime: fromNow(9 * DAY),
    endTime: fromNow(10 * DAY),
    registrationOpens: fromNow(-DAY),
    registrationCloses: fromNow(5 * DAY),
    memberPrice: 9,
    nonMemberPrice: 15,
    maxAttendees: 52,
    registered: 0,
    needsReview: true,
    eventFormQuestions: [],
};

describe('ApplicationPage submit', () => {
    let addAttendee: Mock;
    let getAttendee: Mock;
    let eventCheckout: Mock;
    let rsvpCheckout: Mock;

    const renderPage = async (event: object) => {
        (useEvents as Mock).mockReturnValue({
            getById: vi.fn().mockResolvedValue({ ...baseEvent, ...event }),
            addAttendee,
        });
        render(
            <MemoryRouter initialEntries={['/events/e1/apply']}>
                <Routes>
                    <Route path="/events/:event_id/apply" element={<ApplicationPage />} />
                    <Route path="/events/:event_id" element={<p>event page</p>} />
                </Routes>
            </MemoryRouter>
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Submit application' }));
    };

    beforeEach(() => {
        vi.resetAllMocks();
        addAttendee = vi.fn().mockResolvedValue({});
        getAttendee = vi.fn().mockResolvedValue(null);
        eventCheckout = vi.fn().mockResolvedValue({ url: '#stripe' });
        rsvpCheckout = vi.fn().mockResolvedValue(null);
        (useAttendee as Mock).mockReturnValue({ getAttendee });
        (usePaymentService as Mock).mockReturnValue({
            getOrCreateEventCheckoutSession: eventCheckout,
            getOrCreateRSVPCheckoutSession: rsvpCheckout,
        });
        (useApplicationDraft as Mock).mockReturnValue({
            initial: { email: 'you@example.com' },
            loaded: true,
            status: 'idle',
            queueSave: vi.fn(),
            clear: vi.fn().mockResolvedValue(undefined),
        });
        (useUserData as Mock).mockReturnValue({
            user: { firstName: 'Test', lastName: 'Student' },
            isMember: false,
        });
    });

    it('sends reviewed applications to the event page without a checkout', async () => {
        await renderPage({ needsReview: true });

        expect(await screen.findByText('event page')).toBeTruthy();
        expect(eventCheckout).not.toHaveBeenCalled();
        expect(rsvpCheckout).not.toHaveBeenCalled();
    });

    it('registers free events without review directly', async () => {
        await renderPage({ needsReview: false, memberPrice: 0, nonMemberPrice: 0 });

        expect(await screen.findByText('event page')).toBeTruthy();
        expect(rsvpCheckout).toHaveBeenCalledWith('e1');
        expect(eventCheckout).not.toHaveBeenCalled();
    });

    it('sends paid events without review to the event checkout', async () => {
        await renderPage({ needsReview: false });

        await waitFor(() => expect(eventCheckout).toHaveBeenCalledWith('e1'));
    });

    it('keeps the saved application when the checkout fails', async () => {
        eventCheckout.mockRejectedValue(new ApiError('error', 409, 'EVENT_FULL'));
        await renderPage({ needsReview: false });

        expect(await screen.findByText('event page')).toBeTruthy();
        expect(showToast).toHaveBeenCalledWith('error', 'This event is full.');
    });

    it('shows the submitted answers when they already applied', async () => {
        addAttendee.mockRejectedValue(new ApiError('error', 409, 'ALREADY_APPLIED'));
        await renderPage({ needsReview: true });

        await waitFor(() =>
            expect(showToast).toHaveBeenCalledWith('error', "You've already applied to this event.")
        );
        await waitFor(() => expect(getAttendee.mock.calls.length).toBeGreaterThan(1));
    });
});
