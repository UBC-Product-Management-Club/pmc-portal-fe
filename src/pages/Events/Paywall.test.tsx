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
