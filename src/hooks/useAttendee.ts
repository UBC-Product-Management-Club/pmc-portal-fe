import { useCallback, useMemo } from 'react';
import { createAttendeeService } from '../service/services';
import { AttendeeSchema } from '../types/Attendee';

function useAttendee() {
    const attendeeService = useMemo(() => createAttendeeService(), []);

    const getAttendee = useCallback(
        async (eventId: string, sessionId?: string) => {
            const attendee = await attendeeService.getAttendee(eventId, sessionId);
            return attendee ? AttendeeSchema.parse(attendee) : null;
        },
        [attendeeService]
    );

    const deleteAttendee = useCallback(
        async (eventId: string) => {
            return await attendeeService.deleteAttendee(eventId);
        },
        [attendeeService]
    );

    return { getAttendee, deleteAttendee };
}

export { useAttendee };
