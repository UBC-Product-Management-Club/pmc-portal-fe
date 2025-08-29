import { useCallback, useMemo } from 'react';
import { EventService } from '../service/EventService';
import { EventCard, EventCardsSchema, EventSchema } from '../types/Event';

function useEvents() {
    const eventService = useMemo(() => new EventService(), []);

    const getAll = useCallback(async (): Promise<EventCard[]> => {
        const data = await eventService.getAll();
        return EventCardsSchema.parse(data);
    }, [eventService]);

    const getUserCurrentEvents = useCallback(
        async (userId: string): Promise<EventCard[]> => {
            const data = await eventService.getUserCurrentEvents(userId);
            return EventCardsSchema.parse(data);
        },
        [eventService]
    );
    const getById = useCallback(
        async (eventId: string, userId: string) => {
            const event = EventSchema.parse(await eventService.getById(eventId));
            const attendee = await eventService.getAttendee(eventId, userId); //IDK if this is working as intended. (jeff)
            return { event, registered: attendee !== null };
        },
        [eventService]
    );

    const addAttendee = useCallback(
        async (eventId: string, userId: string, eventFormAnswers: Record<string, any>) => {
            return await eventService.addAttendee(eventId, userId, eventFormAnswers);
        },
        [eventService]
    );

    return { getAll, getUserCurrentEvents, getById, addAttendee};
}
export { useEvents };
