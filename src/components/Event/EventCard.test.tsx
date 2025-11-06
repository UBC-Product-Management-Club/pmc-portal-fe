import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { EventCard } from './EventCard';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

vi.mock('moment', () => {
    return {
        default: () => ({
            format: (fmt: string) => {
                if (fmt === 'MMMM D, YYYY') return 'July 22, 2025';
                if (fmt === 'HH.mm') return '12:30';
                return 'Mocked Date';
            },
            isSame: (date: string, unit: string) => {
                return date && unit;
            },
        }),
    };
});

// TODO: Add multi-date tests
describe('EventCard', () => {
    const event = {
        eventId: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
        name: 'test product conference',
        blurb: 'test event product conference',
        date: '2025-08-02',
        startTime: '2025-08-02T15:30:00+00:00',
        endTime: '2025-08-03t00:00:00+00:00',
        location: 'sauder building',
        memberPrice: 5,
        nonMemberPrice: 10,
        thumbnail: 'url1',
        memberOnly: false,
        isDisabled: false,
        externalPage: null,
    };

    async function renderComponent(disabled?: boolean) {
        return render(
            <BrowserRouter>
                <EventCard
                    event={event}
                    disabled={disabled ?? false}
                    link={`/events/${event.eventId}/register`}
                />
            </BrowserRouter>
        );
    }

    it('renders event card', async () => {
        await renderComponent();

        expect(screen.getByText('July 22, 2025')).toBeInTheDocument();
        expect(screen.getByText('Mocked Date - Mocked Date | sauder building')).toBeInTheDocument();
        expect(screen.getByText(event.name)).toBeInTheDocument();
        expect(screen.getByText(event.blurb)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', event.thumbnail);
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            `/events/${event.eventId}/register`
        );
    });

    it('renders event card with external url', async () => {
        render(
            <BrowserRouter>
                <EventCard event={event} disabled={false} link="https://external_page.com" />
            </BrowserRouter>
        );

        expect(screen.getByText('July 22, 2025')).toBeInTheDocument();
        expect(screen.getByText('Mocked Date - Mocked Date | sauder building')).toBeInTheDocument();
        expect(screen.getByText(event.name)).toBeInTheDocument();
        expect(screen.getByText(event.blurb)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', event.thumbnail);
        expect(screen.queryByRole('link')).toHaveAttribute('href', 'https://external_page.com');
    });

    it('renders event card for disabled event', async () => {
        await renderComponent(true);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('goes to the event page', async () => {
        const user = userEvent.setup();
        await renderComponent();

        await act(() => user.click(screen.getByRole('link')));
        expect(window.location.pathname).toBe(`/events/${event.eventId}/register`);
    });
});
