import { Attendee } from '../../types/Attendee';
import type { AttendeeService } from '../AttendeeService';
import { delay, fromNow, MOCK_EVENT_ID } from './mockData';

const HOUR = 60 * 60 * 1000;

// Pick a status with ?state=applied|accepted|payment-passed|processing|registered|rejected.
// The choice is remembered for the tab; ?state=none goes back to "not applied".
const STATES = {
    applied: { status: 'APPLIED', workflow_state: 'UNDER_REVIEW' },
    accepted: { status: 'ACCEPTED', workflow_state: 'PAYMENT_WINDOW_OPEN', due: 72 * HOUR },
    'payment-passed': {
        status: 'ACCEPTED',
        workflow_state: 'PAYMENT_WINDOW_PASSED',
        due: -2 * HOUR,
    },
    processing: { status: 'ACCEPTED', workflow_state: 'PAYMENT_PROCESSING', due: 70 * HOUR },
    registered: { status: 'REGISTERED', workflow_state: 'REGISTERED' },
    rejected: { status: 'REJECTED', workflow_state: 'NOT_SELECTED' },
} as const;

type MockState = keyof typeof STATES;
const STORAGE_KEY = 'mock_attendee_state';

let appliedFromUrl: string | null = null;

export function getMockState(): MockState | null {
    // A ?state= value applies once, so later changes (like submitting) aren't undone by the URL
    const fromUrl = new URLSearchParams(window.location.search).get('state');
    if (fromUrl && fromUrl !== appliedFromUrl) {
        appliedFromUrl = fromUrl;
        sessionStorage.setItem(STORAGE_KEY, fromUrl);
    }
    const state = sessionStorage.getItem(STORAGE_KEY);
    return state && state in STATES ? (state as MockState) : null;
}

export function setMockState(state: MockState) {
    sessionStorage.setItem(STORAGE_KEY, state);
}

// The last submitted answers, so the read-only application view has something to show
let submittedAnswers: Record<string, string> = {};

export function setMockAnswers(answers: Record<string, string>) {
    submittedAnswers = answers;
}

class MockAttendeeService implements Pick<AttendeeService, keyof AttendeeService> {
    async getAttendee(eventId: string): Promise<Attendee> {
        await delay();
        const state = getMockState();
        if (!state) return null as unknown as Attendee;

        const { status, workflow_state, ...rest } = STATES[state];
        const due = 'due' in rest ? rest.due : undefined;
        return {
            user_id: 'auth0|mock-user',
            event_id: eventId || MOCK_EVENT_ID,
            event_form_answers: submittedAnswers,
            attendee_id: '8f3c2a1e-4b7d-4c1a-9e2f-0d5b6a7c8e91',
            created_at: fromNow(-3 * 24 * HOUR),
            last_updated: fromNow(-HOUR),
            is_payment_verified: status === 'REGISTERED',
            status,
            payment_id: null,
            workflow_state,
            payment_due_at: due === undefined ? null : fromNow(due),
            acceptance_version: due === undefined ? 0 : 1,
            amount_due: status === 'ACCEPTED' ? 15 : null,
            server_time: new Date().toISOString(),
        } as unknown as Attendee;
    }

    async deleteAttendee(): Promise<{ message: string }> {
        await delay();
        sessionStorage.removeItem(STORAGE_KEY);
        return { message: 'Attendee deleted' };
    }
}

export { MockAttendeeService };
