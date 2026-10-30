import { z } from 'zod/v4';

// Event.schedule: display text only, times in America/Vancouver
const ScheduleSchema = z.object({
    days: z.array(
        z.object({
            date: z.iso.date(),
            label: z.string(),
            items: z.array(z.object({ time: z.string(), title: z.string() })),
        })
    ),
});

const RawEventSchema = z.object({
    event_id: z.uuidv4(),
    name: z.string(),
    date: z.iso.date(),
    registration_opens: z.iso.datetime({ offset: true }),
    registration_closes: z.iso.datetime({ offset: true }),
    start_time: z.iso.datetime({ offset: true }),
    end_time: z.iso.datetime({ offset: true }),
    location: z.string(),
    blurb: z.string(),
    description: z.string(),
    media: z
        .array(z.url())
        .nullable()
        .optional()
        .transform((media) => media ?? []),
    member_price: z.number(),
    non_member_price: z.number(),
    max_attendees: z.number(),
    event_form_questions: z.json(),
    is_disabled: z
        .boolean()
        .nullable()
        .optional()
        .transform((disabled) => disabled ?? false),
    registered: z.number(),
    needs_review: z.boolean(),
    external_page: z.url().nullable().optional(),
    waitlist_form: z.url().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    schedule: ScheduleSchema.nullable().optional(),
});

const EventSchema = RawEventSchema.transform((event) => ({
    eventId: event.event_id,
    name: event.name,
    date: event.date,
    blurb: event.blurb,
    description: event.description,
    registrationOpens: event.registration_opens,
    registrationCloses: event.registration_closes,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    thumbnail: event.thumbnail ?? null,
    icon: event.icon ?? null,
    memberPrice: event.member_price,
    nonMemberPrice: event.non_member_price,
    maxAttendees: event.max_attendees,
    eventFormQuestions: event.event_form_questions,
    media: event.media,
    isDisabled: event.is_disabled,
    registered: event.registered,
    needsReview: event.needs_review,
    externalPage: event.external_page,
    waitlistForm: event.waitlist_form,
    schedule: event.schedule ?? null,
}));

const EventCardSchema = RawEventSchema.pick({
    event_id: true,
    name: true,
    date: true,
    blurb: true,
    start_time: true,
    end_time: true,
    location: true,
    member_price: true,
    non_member_price: true,
    is_disabled: true,
    external_page: true,
    thumbnail: true,
    icon: true,
}).transform((event) => ({
    eventId: event.event_id,
    name: event.name,
    date: event.date,
    blurb: event.blurb,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    thumbnail: event.thumbnail ?? null,
    icon: event.icon ?? null,
    memberPrice: event.member_price,
    nonMemberPrice: event.non_member_price,
    isDisabled: event.is_disabled,
    externalPage: event.external_page,
}));

const EventCardsSchema = z.array(EventCardSchema);

type Event = z.infer<typeof EventSchema>;
type EventCard = z.infer<typeof EventCardSchema>;
type Schedule = z.infer<typeof ScheduleSchema>;

export { EventCardSchema, EventCardsSchema, EventSchema, ScheduleSchema };
export type { Event, EventCard, Schedule };
