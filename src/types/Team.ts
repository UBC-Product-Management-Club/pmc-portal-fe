import { z } from 'zod/v4';

const RawTeam = z.object({
    team_id: z.uuid(),
    event_id: z.uuid(),
    team_name: z.string(),
});

const TeamSchema = RawTeam.transform((team) => ({
    teamId: team.team_id,
    eventId: team.event_id,
    teamName: team.team_name,
}));

const RawTeamMember = z.object({
    attendee_id: z.uuid(),
    team_id: z.uuid(),
});

const TeamMemberSchema = RawTeamMember.transform((member) => ({
    attendeeId: member.attendee_id,
    teamId: member.team_id,
}));

const TeamResponseSchema = z.object({
    team_id: z.uuid(),
    Team: z.object({
        team_name: z.string(),
        team_code: z.string(),
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

type DeliverableVersion = {
    submission: JSON;
    submitted_at: string | null;
    submitted_by: string | null;
};

type Team = z.infer<typeof TeamSchema>;
type TeamMember = z.infer<typeof TeamMemberSchema>;
type TeamResponse = z.infer<typeof TeamResponseSchema>;

export { TeamSchema, TeamMemberSchema, TeamResponseSchema };
export type { Team, TeamMember, TeamResponse, DeliverableVersion };
