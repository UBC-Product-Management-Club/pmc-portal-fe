import { Attendee, TeamResponse } from '../types/Attendee';
import { RestClient } from './RestClient';

class AttendeeService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/attendee`);
    }

    getAttendee(eventId: string): Promise<Attendee> {
        return this.client.get<Attendee>(`/${eventId}`);
    }

    deleteAttendee(eventId: string): Promise<{ message: string }> {
        return this.client.delete<{ message: string }>(`/${eventId}`);
    }

    getTeammates(eventId: string): Promise<TeamResponse> {
        return this.client.get<TeamResponse>(`/${eventId}/team`);
    }
}

export { AttendeeService };
