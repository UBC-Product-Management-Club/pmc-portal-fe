import { Attendee } from '../types/Attendee';
import { RestClient } from './RestClient';

class AttendeeService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/attendee`);
    }

    // sessionId is the Stripe session from the success redirect, so the server can say
    // the payment is processing while the webhook is on its way
    getAttendee(eventId: string, sessionId?: string): Promise<Attendee> {
        const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : '';
        return this.client.get<Attendee>(`/${eventId}${query}`);
    }

    deleteAttendee(eventId: string): Promise<{ message: string }> {
        return this.client.delete<{ message: string }>(`/${eventId}`);
    }
}

export { AttendeeService };
