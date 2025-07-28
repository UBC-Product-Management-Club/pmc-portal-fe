import { EventService } from '../service/EventService';
import { EventCard, EventCardsSchema } from '../types/Event';

function useEvents() {
    const eventService = new EventService();

    async function getAll(): Promise<EventCard[]> {
        return EventCardsSchema.parse(await eventService.getAll());
    }

    return { getAll };
}

export { useEvents };
