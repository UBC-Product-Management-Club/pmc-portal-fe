import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEvents } from './useEvents';
import { EventService } from '../service/EventService';

vi.mock('../service/EventService');

describe('useEvents', () => {
    let mockEventService: Mock;
    let mockGetAllEvents: Mock;
    const rawEvents = [
        {
            event_id: 'd8651b2d-7337-4f7c-81f8-62190ee71d0c',
            name: 'Test Product Conference',
            description: 'test event product conference',
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
            description: '"Test event"',
            date: '2025-08-01',
            start_time: '2025-08-01T09:00:00+00:00',
            end_time: '2025-08-01T17:00:00+00:00',
            location: '"AMS Nest"',
            member_price: 3,
            non_member_price: 50,
            thumbnail: 'https://someurl.com',
            is_disabled: false,
        },
        {
            event_id: '3f8b1a2e-7d9c-4f5e-8a2b-9c7e4d123f45',
            name: 'test product sprint',
            description: 'product sprint yay',
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
            description: 'test event product conference',
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
            description: '"Test event"',
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
            description: 'product sprint yay',
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

    beforeEach(() => {
        mockGetAllEvents = vi.fn().mockResolvedValue(rawEvents);
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
});
