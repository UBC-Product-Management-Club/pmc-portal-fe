import { EventCard } from '../types/Event';
import { RestClient } from './RestClient';

class EventService {
    private client: RestClient;

    constructor(client?: RestClient) {
        //this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
        this.client = client ?? new RestClient(`http://localhost:8000/api/v2/events`);
    }

    getAll(): Promise<EventCard[]> {
        return this.client.get<EventCard[]>('/');
    }
}

export { EventService };
