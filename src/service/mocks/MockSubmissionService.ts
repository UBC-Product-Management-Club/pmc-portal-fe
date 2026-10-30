import type { RawPhase, RawSubmission, SubmissionService } from '../SubmissionService';
import { delay, mockError, mockPhase } from './mockData';

let submission: RawSubmission | null = null;

const sampleSubmission: RawSubmission = {
    submission: {
        deck: 'royal-flush-deck.pdf',
        prototype: 'https://example.com/royal-flush',
        video: 'https://example.com/royal-flush-video',
        description: 'A budgeting app that turns saving into a weekly bet with friends.',
    },
    version: 1,
    submitted_at: '2026-11-22T19:40:00.000Z',
    submitted_by: 'Simoon Song',
};

class MockSubmissionService implements Pick<SubmissionService, keyof SubmissionService> {
    async getPhases(): Promise<RawPhase[]> {
        await delay();
        return [mockPhase()];
    }

    // With ?finalist=yes|no results are out, so the team must have submitted
    async getSubmission(): Promise<RawSubmission | null> {
        await delay();
        const resultsOut = new URLSearchParams(window.location.search).has('finalist');
        return submission ?? (resultsOut ? sampleSubmission : null);
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
