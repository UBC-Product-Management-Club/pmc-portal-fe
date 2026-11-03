import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { ApiError } from '../../service/RestClient';
import { showToast } from '../../utils';
import EventPage from './EventPage';

vi.mock('../../hooks/useEvents');
vi.mock('../../hooks/useAttendee');
vi.mock('../../hooks/usePaymentService');
vi.mock('../../providers/UserData/UserDataProvider', () => ({ useUserData: vi.fn() }));
vi.mock('../../utils', async (original) => ({
    ...(await original<typeof import('../../utils')>()),
    showToast: vi.fn(),
}));

const DAY = 24 * 60 * 60 * 1000;
const fromNow = (ms: number) => new Date(Date.now() + ms).toISOString();

const event = {
    eventId: 'e1',
    name: 'Product Jackpot',
    blurb: 'blurb',
    description: 'description',
    date: fromNow(9 * DAY),
    startTime: fromNow(9 * DAY),
    endTime: fromNow(10 * DAY),
    registrationOpens: fromNow(-DAY),
    registrationCloses: fromNow(5 * DAY),
    location: 'Nest',
    thumbnail: null,
    icon: null,
    memberPrice: 9,
    nonMemberPrice: 15,
    maxAttendees: 52,
    registered: 0,
    needsReview: true,
    eventFormQuestions: [],
    media: [],
    schedule: null,
};

const accepted = {
    status: 'ACCEPTED',
    workflowState: 'PAYMENT_WINDOW_OPEN',
    paymentDueAt: fromNow(DAY),
    amountDue: 15,
};

describe('EventPage', () => {
    let getAttendee: Mock;
    let eventCheckout: Mock;
    let rsvpCheckout: Mock;

    const renderAt = (path: string) =>
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/events/:event_id" element={<EventPage />} />
                </Routes>
            </MemoryRouter>
        );

    beforeEach(() => {
        vi.resetAllMocks();
        getAttendee = vi.fn().mockResolvedValue(accepted);
        eventCheckout = vi.fn().mockResolvedValue({ url: '#stripe' });
        rsvpCheckout = vi.fn();
        (useEvents as Mock).mockReturnValue({
            getById: vi.fn().mockResolvedValue(event),
            loadDraft: vi.fn().mockResolvedValue(null),
        });
        (useAttendee as Mock).mockReturnValue({ getAttendee });
        (usePaymentService as Mock).mockReturnValue({
            getOrCreateEventCheckoutSession: eventCheckout,
            getOrCreateRSVPCheckoutSession: rsvpCheckout,
        });
        (useUserData as Mock).mockReturnValue({ user: { userId: 'u1' }, isMember: false });
    });

    it('sends the Stripe session id when back from checkout', async () => {
        renderAt('/events/e1?success=true&session_id=cs_test_1');

        await waitFor(() => expect(getAttendee).toHaveBeenCalledWith('e1', 'cs_test_1'));
    });

    it('sends no session id otherwise', async () => {
        renderAt('/events/e1');

        await waitFor(() => expect(getAttendee).toHaveBeenCalledWith('e1', undefined));
    });

    it('pays through the event checkout, which checks the payment window', async () => {
        renderAt('/events/e1');

        fireEvent.click(await screen.findByRole('button', { name: /Pay \$15\.00/ }));

        await waitFor(() => expect(eventCheckout).toHaveBeenCalledWith('e1'));
        expect(rsvpCheckout).not.toHaveBeenCalled();
    });

    it('explains an expired payment window and refreshes the status', async () => {
        eventCheckout.mockRejectedValue(new ApiError('error', 409, 'HOLD_EXPIRED'));
        renderAt('/events/e1');

        fireEvent.click(await screen.findByRole('button', { name: /Pay \$15\.00/ }));

        await waitFor(() =>
            expect(showToast).toHaveBeenCalledWith(
                'error',
                expect.stringContaining('payment window has closed')
            )
        );
        expect(getAttendee.mock.calls.length).toBeGreaterThan(1);
    });
});
