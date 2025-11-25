import { z } from 'zod/v4';

const ATTENDEE_STATUS = z.enum([
    'FAILED',
    'PROCESSING',
    'APPLIED',
    'REGISTERED',
    'ACCEPTED',
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

const TeamResponseSchema = z.object({
    team_id: z.uuid(),
    Team: z.object({
        team_name: z.string(),
        Team_Member: z.array(
            z.object({
                attendee_id: z.uuid(),
                Attendee: z.object({
                    user_id: z.string(),
                    User: z.object({
                        email: z.email(),
                        first_name: z.string(),
                        last_name: z.string(),
                    }),
                }),
            })
        ),
    }),
});

type Attendee = z.infer<typeof AttendeeSchema>;
type AttendeeStatus = z.infer<typeof ATTENDEE_STATUS>;
type TeamResponse = z.infer<typeof TeamResponseSchema>;

export { AttendeeSchema, ATTENDEE_STATUS, TeamResponseSchema };
export type { Attendee, AttendeeStatus, TeamResponse };
