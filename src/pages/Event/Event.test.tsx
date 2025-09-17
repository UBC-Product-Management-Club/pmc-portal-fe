import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useEvents } from '../../hooks/useEvents';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import Event from './Event';
import { type Event as EventType } from '../../types/Event';
import userEvent from '@testing-library/user-event';

vi.mock('../../providers/UserData/UserDataProvider', () => ({
    useUserData: vi.fn(),
}));
vi.mock('react-router-dom');
vi.mock('../../hooks/useEvents');
vi.mock('@auth0/auth0-react');

const mockUseAuth0 = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => mockUseAuth0(),
}));

describe('Event', () => {
    let mockGetEventById: Mock;
    let mockNavigateTo: Mock;
    let mockEvent: { event: EventType; registered: boolean };
    const mockUser = {
        userId: 'user_id',
    };
    const mockEventId = 'event_id';

    beforeEach(() => {
        mockNavigateTo = vi.fn();
        mockEvent = {
            event: {
                eventId: 'aj',
                name: 'Product Conference',
                date: '2025-01-01',
                description: 'sdsd',
                startTime: '2025-07-21T21:30:00+00',
                endTime: '2025-07-21T22:30:00+00',
                location: 'UBC Sauder Building',
                thumbnail:
                    'https://dthvbanipvldaiabgvuc.supabase.co/storage/v1/object/public/event-media/events/75f6ef8e-12d7-48f3-a0a8-96443ae5d1f7/media/umm-nocturnaltrashposts-and-then-uhh.jpeg',
                memberPrice: 1,
                nonMemberPrice: 2,
                maxAttendees: 100,
                eventFormQuestions: {},
                media: [],
                isDisabled: false,
                registered: 1,
                needsReview: false,
            },
            registered: false,
        };
        (useUserData as Mock).mockReturnValue({
            user: mockUser,
        });
        mockGetEventById = vi.fn().mockResolvedValue(mockEvent);
        vi.mocked(useEvents, { partial: true }).mockReturnValue({
            getById: mockGetEventById,
        });
        vi.mocked(useParams, { partial: true }).mockReturnValue({
            event_id: mockEventId,
        });
        vi.mocked(useNavigate).mockReturnValue(mockNavigateTo);
        mockUseAuth0.mockReturnValue({ isAuthenticated: true });
    });

    async function renderComponent() {
        await act(() => render(<Event />));
    }

    it('loading', async () => {
        mockGetEventById.mockResolvedValueOnce(new Promise(() => {}));

        await renderComponent();

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('fails to fetch event', async () => {
        mockGetEventById.mockRejectedValueOnce(new Promise(() => {}));

        await renderComponent();

        expect(
            screen.getByText('an error occurred fetching event details... try refreshing.')
        ).toBeInTheDocument();
    });

    it('no event details', async () => {
        mockGetEventById.mockResolvedValueOnce({});

        await renderComponent();

        expect(
            screen.getByText('an error occurred fetching event details... try refreshing.')
        ).toBeInTheDocument();
    });

    it('shows event information', async () => {
        await renderComponent();

        expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
        expect(screen.getByText('Product Conference')).toBeInTheDocument();
        expect(screen.getByText('Monday, 21st July 2025')).toBeInTheDocument();
        expect(screen.getByText('UBC Sauder Building')).toBeInTheDocument();
        expect(screen.getByText('99/100 spots left!')).toBeInTheDocument();
        expect(screen.getByText('Member price: 1$')).toBeInTheDocument();
        expect(screen.getByText('Non-member price: 2$')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.event.description)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', mockEvent.event.thumbnail);
    });

    describe('register button text', () => {
        it('when full', async () => {
            mockGetEventById.mockResolvedValueOnce({
                event: { ...mockEvent.event, registered: 100 },
                registered: mockEvent.registered,
            });

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByText('0/100 spots left!')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveTextContent('Sorry! This event is full');
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
        });

        it('when already registered', async () => {
            mockGetEventById.mockResolvedValueOnce({
                event: { ...mockEvent.event, registered: 50 },
                registered: true,
            });

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByText('50/100 spots left!')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveTextContent("You're already registered.");
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
        });

        it('user not signed in', async () => {
            const user = userEvent.setup();
            mockGetEventById.mockResolvedValueOnce({
                event: { ...mockEvent.event, registered: 50 },
                registered: false,
            });
            mockUseAuth0.mockReturnValue({ isAuthenticated: false });
            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByText('50/100 spots left!')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveTextContent('Please sign in to register.');

            await act(() => user.click(screen.getByRole('button')));

            expect(mockNavigateTo).toHaveBeenCalledWith('/');
        });
    });
});
