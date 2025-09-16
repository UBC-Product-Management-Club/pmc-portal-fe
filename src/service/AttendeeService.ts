import { RestClient } from './RestClient';

class AttendeeService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/attendee`);
    }

    deleteAttendee(attendeeId: string): Promise<{ message: string }> {
        return this.client.delete<{ message: string }>(`/${attendeeId}/delete`);
    }
}

export { AttendeeService };
