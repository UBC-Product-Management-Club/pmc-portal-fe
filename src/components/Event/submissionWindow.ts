import { Phase } from '../../types/EventDay';

// The later of the phase deadline and this team's extension
export function effectiveDeadline(phase: Phase) {
    if (!phase.extendedUntil) return phase.deadline;
    return new Date(phase.extendedUntil) > new Date(phase.deadline)
        ? phase.extendedUntil
        : phase.deadline;
}

export type WindowState = 'disabled' | 'not-open' | 'open' | 'closed';

// Half-open window: open from the start time up to (not including) the deadline
export function windowState(phase: Phase, now: Date): WindowState {
    if (!phase.isEnabled) return 'disabled';
    if (now < new Date(phase.startTime)) return 'not-open';
    if (now >= new Date(effectiveDeadline(phase))) return 'closed';
    return 'open';
}
