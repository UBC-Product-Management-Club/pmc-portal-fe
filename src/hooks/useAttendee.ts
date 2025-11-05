import { useCallback, useMemo } from 'react';
import { AttendeeService } from '../service/AttendeeService';
import { AttendeeSchema } from '../types/Attendee';

function useAttendee() {
    const attendeeService = useMemo(() => new AttendeeService(), []);

    const getAttendee = useCallback(
        async (eventId: string) => {
            const attendee = AttendeeSchema.safeParse(await attendeeService.getAttendee(eventId));
            return attendee.success ? attendee.data : null;
        },
        [attendeeService]
    );

    const deleteAttendee = useCallback(
        async (attendeeId: string) => {
            return await attendeeService.deleteAttendee(attendeeId);
        },
        [attendeeService]
    );

    return { getAttendee, deleteAttendee };
}

export { useAttendee };
