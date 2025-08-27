import { useCallback, useMemo } from 'react';
import { EventService } from '../service/EventService';
import { EventCard, EventCardsSchema, EventSchema } from '../types/Event';

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
            const event = EventSchema.parse(await eventService.getById(eventId));
            const attendee = await eventService.getAttendee(eventId);
            return { event, registered: attendee !== null };
        },
        [eventService]
    );

    return { getAll, getUserCurrentEvents, getById };
}
export { useEvents };
