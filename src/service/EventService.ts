import { Attendee } from '../types/Attendee';
import { Event, EventCard } from '../types/Event';
import { RestClient } from './RestClient';

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
        return this.client.get<Attendee>(`/${eventId}`);
    }
}

export { EventService };
