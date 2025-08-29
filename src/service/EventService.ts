import { Attendee } from '../types/Attendee';
import { Event, EventCard } from '../types/Event';
import { RestClient } from './RestClient';

export type AddAttendeeResponse = {
  message: string;
  attendee: Attendee;
};

class EventService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
    }

    getAll(): Promise<EventCard[]> {
        return this.client.get<EventCard[]>('/');
    }

    getUserCurrentEvents(userId: string): Promise<EventCard[]> {
        return this.client.get<EventCard[]>(`/user-events/${userId}`);
    }

    getById(eventId: string): Promise<Event> {
        return this.client.get<Event>(`/${eventId}`);
    }

    getAttendee(eventId: string, userId: string): Promise<Attendee> {
        return this.client.get<Attendee>(`/${eventId}?userId=${userId}`);
    }

    addAttendee(eventId: string, userId: string, eventFormAnswers: Record<string, any>): Promise<AddAttendeeResponse> {
        const payload = {
            userId,
            eventFormAnswers,
        };
        return this.client.post<AddAttendeeResponse>(`/${eventId}/register/member`, JSON.stringify(payload))
    }
}

export { EventService };
