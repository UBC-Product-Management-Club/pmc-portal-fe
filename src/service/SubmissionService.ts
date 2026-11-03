import { z } from 'zod/v4';
import { PhaseSchema, SubmissionSchema } from '../types/EventDay';
import { RestClient } from './RestClient';

export type RawPhase = z.input<typeof PhaseSchema>;
export type RawSubmission = z.input<typeof SubmissionSchema>;

// Submission form endpoints. The older TeamService deliverable calls stay for past events.
class SubmissionService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/events`);
    }

    // /flags returns { data: [...] } today (older pages read it that way); a plain list also works
    async getPhases(eventId: string): Promise<RawPhase[]> {
        const response = await this.client.get<RawPhase[] | { data: RawPhase[] }>(
            `/${eventId}/flags`
        );
        return Array.isArray(response) ? response : response.data;
    }

    getSubmission(eventId: string, phaseId: string): Promise<RawSubmission | null> {
        return this.client.get<RawSubmission | null>(`/${eventId}/deliverable/${phaseId}`);
    }

    // formData carries the fields, the deck file and expected_version; an out-of-date version is a 409 STALE
    saveSubmission(
        eventId: string,
        phaseId: string,
        formData: FormData
    ): Promise<{ message: string; data: RawSubmission }> {
        return this.client.post<{ message: string; data: RawSubmission }>(
            `/${eventId}/deliverable/${phaseId}`,
            formData
        );
    }
}

export { SubmissionService };
