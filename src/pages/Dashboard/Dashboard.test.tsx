import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
            getAnnouncements: vi.fn().mockResolvedValue([
                { announcementId: '1', title: 'Welcome back', body: 'Hello', audience: 'everyone' },
                {
                    announcementId: '2',
                    title: 'Become a member',
                    body: 'Save',
                    audience: 'non_members',
                },
                { announcementId: '3', title: 'Member perks', body: 'Thanks', audience: 'members' },
            ]),
        });
    });

    const renderPage = () =>
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

    describe('check-in code', () => {
        const withRows = (rows: { eventId: string; status: string }[]) => {
            (useUserData as Mock).mockReturnValue({
                user: { firstName: 'Simoon', userId: 'google-oauth2|1234' },
            });
            getStatuses.mockResolvedValue(
                rows.map((row) => ({ ...row, hasDraft: false, paymentDueAt: null }))
            );
        };

        it('shows when registered for an upcoming event', async () => {
            withRows([{ eventId: 'a', status: 'REGISTERED' }]);
            renderPage();
            const section = (await screen.findByText('Your check-in code')).closest('section')!;
            expect(within(section).getByTitle('Your check-in QR code')).toBeInTheDocument();
        });

        it('goes full screen from the corner button and closes on Escape', async () => {
            withRows([{ eventId: 'a', status: 'REGISTERED' }]);
            renderPage();
            fireEvent.click(await screen.findByLabelText('Show badge full screen'));
            const dialog = screen.getByRole('dialog', { name: 'Your check-in badge' });
            expect(within(dialog).getByTitle('Your check-in QR code')).toBeInTheDocument();
            fireEvent.keyDown(window, { key: 'Escape' });
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it.each([
            [
                'only applied or accepted',
                [
                    { eventId: 'a', status: 'APPLIED' },
                    { eventId: 'b', status: 'ACCEPTED' },
                ],
            ],
            ['registered only for a past event', [{ eventId: 'c', status: 'REGISTERED' }]],
            ['registered only for a disabled event', [{ eventId: 'd', status: 'REGISTERED' }]],
        ])('hides when %s', async (_, rows) => {
            withRows(rows);
            renderPage();
            await screen.findByText('Upcoming Events');
            await waitFor(() => expect(getStatuses).toHaveBeenCalled());
            expect(screen.queryByText('Your check-in code')).not.toBeInTheDocument();
        });

        it('hides until the user has loaded', async () => {
            renderPage();
            await screen.findByText('Upcoming Events');
            expect(screen.queryByText('Your check-in code')).not.toBeInTheDocument();
        });
    });

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
    });

    it('shows one action per card: Register, or View Event once applied or past', async () => {
        renderPage();
        const card = async (name: string) =>
            within((await screen.findByText(name)).closest('article')!);
        const links = async (name: string) =>
            (await card(name)).getAllByRole('link').map((link) => link.textContent);

        expect(await links('Later Event')).toEqual(['Register']);
        expect(await links('Soon Event')).toEqual(['View Event']);
        expect(await links('Old Event')).toEqual(['View Event']);
        expect(screen.queryByText('Registration closed')).not.toBeInTheDocument();
    });

    it('shows the status badge, with the attendee row winning over a draft', async () => {
        renderPage();
        expect(await screen.findByText('Under review')).toBeInTheDocument();
        expect(screen.queryByText('Draft')).not.toBeInTheDocument();
    });

    it('shows a non-member the membership offer but not member-only news', async () => {
        renderPage();
        expect(await screen.findByText('Become a member')).toBeInTheDocument();
        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.queryByText('Member perks')).not.toBeInTheDocument();
    });

    it('never shows a member the membership offer', async () => {
        (useUserData as Mock).mockReturnValue({ user: { firstName: 'Simoon' }, isMember: true });
        renderPage();
        expect(await screen.findByText('Member perks')).toBeInTheDocument();
        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.queryByText('Become a member')).not.toBeInTheDocument();
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
