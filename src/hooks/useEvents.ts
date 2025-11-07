import { useCallback, useMemo } from 'react';
import { EventService, JsonValue } from '../service/EventService';
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
            return EventSchema.parse(await eventService.getById(eventId));
        },
        [eventService]
    );

    const addAttendee = useCallback(
        async (eventId: string, eventFormAnswers: FormData) => {
            return eventService.addAttendee(eventId, eventFormAnswers);
        },
        [eventService]
    );

    const loadDraft = useCallback(
        async (eventId: string, userId: string) => {
            return eventService.loadDraft(eventId, userId);
        },
        [eventService]
    );

    const saveDraft = useCallback(
        async (eventId: string, userId: string, draft: Record<string, JsonValue>) => {
            return eventService.saveDraft(eventId, userId, draft);
        },
        [eventService]
    );

    const deleteDraft = useCallback(
        async (eventId: string, userId: string) => {
            return eventService.deleteDraft(eventId, userId);
        },
        [eventService]
    );

    return {
        getAll,
        getUserCurrentEvents,
        getById,
        addAttendee,
        loadDraft,
        saveDraft,
        deleteDraft,
    };
}
export { useEvents };
