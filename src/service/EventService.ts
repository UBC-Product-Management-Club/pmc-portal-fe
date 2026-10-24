import { z } from 'zod/v4';
import { Attendee } from '../types/Attendee';
import { Event, EventCard } from '../types/Event';
import { RegisteredContentSchema } from '../types/EventDay';
import { RestClient } from './RestClient';

export type RawRegisteredContent = z.input<typeof RegisteredContentSchema>;

export type AddAttendeeResponse = {
    message: string;
    attendee: Attendee;
};

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

class EventService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
    }

    getAll(): Promise<EventCard[]> {
        return this.client.get<EventCard[]>('/');
    }

    getUserCurrentEvents(): Promise<EventCard[]> {
        return this.client.get<EventCard[]>(`/events/registered`);
    }

    getById(eventId: string): Promise<Event> {
        return this.client.get<Event>(`/${eventId}`);
    }

    addAttendee(eventId: string, eventFormAnswers: FormData): Promise<AddAttendeeResponse> {
        return this.client.post<AddAttendeeResponse>(`/${eventId}/register`, eventFormAnswers);
    }

    loadDraft(eventId: string): Promise<Record<string, JsonValue> | null> {
        return this.client.get<Record<string, JsonValue> | null>(`/drafts/${eventId}`);
    }

    // version is the draft version this save builds on; an out-of-date save is a 409 STALE_DRAFT
    saveDraft(eventId: string, draft: Record<string, JsonValue>, version?: number): Promise<void> {
        return this.client.post<void>(`/drafts/${eventId}`, JSON.stringify({ draft, version }));
    }

    deleteDraft(eventId: string): Promise<void> {
        return this.client.delete<void>(`/drafts/${eventId}`);
    }

    // Registered students only
    getRegisteredContent(eventId: string): Promise<RawRegisteredContent> {
        return this.client.get<RawRegisteredContent>(`/${eventId}/registered-content`);
    }
}

export { EventService };
