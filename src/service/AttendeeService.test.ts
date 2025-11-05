import { describe, expect, it, vi } from 'vitest';
import { RestClient } from './RestClient';
import { AttendeeService } from './AttendeeService';

describe('AttendeeService', () => {
    const mockClient = {
        get: vi.fn(),
        delete: vi.fn(),
    };

    const service = new AttendeeService(mockClient as unknown as RestClient);

    const mockAttendee = {
        userId: 'user_id',
        eventId: 'event_id',
        eventFormAnswers: {},
        attendeeId: 'attendee_id',
        createdAt: 'reg_time',
        lastUpdated: '',
        isPaymentVerified: true,
        status: 'registered',
        paymentId: 'payment_id',
    };

    it('get an attendee by event_id', async () => {
        mockClient.get.mockResolvedValueOnce(mockAttendee);

        const attendee = await service.getAttendee('event_id');

        expect(mockClient.get).toHaveBeenCalledWith('/event_id');
        expect(attendee).toEqual(mockAttendee);
    });

    it('get a non-existent attendee', async () => {
        mockClient.get.mockResolvedValueOnce(null);

        const attendee = await service.getAttendee('event_id');
        expect(mockClient.get).toHaveBeenCalledWith('/event_id');
        expect(attendee).toEqual(null);
    });

    it('deletes an attendee by attendee_id', async () => {
        mockClient.delete.mockResolvedValueOnce({ message: 'deleted attendee!' });
        const result = await service.deleteAttendee('attendee_id');
        expect(mockClient.delete).toHaveBeenCalledWith('/attendee_id');
        expect(result).toEqual({ message: 'deleted attendee!' });
    });
});
