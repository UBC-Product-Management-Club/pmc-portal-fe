import { useCallback, useMemo } from 'react';
import { AttendeeService } from '../service/AttendeeService';

function useAttendee() {
    const attendeeService = useMemo(() => new AttendeeService(), []);

    const deleteAttendee = useCallback(
        async (attendeeId: string) => {
            return await attendeeService.deleteAttendee(attendeeId);
        },
        [attendeeService]
    );

    return { deleteAttendee };
}

export { useAttendee };
