import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/Event/EventCard';
import { type EventCard as EventCardType } from '../../types/Event';
import { act, render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

vi.mock('../../providers/UserData/UserDataProvider', () => ({
    useUserData: vi.fn(),
}));
vi.mock('../../hooks/useEvents');
vi.mock('../../components/Event/EventCard');

describe('Dashboard', () => {
    let mockUseUserData: Mock;
    let mockGetAllEvents: Mock;
    const testEvents = [
        {
            eventId: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
            name: 'test product conference',
            description: 'test event product conference',
            date: '2025-08-02',
            startTime: '2025-08-02t15:30:00+00:00',
            endTime: '2025-08-03t00:00:00+00:00',
            location: 'sauder building',
            memberPrice: 5,
            nonMemberPrice: 10,
            thumbnail: 'url1',
        },
        {
            eventId: '889b13e2-3c59-4757-96a8-10618132e1d5',
            name: '"Sample Event"',
            description: '"Test event"',
            date: '2025-08-01',
            startTime: '2025-08-01T09:00:00+00:00',
            endTime: '2025-08-01T17:00:00+00:00',
            location: '"AMS Nest"',
            memberPrice: 3,
            nonMemberPrice: 50,
            thumbnail: 'url2',
        },
        {
            eventId: '3f8b1a2e-7d9c-4f5e-8a2b-9c7e4d123f45',
            name: 'test product sprint',
            description: 'product sprint yay',
            date: '2026-09-01',
            startTime: '2026-09-01T20:30:00+00:00',
            endTime: '2026-09-02T08:00:00+00:00',
            location: 'ubc henry angus',
            memberPrice: 8,
            nonMemberPrice: 20,
            thumbnail: 'url3',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetAllEvents = vi.fn().mockResolvedValue(testEvents);
        mockUseUserData = (useUserData as Mock).mockReturnValue({
            user: undefined,
        });
        vi.mocked(useEvents, { partial: true }).mockReturnValue({
            getAll: mockGetAllEvents,
        });
        vi.mocked(EventCard).mockImplementation(({ event }: { event: EventCardType }) => {
            return (
                <>
                    <div>{event.eventId}</div>
                    <div>{event.name}</div>
                    <div>{event.date}</div>
                    <div>{event.location}</div>
                    <div>{event.description}</div>
                    <div>{event.startTime}</div>
                    <div>{event.endTime}</div>
                    <div>{event.thumbnail}</div>
                    <div>{event.nonMemberPrice}</div>
                    <div>{event.memberPrice}</div>
                </>
            );
        });
    });

    async function renderComponent() {
        return render(<Dashboard />);
    }

    it('renders member name when logged in', async () => {
        mockUseUserData.mockReturnValueOnce({
            user: { firstName: 'geary' },
        });
        await renderComponent();

        expect(screen.getByText('Welcome geary')).toBeInTheDocument();
    });

    it("renders loading when events haven't loaded", async () => {
        mockGetAllEvents.mockResolvedValueOnce(new Promise(() => {}));
        await renderComponent();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders stay tuned text when no events', async () => {
        mockGetAllEvents.mockResolvedValueOnce([]);
        await act(() => renderComponent());

        expect(screen.getByText('Stay tuned for future events!')).toBeInTheDocument();
    });

    it('renders error message when events fail to fetch', async () => {
        mockGetAllEvents.mockRejectedValueOnce(new Error('Error fetching events'));
        await act(() => renderComponent());

        expect(screen.getByText('An error occurred fetching events :(')).toBeInTheDocument();
    });

    it('renders events correctly', async () => {
        await act(() => renderComponent());

        testEvents.map((event) => {
            Object.values(event).map((value) => {
                expect(screen.getByText(value)).toBeInTheDocument();
            });
        });
    });

    it('renders Membership ad when not member', async () => {
        mockUseUserData.mockReturnValueOnce({
            user: { firstName: 'geary' },
            isMember: false,
        });
        await renderComponent();
        expect(
            screen.getByText(/want to become a member and enjoy discounted event prices/i)
        ).toBeInTheDocument();
    });

    it('does not render Membership ad when member', async () => {
        mockUseUserData.mockReturnValueOnce({
            user: { firstName: 'geary' },
            isMember: true,
        });
        await renderComponent();
        expect(
            screen.queryByText(/want to become a member and enjoy discounted event prices/i)
        ).not.toBeInTheDocument();
    });
});
