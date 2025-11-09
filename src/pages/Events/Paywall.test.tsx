import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import Paywall from './Paywall';
import { act, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useEvents } from '../../hooks/useEvents';
import userEvent from '@testing-library/user-event';

vi.mock('react-router-dom');
vi.mock('../../hooks/useAttendee');
vi.mock('../../providers/UserData/UserDataProvider');
vi.mock('../../hooks/useEvents');
vi.mock('../../hooks/usePaymentService');

describe('Paywall', () => {
    let mockGetCheckoutSession: Mock;
    let mockGetEvent: Mock;
    // const mockGetEvent = vi.fn();

    beforeEach(() => {
        mockGetCheckoutSession = vi.fn().mockResolvedValue({
            url: 'checkout-url',
        });
        mockGetEvent = vi.fn().mockResolvedValue({
            name: 'test-event',
            blurb: 'test-blurb',
            thumbnail: 'test-thumbnail',
        });
        vi.mocked(useUserData, { partial: true }).mockReturnValue({
            user: {
                firstName: 'geary',
            },
        });
        vi.mocked(useParams, { partial: true }).mockReturnValue({
            event_id: 'test-event-id',
        });
        vi.mocked(usePaymentService, { partial: true }).mockReturnValue({
            getOrCreateRSVPCheckoutSession: mockGetCheckoutSession,
        });
        vi.mocked(useEvents, { partial: true }).mockReturnValue({
            getById: mockGetEvent,
        });
    });

    async function renderComponent() {
        return act(() => render(<Paywall />));
    }

    it('renders loading state correctly', async () => {
        mockGetEvent.mockResolvedValueOnce(new Promise(() => {}));

        await renderComponent();

        expect(screen.getByText('Loading event...')).toBeInTheDocument();
    });

    it('renders correctly', async () => {
        await renderComponent();

        expect(screen.getByText('Welcome to test-event!')).toBeInTheDocument();
        expect(screen.getByText('test-blurb')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'test-thumbnail');
        expect(screen.getByRole('button')).toHaveTextContent('Secure Your Spot');
    });

    it('renders checkout loading state', async () => {
        const user = userEvent.setup();
        mockGetCheckoutSession.mockResolvedValueOnce(new Promise(() => {}));
        await renderComponent();

        await act(() => user.click(screen.getByRole('button')));

        expect(screen.getByRole('button')).toHaveTextContent('Loading...');
    });

    it('navigates to stripe', async () => {
        const user = userEvent.setup();
        mockGetCheckoutSession.mockResolvedValueOnce('checkout_url');

        await renderComponent();

        await act(() => user.click(screen.getByRole('button')));

        expect(screen.getByRole('button')).toHaveTextContent('Loading...');
        expect(mockGetCheckoutSession).toHaveBeenCalledWith('test-event-id');
    });

    describe('errors when', () => {
        it('fetch event fails', async () => {
            mockGetEvent.mockRejectedValueOnce({});

            await renderComponent();

            expect(
                screen.getByText(
                    'An error occurred! Please refresh the page. Failed to fetch event!'
                )
            ).toBeInTheDocument();
        });

        it('fetch checkout session fails', async () => {
            const user = userEvent.setup();
            mockGetCheckoutSession.mockRejectedValueOnce({});

            await renderComponent();

            await act(() => user.click(screen.getByRole('button')));

            expect(
                screen.getByText(
                    'An error occurred! Please refresh the page. Failed to fetch checkout session!'
                )
            ).toBeInTheDocument();
        });
    });
});

// import { act, render, screen, waitFor } from '@testing-library/react';
// import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
// import { useParams } from 'react-router-dom';
// import { useAttendee } from '../../hooks/useAttendee';
// import { loadComponent } from '../../utils';
// import EventDashboard from './EventDashboard';

// // We'll mock these two hooks
// vi.mock('react-router-dom');
// vi.mock('../../hooks/useAttendee');
// vi.mock('../../utils', () => ({
//     loadComponent: vi.fn(),
// }));

// describe('EventDashboard', () => {
//     const mockGetAttendee = vi.fn();
//     const mockLoadComponent = loadComponent as Mock;
//     const eventModule = {
//         default: () => <div data-testid="event-main">Mocked Event Main</div>,
//     };
//     const paymentModule = { default: () => <div data-testid="paywall">Paywall Component</div> };

//     beforeEach(() => {
//         vi.resetAllMocks();
//         vi.mocked(useAttendee, { partial: true }).mockReturnValue({
//             getAttendee: mockGetAttendee,
//         });
//     });

//     async function renderComponent() {
//         return act(() => render(<EventDashboard />));
//     }

//     it('renders loading state initially', async () => {
//         (useParams as any).mockReturnValue({ event_id: 'test-event-id' });
//         mockGetAttendee.mockReturnValueOnce(new Promise(() => {}));

//         await renderComponent()

//         expect(screen.getByText(/loading/i)).toBeInTheDocument();
//     });

//     it('renders Event main component when attendee is REGISTERED', async () => {
//         (useParams as any).mockReturnValue({ event_id: 'test-event-id' });
//         mockGetAttendee.mockResolvedValue({ status: 'REGISTERED' });
//         mockLoadComponent.mockResolvedValueOnce(eventModule);

//         await renderComponent()

//         expect(screen.getByTestId('event-main')).toBeInTheDocument();
//         expect(mockLoadComponent).toHaveBeenCalledWith('./test-event-id/main.tsx');
//     });

//     it('renders Paywall when attendee is ACCEPTED', async () => {
//         (useParams as any).mockReturnValue({ event_id: 'test-event-id' });
//         mockGetAttendee.mockResolvedValue({ status: 'ACCEPTED' });
//         mockLoadComponent.mockResolvedValueOnce(paymentModule);

//         await renderComponent()

//         expect(screen.getByTestId('paywall')).toBeInTheDocument();
//         expect(mockLoadComponent).toHaveBeenCalledWith("./Paywall")
//     });

//     it('renders EventNotFound when attendee status is unknown', async () => {
//         (useParams as any).mockReturnValue({ event_id: 'unknown-event' });
//         mockGetAttendee.mockResolvedValue({ status: 'REJECTED' });

//         await renderComponent()

//         await waitFor(() => {
//             expect(screen.getByText('Event Not Found!')).toBeInTheDocument();
//         });
//     });

//     it('renders loading if no event_id in params', async () => {
//         (useParams as any).mockReturnValue({});
//         await renderComponent()
//         expect(screen.getByText(/loading/i)).toBeInTheDocument();
//     });
// });
