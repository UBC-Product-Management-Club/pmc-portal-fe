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

// GET /v2/announcements. audience says who sees it; a membership offer is for non-members only.
const AnnouncementSchema = z
    .object({
        announcement_id: z.string(),
        title: z.string(),
        body: z.string(),
        audience: z.enum(['everyone', 'members', 'non_members']).optional(),
    })
    .transform((a) => ({
        announcementId: a.announcement_id,
        title: a.title,
        body: a.body,
        audience: a.audience ?? 'everyone',
    }));

type EventStatusRow = z.infer<typeof EventStatusRowSchema>;
type Announcement = z.infer<typeof AnnouncementSchema>;

export { EventStatusRowSchema, AnnouncementSchema };
export type { EventStatusRow, Announcement };
