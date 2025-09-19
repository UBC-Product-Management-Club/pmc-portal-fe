import { useCallback, useMemo } from 'react';
import { EventService } from '../service/EventService';
import { EventCard, EventCardsSchema, EventSchema } from '../types/Event';
import { AttendeeSchema } from '../types/Attendee';

function useEvents() {
    const eventService = useMemo(() => new EventService(), []);

    const getAll = useCallback(async (): Promise<EventCard[]> => {
        const data = await eventService.getAll();
        return EventCardsSchema.parse(data);
    }, [eventService]);

    const getUserCurrentEvents = useCallback(async (): Promise<EventCard[]> => {
        const data = await eventService.getUserCurrentEvents();
        return EventCardsSchema.parse(data);
    }, [eventService]);

    const getById = useCallback(
        async (eventId: string) => {
            return EventSchema.parse(await eventService.getById(eventId));
        },
        [eventService]
    );

    const addAttendee = useCallback(
        async (eventId: string, eventFormAnswers: FormData) => {
            return await eventService.addAttendee(eventId, eventFormAnswers);
        },
        [eventService]
    );

    const getAttendee = useCallback(
        async (eventId: string) => {
            const attendee = await eventService.getAttendee(eventId);
            return attendee !== null ? AttendeeSchema.parse(attendee) : null;
        },
        [eventService]
    );

    return { getAll, getUserCurrentEvents, getById, addAttendee, getAttendee };
}
export { useEvents };
