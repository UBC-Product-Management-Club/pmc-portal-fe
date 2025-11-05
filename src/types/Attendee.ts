import { z } from 'zod/v4';

enum ATTENDEE_STATUS {
    FAILED,
    PROCESSING,
    APPLIED,
    REGISTERED,
    ACCEPTED,
}

const RawAttendee = z.object({
    user_id: z.string(),
    event_id: z.uuid(),
    event_form_answers: z.json(),
    attendee_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }),
    last_updated: z.iso.datetime({ offset: true }),
    is_payment_verified: z.boolean().nullable(),
    status: z.enum(ATTENDEE_STATUS),
    payment_id: z.string().nullable(),
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
}));

type Attendee = z.infer<typeof AttendeeSchema>;

export { AttendeeSchema, ATTENDEE_STATUS };
export type { Attendee };
