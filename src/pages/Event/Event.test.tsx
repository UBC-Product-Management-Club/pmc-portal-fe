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

const mockUseAuth0 = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => mockUseAuth0(),
}));

describe('Event', () => {
    let mockGetEventById: Mock;
    let mockGetAttendee: Mock;
    let mockNavigateTo: Mock;
    let mockEvent: EventType;
    const mockUser = {
        userId: 'user_id',
    };
    const mockEventId = 'event_id';
    const mockBeforeRegistrationDate = new Date('2025-07-19T21:30:00+00:00').getTime();
    const mockRegistrationOpenDate = new Date('2025-07-21T21:30:00+00:00').getTime();
    const mockRegistrationClosed = new Date('2025-07-24T21:30:00+00:00').getTime();

    beforeEach(() => {
        vi.resetAllMocks();
        mockNavigateTo = vi.fn();
        mockEvent = {
            eventId: 'aj',
            name: 'Product Conference',
            date: '2025-01-01',
            blurb: 'sdsd',
            description: 'sdsd',
            registrationOpens: '2025-07-20T21:30:00+00:00',
            registrationCloses: '2025-07-22T22:30:00+00:00',
            startTime: '2025-07-24T21:30:00+00:00',
            endTime: '2025-07-26T22:30:00+00:00',
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
            externalPage: 'https://google.com',
            waitlistForm: 'https://waitlist.form',
        };
        (useUserData as Mock).mockReturnValue({
            user: mockUser,
        });
        mockGetEventById = vi.fn().mockResolvedValue(mockEvent);
        mockGetAttendee = vi.fn().mockResolvedValue({ attendeeId: 'id' });
        vi.mocked(useEvents, { partial: true }).mockReturnValue({
            getById: mockGetEventById,
            getAttendee: mockGetAttendee,
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
        mockGetEventById.mockResolvedValueOnce(undefined);

        await renderComponent();

        expect(
            screen.getByText('an error occurred fetching event details... try refreshing.')
        ).toBeInTheDocument();
    });

    it('shows event information', async () => {
        await renderComponent();

        expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
        expect(screen.getByText('Product Conference')).toBeInTheDocument();
        expect(screen.getByText('Thursday, 24th July 2025')).toBeInTheDocument();
        expect(screen.getByText('UBC Sauder Building')).toBeInTheDocument();
        expect(screen.getByText('Member price: 1$')).toBeInTheDocument();
        expect(screen.getByText('Non-member price: 2$')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', mockEvent.thumbnail);
    });

    it('shows event info when not authenticated', async () => {
        vi.spyOn(Date, 'now').mockImplementation(() => mockRegistrationOpenDate);
        mockUseAuth0.mockReturnValue({ isAuthenticated: false });
        await renderComponent();

        expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
        expect(screen.getByText('Product Conference')).toBeInTheDocument();
        expect(screen.getByText('Thursday, 24th July 2025')).toBeInTheDocument();
        expect(screen.getByText('UBC Sauder Building')).toBeInTheDocument();
        expect(screen.getByText('Member price: 1$')).toBeInTheDocument();
        expect(screen.getByText('Non-member price: 2$')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Please sign in to register');
        expect(screen.getByRole('img')).toHaveAttribute('src', mockEvent.thumbnail);
    });

    describe('register button text', () => {
        it('when registration hasnt opened', async () => {
            vi.spyOn(Date, 'now').mockImplementation(() => mockBeforeRegistrationDate);
            mockGetEventById.mockResolvedValueOnce({ ...mockEvent, registered: 10 });
            mockGetAttendee.mockResolvedValueOnce(null);

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent('Registration opens soon!');
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
        });

        it('when registration is open with questions, modal appears on click', async () => {
            const user = userEvent.setup();
            vi.spyOn(Date, 'now').mockImplementation(() => mockRegistrationOpenDate);
            mockGetEventById.mockResolvedValueOnce({
                ...mockEvent,
                registered: 10,
                eventFormQuestions: {
                    questions: [
                        {
                            id: 'q1',
                            type: 'dropdown',
                            label: 'How familiar are you with product management?',
                            options: ['Beginner', 'Intermediate', 'Advanced', 'Mentor'],
                            required: true,
                        },
                    ],
                },
            });

            mockGetAttendee.mockResolvedValue(null);

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent('Register now!');

            await act(() => user.click(screen.getByRole('button')));

            expect(screen.getByText('Event Registration')).toBeInTheDocument();
        });

        it('when registration is open with no questions, no modal should appear on click', async () => {
            const user = userEvent.setup();
            vi.spyOn(Date, 'now').mockImplementation(() => mockRegistrationOpenDate);

            mockGetEventById.mockResolvedValueOnce({
                ...mockEvent,
                registered: 10,
                eventFormQuestions: { questions: [] },
            });
            mockGetAttendee.mockResolvedValue(null);

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent('Register now!');

            await act(() => user.click(screen.getByRole('button')));
            expect(screen.queryByText('Event Registration')).not.toBeInTheDocument();
        });

        it('when registration closes', async () => {
            vi.spyOn(Date, 'now').mockImplementation(() => mockRegistrationClosed);
            mockGetEventById.mockResolvedValueOnce({ ...mockEvent, registered: 10 });
            mockGetAttendee.mockResolvedValue(null);

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent('Registration has closed');
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
        });

        it('when full', async () => {
            vi.spyOn(Date, 'now').mockImplementation(() => mockRegistrationOpenDate);
            mockGetEventById.mockResolvedValueOnce({ ...mockEvent, registered: 100 });

            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent(
                'Sorry! This event is full. Join the waitlist!'
            );
            expect(screen.getByRole('button')).not.toHaveAttribute('disabled');
        });

        it('when already registered', async () => {
            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent("You're already registered!");
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
        });

        it('user not signed in', async () => {
            const user = userEvent.setup();
            mockUseAuth0.mockReturnValue({ isAuthenticated: false });
            await renderComponent();
            expect(mockGetEventById).toHaveBeenCalledWith(mockEventId);
            expect(screen.getByRole('button')).toHaveTextContent('Please sign in to register');

            await act(() => user.click(screen.getByRole('button')));

            expect(mockNavigateTo).toHaveBeenCalledWith('/');
        });
    });
});
