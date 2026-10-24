import { z } from 'zod/v4';
import { ATTENDEE_STATUS } from './Attendee';

// GET /v2/events/events/statuses: your status for each event you have a draft or attendee row for
const EventStatusRowSchema = z
    .object({
        event_id: z.uuid(),
        status: ATTENDEE_STATUS.nullable(),
        has_draft: z.boolean(),
        payment_due_at: z.iso.datetime({ offset: true }).nullable().optional(),
    })
    .transform((row) => ({
        eventId: row.event_id,
        status: row.status,
        hasDraft: row.has_draft,
        paymentDueAt: row.payment_due_at ?? null,
    }));

// GET /v2/announcements
const AnnouncementSchema = z
    .object({
        announcement_id: z.string(),
        title: z.string(),
        body: z.string(),
    })
    .transform((a) => ({ announcementId: a.announcement_id, title: a.title, body: a.body }));

type EventStatusRow = z.infer<typeof EventStatusRowSchema>;
type Announcement = z.infer<typeof AnnouncementSchema>;

export { EventStatusRowSchema, AnnouncementSchema };
export type { EventStatusRow, Announcement };
