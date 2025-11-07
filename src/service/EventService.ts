import { Attendee } from '../types/Attendee';
import { Event, EventCard } from '../types/Event';
import { RestClient } from './RestClient';

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

    getAttendee(eventId: string): Promise<Attendee> {
        return this.client.get<Attendee>(`/${eventId}/attendee`);
    }

    addAttendee(eventId: string, eventFormAnswers: FormData): Promise<AddAttendeeResponse> {
        return this.client.post<AddAttendeeResponse>(`/${eventId}/register`, eventFormAnswers);
    }

    loadDraft(eventId: string, userId: string): Promise<Record<string, JsonValue> | null> {
        return this.client.get<Record<string, JsonValue> | null>(
            `/drafts/${eventId}?userId=${userId}`
        );
    }

    saveDraft(eventId: string, userId: string, draft: Record<string, JsonValue>): Promise<void> {
        return this.client.post<void>(`/drafts/${eventId}`, JSON.stringify({ userId, draft }));
    }

    deleteDraft(eventId: string, userId: string): Promise<void> {
        return this.client.delete<void>(`/drafts/${eventId}?userId=${userId}`);
    }
}

export { EventService };
