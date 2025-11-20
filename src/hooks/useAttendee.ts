import { useCallback, useMemo } from 'react';
import { AttendeeService } from '../service/AttendeeService';
import { AttendeeSchema } from '../types/Attendee';

function useAttendee() {
    const attendeeService = useMemo(() => new AttendeeService(), []);

    const getAttendee = useCallback(
        async (eventId: string) => {
            const attendee = await attendeeService.getAttendee(eventId);
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

    const getTeammates = useCallback(
        async (eventId: string) => {
            return await attendeeService.getTeammates(eventId);
        },
        [attendeeService]
    );

    return { getAttendee, deleteAttendee, getTeammates };
}

export { useAttendee };
