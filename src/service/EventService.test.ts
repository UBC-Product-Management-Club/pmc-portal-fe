import { describe, expect, it, vi } from 'vitest';
import { RestClient } from './RestClient';
import { EventService } from './EventService';

describe('EventService', () => {
    const mockClient = {
        get: vi.fn(),
    };

    const service = new EventService(mockClient as unknown as RestClient);

    const testEvents = [
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

    it('fetches all events', async () => {
        mockClient.get.mockResolvedValueOnce(testEvents);

        const events = await service.getAll();

        expect(events).toEqual(testEvents);
        expect(mockClient.get).toHaveBeenCalledWith('/');
    });
});
