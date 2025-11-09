import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { EventCard } from './EventCard';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('EventCard', () => {
    const event = {
        eventId: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
        name: 'test product conference',
        blurb: 'test event product conference',
        date: '2025-08-02',
        startTime: '2025-08-02T15:30:00+00:00',
        endTime: '2025-08-02T16:00:00+00:00',
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

        expect(screen.getByText('August 2, 2025')).toBeInTheDocument();
        expect(screen.getByText('8:30 AM - 9:00 AM | sauder building')).toBeInTheDocument();
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

        expect(screen.getByText('August 2, 2025')).toBeInTheDocument();
        expect(screen.getByText('8:30 AM - 9:00 AM | sauder building')).toBeInTheDocument();
        expect(screen.getByText(event.name)).toBeInTheDocument();
        expect(screen.getByText(event.blurb)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', event.thumbnail);
        expect(screen.queryByRole('link')).toHaveAttribute('href', 'https://external_page.com');
    });

    it('renders event card for disabled event', async () => {
        await renderComponent(true);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('event card for multi-day event', async () => {
        render(
            <BrowserRouter>
                <EventCard
                    event={{ ...event, endTime: '2025-08-03T16:00:00+00:00' }}
                    disabled={false}
                    link={`/events/${event.eventId}`}
                />
            </BrowserRouter>
        );
        expect(screen.getByText('August 2 - 3, 2025')).toBeInTheDocument();
        expect(
            screen.getByText('August 2, 8:30 AM - August 3, 9:00 AM | sauder building')
        ).toBeInTheDocument();
        expect(screen.getByText(event.name)).toBeInTheDocument();
        expect(screen.getByText(event.blurb)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', event.thumbnail);
        expect(screen.getByRole('link')).toHaveAttribute('href', `/events/${event.eventId}`);
    });

    it('goes to the event page', async () => {
        const user = userEvent.setup();
        await renderComponent();

        await act(() => user.click(screen.getByRole('link')));
        expect(window.location.pathname).toBe(`/events/${event.eventId}/register`);
    });
});
