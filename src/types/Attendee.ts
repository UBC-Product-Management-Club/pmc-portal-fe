import { z } from 'zod/v4';

const ATTENDEE_STATUS = {
    FAILED: 'FAILED',
    PROCESSING: 'PROCESSING',
    APPLIED: 'APPLIED',
    REGISTERED: 'REGISTERED',
    ACCEPTED: 'ACCEPTED',
} as const;

const ATTENDEE_STATUS_VALUES = Object.values(ATTENDEE_STATUS);

const RawAttendee = z.object({
    user_id: z.string(),
    event_id: z.uuid(),
    event_form_answers: z.json(),
    attendee_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }),
    last_updated: z.iso.datetime({ offset: true }),
    is_payment_verified: z.boolean().nullable(),
    status: z.enum(ATTENDEE_STATUS_VALUES),
    payment_id: z.string().nullable(),
});

const AttendeeSchema = RawAttendee.transform((attendee) => ({
    userId: attendee.user_id,
    eventId: attendee.event_id,
    eventFormAnswers: attendee.event_form_answers,
    attendeeId: attendee.attendee_id,
    createdAt: attendee.created_at,
    lastUpdated: attendee.last_updated,
    isPaymentVerified: attendee.is_payment_verified,
    status: attendee.status,
    paymentId: attendee.payment_id,
}));

type Attendee = z.infer<typeof AttendeeSchema>;
type AttendeeStatus = typeof ATTENDEE_STATUS_VALUES;
export { AttendeeSchema, ATTENDEE_STATUS };
export type { Attendee, AttendeeStatus };
