import { z } from 'zod/v4';

const RawAttendee = z.object({
    user_id: z.string(),
    event_id: z.uuid(),
    event_form_answers: z.json(),
    attendee_id: z.uuid(),
    registration_time: z.iso.datetime({ offset: true }),
    is_payment_verified: z.boolean().nullable(),
    status: z.string(),
    payment_id: z.string().nullable(),
});

const AttendeeSchema = RawAttendee.transform((attendee) => ({
    userId: attendee.user_id,
    eventId: attendee.event_id,
    eventFormAnswers: attendee.event_form_answers,
    attendeeId: attendee.attendee_id,
    registrationTime: attendee.registration_time,
    isPaymentVerified: attendee.is_payment_verified,
    status: attendee.status,
    paymentId: attendee.payment_id,
}));

type Attendee = z.infer<typeof AttendeeSchema>;

export { AttendeeSchema };
export type { Attendee };
