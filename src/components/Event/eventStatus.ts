import moment from 'moment-timezone';
import { Attendee, AttendeeStatus, WorkflowState } from '../../types/Attendee';
import { Event } from '../../types/Event';

export type EventStatus =
    | WorkflowState
    | 'NOT_APPLIED'
    | 'SIGNED_OUT'
    | 'NOT_OPEN_YET'
    | 'CLOSED'
    | 'FULL';

// Uses the server's workflow_state when it sends one; until then works it out from the status
export function getEventStatus({
    event,
    attendee,
    hasDraft,
    isSignedIn,
}: {
    event: Event;
    attendee: Attendee | null;
    hasDraft: boolean;
    isSignedIn: boolean;
}): EventStatus {
    if (attendee?.workflowState) return attendee.workflowState;

    if (attendee) {
        switch (attendee.status) {
            case 'APPLIED':
                return 'UNDER_REVIEW';
            case 'REGISTERED':
                return 'REGISTERED';
            case 'REJECTED':
                return 'NOT_SELECTED';
            case 'PROCESSING':
                return 'PAYMENT_PROCESSING';
            case 'ACCEPTED': {
                const now = moment(attendee.serverTime);
                return attendee.paymentDueAt && now.isAfter(attendee.paymentDueAt)
                    ? 'PAYMENT_WINDOW_PASSED'
                    : 'PAYMENT_WINDOW_OPEN';
            }
        }
    }

    if (!isSignedIn) return 'SIGNED_OUT';
    if (moment().isBefore(event.registrationOpens)) return 'NOT_OPEN_YET';
    if (moment().isAfter(event.registrationCloses)) return 'CLOSED';
    if (event.registered >= event.maxAttendees) return 'FULL';
    return hasDraft ? 'DRAFT' : 'NOT_APPLIED';
}

export const STATUS_BADGES: Partial<Record<EventStatus, { label: string; tone: BadgeTone }>> = {
    DRAFT: { label: 'Draft', tone: 'neutral' },
    UNDER_REVIEW: { label: 'Under review', tone: 'warn' },
    PAYMENT_WINDOW_OPEN: { label: 'Accepted', tone: 'info' },
    PAYMENT_WINDOW_PASSED: { label: 'Payment window passed', tone: 'bad' },
    PAYMENT_PROCESSING: { label: 'Payment processing', tone: 'info' },
    REGISTERED: { label: 'Registered', tone: 'good' },
    NOT_SELECTED: { label: 'Not selected', tone: 'bad' },
};

export type BadgeTone = 'neutral' | 'warn' | 'info' | 'good' | 'bad';

export type EventTiming = 'upcoming' | 'live' | 'ended';

export function eventTiming(event: { startTime: string; endTime: string }, now = new Date()) {
    if (now >= new Date(event.endTime)) return 'ended';
    if (now >= new Date(event.startTime)) return 'live';
    return 'upcoming';
}

// Once an event is over everyone sees Ended; while it runs, registered students see Happening now
export function displayBadge(status: EventStatus | null, timing: EventTiming) {
    if (timing === 'ended') return { label: 'Ended', tone: 'neutral' as const };
    if (timing === 'live' && status === 'REGISTERED') {
        return { label: 'Happening now', tone: 'info' as const };
    }
    return status ? STATUS_BADGES[status] : undefined;
}

// "Thu Nov 5, 2:14 PM PT"
export function formatPacific(iso: string) {
    return `${moment.utc(iso).tz('America/Vancouver').format('ddd MMM D, h:mm A')} PT`;
}

export function formatPrice(amount: number) {
    return amount === 0 ? 'Free' : `$${amount.toFixed(2)}`;
}

// Home only displays status: an attendee row always wins, Draft shows only without one
export function homeStatus(
    row:
        | { status: AttendeeStatus | null; hasDraft: boolean; paymentDueAt: string | null }
        | undefined,
    now = new Date()
): EventStatus | null {
    if (!row) return null;
    switch (row.status) {
        case 'APPLIED':
            return 'UNDER_REVIEW';
        case 'ACCEPTED':
            return row.paymentDueAt && now > new Date(row.paymentDueAt)
                ? 'PAYMENT_WINDOW_PASSED'
                : 'PAYMENT_WINDOW_OPEN';
        case 'PROCESSING':
            return 'PAYMENT_PROCESSING';
        case 'REGISTERED':
            return 'REGISTERED';
        case 'REJECTED':
            return 'NOT_SELECTED';
        case null:
            return row.hasDraft ? 'DRAFT' : null;
        default:
            return null;
    }
}
