import { z } from 'zod/v4';

const ATTENDEE_STATUS = z.enum([
    'FAILED',
    'PROCESSING',
    'APPLIED',
    'REGISTERED',
    'ACCEPTED',
    'REJECTED',
] as const);

// Display state the server works out, so pages never derive it themselves
const WORKFLOW_STATE = z.enum([
    'DRAFT',
    'UNDER_REVIEW',
    'PAYMENT_WINDOW_OPEN',
    'PAYMENT_WINDOW_PASSED',
    'PAYMENT_PROCESSING',
    'REGISTERED',
    'NOT_SELECTED',
] as const);

const RawAttendee = z.object({
    user_id: z.string(),
    event_id: z.uuid(),
    event_form_answers: z.json(),
    attendee_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }),
    last_updated: z.iso.datetime({ offset: true }),
    is_payment_verified: z.boolean().nullable(),
    status: ATTENDEE_STATUS,
    payment_id: z.string().nullable(),
    // Optional until the backend returns them
    workflow_state: WORKFLOW_STATE.optional(),
    payment_due_at: z.iso.datetime({ offset: true }).nullable().optional(),
    acceptance_version: z.number().optional(),
    amount_due: z.number().nullable().optional(),
    server_time: z.iso.datetime({ offset: true }).optional(),
});

const AttendeeSchema = RawAttendee.transform((attendee) => ({
    userId: attendee.user_id,
    eventId: attendee.event_id,
    eventFormAnswers: attendee.event_form_answers,
    attendeeId: attendee.attendee_id,
    created_at: attendee.created_at,
    last_updated: attendee.last_updated,
    isPaymentVerified: attendee.is_payment_verified,
    status: attendee.status,
    paymentId: attendee.payment_id,
    workflowState: attendee.workflow_state,
    paymentDueAt: attendee.payment_due_at ?? null,
    acceptanceVersion: attendee.acceptance_version,
    amountDue: attendee.amount_due ?? null,
    serverTime: attendee.server_time,
}));

type Attendee = z.infer<typeof AttendeeSchema>;
type AttendeeStatus = z.infer<typeof ATTENDEE_STATUS>;
type WorkflowState = z.infer<typeof WORKFLOW_STATE>;

export { AttendeeSchema, ATTENDEE_STATUS, WORKFLOW_STATE };
export type { Attendee, AttendeeStatus, WorkflowState };
