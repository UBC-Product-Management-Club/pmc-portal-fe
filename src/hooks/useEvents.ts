import { useCallback, useMemo } from 'react';
import { EventService } from '../service/EventService';
import { EventCard, EventCardsSchema } from '../types/Event';

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

    return { getAll, getUserCurrentEvents };
}

export { useEvents };
