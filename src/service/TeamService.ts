import { TeamResponse } from '../types/Team';
import { RestClient } from './RestClient';

class TeamService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
    }

    getTeam(eventId: string): Promise<TeamResponse> {
        return this.client.get<TeamResponse>(`/${eventId}/team`);
    }

    createTeam(eventId: string, teamName: string): Promise<TeamResponse> {
        return this.client.post<TeamResponse>(
            `/${eventId}/team`,
            JSON.stringify({ team_name: teamName })
        );
    }

    joinTeam(eventId: string, teamCode: string): Promise<TeamResponse> {
        return this.client.post<TeamResponse>(
            `/${eventId}/team/join`,
            JSON.stringify({ team_code: teamCode })
        );
    }

    leaveTeam(eventId: string): Promise<{ message: string }> {
        return this.client.delete<{ message: string }>(`/${eventId}/team`);
    }

    submitDeliverable(eventId: string, deliverableData: FormData): Promise<{ message: string }> {
        return this.client.post<{ message: string }>(`/${eventId}/deliverable`, deliverableData);
    }
}

export { TeamService };
