import type { RawPhase, RawSubmission, SubmissionService } from '../SubmissionService';
import { delay, mockError, mockPhase } from './mockData';

let submission: RawSubmission | null = null;

class MockSubmissionService implements Pick<SubmissionService, keyof SubmissionService> {
    async getPhases(): Promise<RawPhase[]> {
        await delay();
        return [mockPhase()];
    }

    async getSubmission(): Promise<RawSubmission | null> {
        await delay();
        return submission;
    }

    // Same rules as the server's version check: a save from an older version is a 409 STALE
    async saveSubmission(
        _eventId: string,
        _phaseId: string,
        formData: FormData
    ): Promise<{ message: string; data: RawSubmission }> {
        await delay(800);
        const expected = Number(formData.get('expected_version') ?? 0);
        const current = submission?.version ?? 0;
        if (expected !== current) throw mockError(409, 'STALE', { data: submission });

        const answers: Record<string, string> = { ...submission?.submission };
        formData.forEach((value, key) => {
            if (key === 'expected_version') return;
            answers[key] = value instanceof File ? value.name : value;
        });

        submission = {
            submission: answers,
            version: current + 1,
            submitted_at: new Date().toISOString(),
            submitted_by: 'Simoon Song',
        };
        return { message: 'Submission saved', data: submission };
    }
}

export { MockSubmissionService };
