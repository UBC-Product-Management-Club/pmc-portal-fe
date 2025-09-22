import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEvents } from './useEvents';
import { EventService } from '../service/EventService';

vi.mock('../service/EventService');

describe('useEvents', () => {
    let mockEventService: Mock;
    let mockGetAllEvents: Mock;
    let mockGetById: Mock;
    let mockGetAttendee: Mock;
    const rawEvents = [
        {
            event_id: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
            name: 'Test Product Conference',
            blurb: 'test event product conference',
            date: '2025-08-02',
            start_time: '2025-08-02T15:30:00+00:00',
            end_time: '2025-08-03T00:00:00+00:00',
            location: 'sauder building',
            member_price: 5,
            non_member_price: 10,
            thumbnail: 'https://someurl.com',
            is_disabled: false,
        },
        {
            event_id: '889b13e2-3c59-4757-96a8-10618132e1d5',
            name: '"Sample Event"',
            blurb: '"Test event"',
            date: '2025-08-01',
            start_time: '2025-08-01T09:00:00+00:00',
            end_time: '2025-08-01T17:00:00+00:00',
            location: '"AMS Nest"',
            member_price: 3,
            non_member_price: 50,
            thumbnail: 'https://someurl.com',
            is_disabled: false,
            registered: 0,
        },
        {
            event_id: '3f8b1a2e-7d9c-4f5e-8a2b-9c7e4d123f45',
            name: 'test product sprint',
            blurb: 'product sprint yay',
            date: '2026-09-01',
            start_time: '2026-09-01T20:30:00+00:00',
            end_time: '2026-09-02T08:00:00+00:00',
            location: 'ubc henry angus',
            member_price: 8,
            non_member_price: 20,
            thumbnail: 'https://someurl.com',
            is_disabled: true,
        },
    ];
    const parsedEvents = [
        {
            eventId: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
            name: 'Test Product Conference',
            blurb: 'test event product conference',
            date: '2025-08-02',
            startTime: '2025-08-02T15:30:00+00:00',
            endTime: '2025-08-03T00:00:00+00:00',
            location: 'sauder building',
            memberPrice: 5,
            nonMemberPrice: 10,
            thumbnail: 'https://someurl.com',
            isDisabled: false,
        },
        {
            eventId: '889b13e2-3c59-4757-96a8-10618132e1d5',
            name: '"Sample Event"',
            blurb: '"Test event"',
            date: '2025-08-01',
            startTime: '2025-08-01T09:00:00+00:00',
            endTime: '2025-08-01T17:00:00+00:00',
            location: '"AMS Nest"',
            memberPrice: 3,
            nonMemberPrice: 50,
            thumbnail: 'https://someurl.com',
            isDisabled: false,
        },
        {
            eventId: '3f8b1a2e-7d9c-4f5e-8a2b-9c7e4d123f45',
            name: 'test product sprint',
            blurb: 'product sprint yay',
            date: '2026-09-01',
            startTime: '2026-09-01T20:30:00+00:00',
            endTime: '2026-09-02T08:00:00+00:00',
            location: 'ubc henry angus',
            memberPrice: 8,
            nonMemberPrice: 20,
            thumbnail: 'https://someurl.com',
            isDisabled: true,
        },
    ];
    const event = {
        event_id: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
        name: 'Test Product Conference',
        blurb: 'test event product conference',
        description: 'test event product conference',
        date: '2025-08-02',
        registration_opens: '2025-08-02T15:30:00+00:00',
        start_time: '2025-08-02T15:30:00+00:00',
        end_time: '2025-08-03T00:00:00+00:00',
        location: 'sauder building',
        member_price: 5,
        non_member_price: 10,
        thumbnail: 'https://someurl.com',
        is_disabled: false,
        media: [],
        max_attendees: 100,
        event_form_questions: {},
        registered: 0,
        needs_review: false,
    };
    const parsedEvent = {
        eventId: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
        name: 'Test Product Conference',
        blurb: 'test event product conference',
        description: 'test event product conference',
        date: '2025-08-02',
        registrationOpens: '2025-08-02T15:30:00+00:00',
        startTime: '2025-08-02T15:30:00+00:00',
        endTime: '2025-08-03T00:00:00+00:00',
        location: 'sauder building',
        memberPrice: 5,
        nonMemberPrice: 10,
        thumbnail: 'https://someurl.com',
        isDisabled: false,
        media: [],
        maxAttendees: 100,
        eventFormQuestions: {},
        registered: 0,
        needsReview: false,
    };
    const rawAttendee = {
        user_id: '00000000-0000-0000-0000-000000000000',
        event_id: '00000000-0000-0000-0000-000000000000',
        event_form_answers: {},
        attendee_id: '00000000-0000-0000-0000-000000000000',
        registration_time: new Date().toISOString(),
        is_payment_verified: true,
        status: '',
        payment_id: '',
    };

    beforeEach(() => {
        mockGetAllEvents = vi.fn().mockResolvedValue(rawEvents);
        mockGetById = vi.fn().mockResolvedValue(event);
        mockGetAttendee = vi.fn().mockResolvedValue(null);
        mockEventService = vi.mocked(EventService);
    });

    it('fetches all events', async () => {
        mockEventService.mockReturnValueOnce({
            getAll: mockGetAllEvents,
        });
        const { result } = renderHook(() => useEvents());

        const events = await result.current.getAll();

        expect(events).toEqual(parsedEvents);
    });

    it('fetches an event', async () => {
        mockEventService.mockReturnValueOnce({
            getById: mockGetById,
            getAttendee: mockGetAttendee,
        });

        const { result } = renderHook(() => useEvents());

        const event = await result.current.getById('event_id');
        expect(event).toEqual(parsedEvent);
    });

    it('fetches a registered attendee for an event', async () => {
        mockGetAttendee.mockResolvedValueOnce(rawAttendee);
        mockEventService.mockReturnValueOnce({
            getById: mockGetById,
            getAttendee: mockGetAttendee,
        });

        const { result } = renderHook(() => useEvents());
        const attendee = await result.current.getAttendee('event_id');

        expect(Object.values(attendee!)).toEqual(Object.values(rawAttendee));
    });

    it('fetches a non-registered attendee for an event', async () => {
        mockGetAttendee.mockResolvedValueOnce(null);
        mockEventService.mockReturnValueOnce({
            getById: mockGetById,
            getAttendee: mockGetAttendee,
        });

        const { result } = renderHook(() => useEvents());
        const attendee = await result.current.getAttendee('event_id');

        expect(attendee).toEqual(null);
    });
});
