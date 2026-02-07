import { RestClient } from './RestClient';

export interface DeliverableFlag {
    id: string;
    event_id: string;
    starttime: string;
    deadline: string;
    is_enabled: boolean;
}

export interface DeliverableFlagsResponse {
    data: DeliverableFlag[];
    count: number | null;
    status: number;
    statusText: string;
}

class DeliverableFlagService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
    }

    getFlags(eventId: string): Promise<DeliverableFlagsResponse> {
        return this.client.get<DeliverableFlagsResponse>(`/${eventId}/flags`);
    }
}

export { DeliverableFlagService };
