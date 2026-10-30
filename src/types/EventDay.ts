import { z } from 'zod/v4';

// Response shapes for the event-day endpoints

const PageContentSchema = z.object({
    mentors: z.array(
        z.object({
            name: z.string(),
            role: z.string(),
            photo: z.url().optional(),
            link: z.url().optional(),
        })
    ),
    prep: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
});

// GET /v2/events/:id/registered-content
const RegisteredContentSchema = z
    .object({
        page_content: PageContentSchema,
        discord_url: z.url().nullable(),
        max_team_size: z.number(),
    })
    .transform((content) => ({
        pageContent: content.page_content,
        discordUrl: content.discord_url,
        maxTeamSize: content.max_team_size,
    }));

const SubmissionFieldSchema = z.object({
    id: z.string(),
    type: z.enum(['file', 'url', 'short-answer', 'long-answer']),
    label: z.string(),
    required: z.boolean(),
    accept: z.array(z.string()).optional(),
    maxSizeMB: z.number().optional(),
    maxWords: z.number().optional(),
});

// GET /v2/events/:id/flags
const PhaseSchema = z
    .object({
        id: z.string(),
        event_id: z.uuid(),
        starttime: z.iso.datetime({ offset: true }),
        deadline: z.iso.datetime({ offset: true }),
        is_enabled: z.boolean(),
        fields: z.array(SubmissionFieldSchema),
        extended_until: z.iso.datetime({ offset: true }).nullable(),
        server_time: z.iso.datetime({ offset: true }),
    })
    .transform((phase) => ({
        phaseId: phase.id,
        eventId: phase.event_id,
        startTime: phase.starttime,
        deadline: phase.deadline,
        isEnabled: phase.is_enabled,
        fields: phase.fields,
        extendedUntil: phase.extended_until,
        serverTime: phase.server_time,
    }));

// GET /v2/events/:id/deliverable/:phaseId
const SubmissionSchema = z
    .object({
        submission: z.record(z.string(), z.string()),
        version: z.number(),
        submitted_at: z.iso.datetime({ offset: true }).nullable(),
        submitted_by: z.string().nullable(),
    })
    .transform((submission) => ({
        answers: submission.submission,
        version: submission.version,
        submittedAt: submission.submitted_at,
        submittedBy: submission.submitted_by,
    }));

type PageContent = z.infer<typeof PageContentSchema>;
type RegisteredContent = z.infer<typeof RegisteredContentSchema>;
type SubmissionField = z.infer<typeof SubmissionFieldSchema>;
type Phase = z.infer<typeof PhaseSchema>;
type Submission = z.infer<typeof SubmissionSchema>;

export { PageContentSchema, RegisteredContentSchema, PhaseSchema, SubmissionSchema };
export type { PageContent, RegisteredContent, SubmissionField, Phase, Submission };
