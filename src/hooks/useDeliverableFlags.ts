import { useCallback, useMemo } from 'react';
import { DeliverableFlagService, DeliverableFlag } from '../service/DeliverableFlagService';

export type SubmissionStatus = 'locked' | 'open' | 'closed' | 'disabled';

export function getSubmissionStatus(flag: DeliverableFlag | undefined): SubmissionStatus {
    if (!flag || !flag.is_enabled) return 'disabled';

    const now = new Date();
    const start = new Date(flag.starttime);
    const end = new Date(flag.deadline);

    if (now < start) return 'locked';
    if (now > end) return 'closed';
    return 'open';
}

export function canSubmitDeliverable(flag: DeliverableFlag | undefined): boolean {
    return getSubmissionStatus(flag) === 'open';
}

function useDeliverableFlags() {
    const service = useMemo(() => new DeliverableFlagService(), []);

    const getFlags = useCallback(
        async (eventId: string) => {
            const response = await service.getFlags(eventId);
            return response.data;
        },
        [service]
    );

    return { getFlags, getSubmissionStatus, canSubmitDeliverable };
}

export { useDeliverableFlags };
export type { DeliverableFlag };
