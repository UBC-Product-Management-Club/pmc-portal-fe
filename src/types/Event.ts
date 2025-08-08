import { z } from 'zod/v4';

const RawEventSchema = z.object({
    event_id: z.uuidv4(),
    name: z.string(),
    date: z.iso.date(),
    start_time: z.iso.datetime({ offset: true }),
    end_time: z.iso.datetime({ offset: true }),
    location: z.string(),
    description: z.string(),
    media: z.array(z.url()),
    thumbnail: z.url(),
    member_price: z.number(),
    non_member_price: z.number(),
    max_attendees: z.number(),
    event_form_questions: z.json(),
    is_disabled: z.boolean(),
    registered: z.number(),
});

const EventSchema = RawEventSchema.transform((event) => ({
    eventId: event.event_id,
    name: event.name,
    date: event.date,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    thumbnail: event.thumbnail,
    memberPrice: event.member_price,
    nonMemberPrice: event.non_member_price,
    maxAttendees: event.max_attendees,
    eventFormQuestions: event.event_form_questions,
    media: event.media,
    isDisabled: event.is_disabled,
    registered: event.registered,
}));

const EventCardSchema = RawEventSchema.pick({
    event_id: true,
    name: true,
    date: true,
    description: true,
    start_time: true,
    end_time: true,
    location: true,
    thumbnail: true,
    member_price: true,
    non_member_price: true,
    is_disabled: true,
}).transform((event) => ({
    eventId: event.event_id,
    name: event.name,
    date: event.date,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    thumbnail: event.thumbnail,
    memberPrice: event.member_price,
    nonMemberPrice: event.non_member_price,
    isDisabled: event.is_disabled,
}));

const EventCardsSchema = z.array(EventCardSchema);

type Event = z.infer<typeof EventSchema>;
type EventCard = z.infer<typeof EventCardSchema>;

export { EventSchema, EventCardSchema, EventCardsSchema };
export type { Event, EventCard };
