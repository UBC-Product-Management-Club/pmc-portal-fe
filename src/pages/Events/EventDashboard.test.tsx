import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { useAttendee } from '../../hooks/useAttendee';
import { loadComponent } from './EventUtils';
import EventDashboard from './EventDashboard';

// We'll mock these two hooks
vi.mock('react-router-dom');
vi.mock('../../hooks/useAttendee');
vi.mock('./EventUtils', () => ({
    loadComponent: vi.fn(),
}));

describe('EventDashboard', () => {
    const mockGetAttendee = vi.fn();
    const mockLoadComponent = loadComponent as Mock;
    const eventModule = {
        default: () => <div data-testid="event-main">Mocked Event Main</div>,
    };
    const paymentModule = { default: () => <div data-testid="paywall">Paywall Component</div> };

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(useParams, { partial: true }).mockReturnValue({
            event_id: 'test-event-id',
        });
        vi.mocked(useAttendee, { partial: true }).mockReturnValue({
            getAttendee: mockGetAttendee,
        });
    });

    async function renderComponent() {
        return act(() => render(<EventDashboard />));
    }

    it('renders loading state initially', async () => {
        mockGetAttendee.mockReturnValueOnce(new Promise(() => {}));

        await renderComponent();

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders Event main component when attendee is REGISTERED', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'REGISTERED' });
        mockLoadComponent.mockResolvedValueOnce(eventModule);

        await renderComponent();

        expect(screen.getByTestId('event-main')).toBeInTheDocument();
        expect(mockLoadComponent).toHaveBeenCalledWith('./test-event-id/main.tsx');
    });

    it('renders Paywall when attendee is ACCEPTED', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'ACCEPTED' });
        mockLoadComponent.mockResolvedValueOnce(paymentModule);

        await renderComponent();

        expect(screen.getByTestId('paywall')).toBeInTheDocument();
        expect(mockLoadComponent).toHaveBeenCalledWith('./Paywall');
    });

    it('renders NoEventAccess when attendee status is unknown', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'REJECTED' });

        await renderComponent();

        expect(screen.getByText('Access denied!')).toBeInTheDocument();
    });

    it('renders loading if no event_id in params', async () => {
        (useParams as Mock).mockReturnValue({});
        await renderComponent();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
