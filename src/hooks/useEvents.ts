import { useCallback, useMemo } from 'react';
import { JsonValue } from '../service/EventService';
import { createEventService } from '../service/services';
import { EventCard, EventCardsSchema, EventSchema } from '../types/Event';
import { RegisteredContentSchema } from '../types/EventDay';

function useEvents() {
    const eventService = useMemo(() => createEventService(), []);

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
        async (eventId: string) => {
            return eventService.loadDraft(eventId);
        },
        [eventService]
    );

    const saveDraft = useCallback(
        async (eventId: string, draft: Record<string, JsonValue>, version?: number) => {
            return eventService.saveDraft(eventId, draft, version);
        },
        [eventService]
    );

    const deleteDraft = useCallback(
        async (eventId: string) => {
            return eventService.deleteDraft(eventId);
        },
        [eventService]
    );

    const getRegisteredContent = useCallback(
        async (eventId: string) => {
            return RegisteredContentSchema.parse(await eventService.getRegisteredContent(eventId));
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
        getRegisteredContent,
    };
}
export { useEvents };
