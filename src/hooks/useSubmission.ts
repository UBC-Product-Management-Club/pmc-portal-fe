import { useCallback, useMemo } from 'react';
import { createSubmissionService } from '../service/services';
import { PhaseSchema, SubmissionSchema } from '../types/EventDay';

function useSubmission() {
    const submissionService = useMemo(() => createSubmissionService(), []);

    const getPhases = useCallback(
        async (eventId: string) => {
            return PhaseSchema.array().parse(await submissionService.getPhases(eventId));
        },
        [submissionService]
    );

    const getSubmission = useCallback(
        async (eventId: string, phaseId: string) => {
            const submission = await submissionService.getSubmission(eventId, phaseId);
            return submission ? SubmissionSchema.parse(submission) : null;
        },
        [submissionService]
    );

    const saveSubmission = useCallback(
        async (eventId: string, phaseId: string, formData: FormData) => {
            const { data } = await submissionService.saveSubmission(eventId, phaseId, formData);
            return SubmissionSchema.parse(data);
        },
        [submissionService]
    );

    return { getPhases, getSubmission, saveSubmission };
}

export { useSubmission };
