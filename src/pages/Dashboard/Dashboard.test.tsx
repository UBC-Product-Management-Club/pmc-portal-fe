import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useEvents } from '../../hooks/useEvents';
import Dashboard from './Dashboard';

vi.mock('../../providers/UserData/UserDataProvider', () => ({
    useUserData: vi.fn(),
}));
vi.mock('../../hooks/useEvents');

const day = 24 * 60 * 60 * 1000;
const iso = (offset: number) => new Date(Date.now() + offset).toISOString();

const event = (eventId: string, name: string, start: number, extra = {}) => ({
    eventId,
    name,
    blurb: `${name} tagline`,
    date: iso(start).slice(0, 10),
    startTime: iso(start),
    endTime: iso(start + day / 4),
    location: 'Sauder',
    thumbnail: null,
    memberPrice: 3,
    nonMemberPrice: 8,
    isDisabled: false,
    ...extra,
});

describe('Dashboard', () => {
    let getStatuses: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        (useUserData as Mock).mockReturnValue({ user: { firstName: 'Simoon' } });
        getStatuses = vi
            .fn()
            .mockResolvedValue([
                { eventId: 'b', status: 'APPLIED', hasDraft: true, paymentDueAt: null },
            ]);
        vi.mocked(useEvents, { partial: true }).mockReturnValue({
            getAll: vi
                .fn()
                .mockResolvedValue([
                    event('a', 'Later Event', 10 * day),
                    event('b', 'Soon Event', 2 * day),
                    event('c', 'Old Event', -10 * day),
                    event('d', 'Hidden Event', 3 * day, { isDisabled: true }),
                ]),
            getStatuses,
            getAnnouncements: vi
                .fn()
                .mockResolvedValue([{ announcementId: '1', title: 'Welcome back', body: 'Hello' }]),
        });
    });

    const renderPage = () =>
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

    it('greets the student by first name', async () => {
        renderPage();
        expect(await screen.findByText('Hey, Simoon!')).toBeInTheDocument();
    });

    it('splits upcoming and past events, soonest first, without disabled ones', async () => {
        renderPage();
        const upcoming = (await screen.findByText('Upcoming Events')).closest('section')!;
        const names = within(upcoming)
            .getAllByRole('heading', { level: 3 })
            .map((h) => h.textContent);
        expect(names).toEqual(['Soon Event', 'Later Event']);
        expect(screen.queryByText('Hidden Event')).not.toBeInTheDocument();

        const past = screen.getByText('Past Events').closest('section')!;
        expect(within(past).getByText('Old Event')).toBeInTheDocument();
        expect(within(past).getByRole('button', { name: 'Registration closed' })).toBeDisabled();
    });

    it('shows the status badge, with the attendee row winning over a draft', async () => {
        renderPage();
        expect(await screen.findByText('Under review')).toBeInTheDocument();
        expect(screen.queryByText('Draft')).not.toBeInTheDocument();
    });

    it('shows announcements and lets the section collapse', async () => {
        renderPage();
        expect(await screen.findByText('Welcome back')).toBeVisible();
        screen.getByRole('button', { name: 'Collapse announcements' }).click();
        expect(await screen.findByRole('button', { name: 'Expand announcements' })).toHaveAttribute(
            'aria-expanded',
            'false'
        );
    });
});
