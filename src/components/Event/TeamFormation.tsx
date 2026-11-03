import { FaSlack } from 'react-icons/fa';
import { ButtonLink } from '../Portal/Button';
import { Section } from './EventSections';
import { TeamJoinForms } from './TeamJoinForms';

type TeamFormationProps = {
    eventId: string;
    slackUrl: string | null;
    maxTeamSize: number;
    onTeam: boolean;
    ended: boolean;
};

const cardClass = 'flex flex-col items-start gap-1.5 rounded-[10px] bg-pmc-bg p-3.5';

export function TeamFormation({
    eventId,
    slackUrl,
    maxTeamSize,
    onTeam,
    ended,
}: TeamFormationProps) {
    // After the event teams are final: no Slack or create/join, just a way back to the team
    if (ended) {
        return (
            <Section title="Your Team" id="team-formation">
                <div className="glass flex flex-col items-start gap-3 p-4 md:flex-row md:items-center">
                    <p className="flex-1 text-sm text-pmc-mute">
                        {onTeam
                            ? "That's a wrap, thanks for competing! Your teammates and project are saved on your team page whenever you want to look back."
                            : "That's a wrap! You weren't on a team for this one, but we hope to see you competing at the next event."}
                    </p>
                    {onTeam && (
                        <ButtonLink to={`/events/${eventId}/team`}>View your team</ButtonLink>
                    )}
                </div>
            </Section>
        );
    }

    return (
        <Section title="Team Formation" id="team-formation">
            <div className="glass grid items-start gap-3.5 p-3.5 md:grid-cols-2">
                <div className={cardClass}>
                    <h3 className="text-sm font-semibold">Before the event</h3>
                    <p className="mb-1.5 text-sm text-pmc-mute">
                        Meet other participants in the Slack channel and form a team of up to{' '}
                        {maxTeamSize}.
                    </p>
                    {slackUrl && (
                        <a
                            href={slackUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#4a154b] px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-out hover:bg-[#611f64] active:bg-[#3b113c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pmc-accent"
                        >
                            <FaSlack className="size-4" aria-hidden />
                            Open Slack
                        </a>
                    )}
                </div>
                <div className={cardClass}>
                    <h3 className="text-sm font-semibold">Record your team here</h3>
                    {onTeam ? (
                        <>
                            <p className="mb-1.5 text-sm text-pmc-mute">
                                You're on a team. Rename it, share its code or submit from the team
                                page.
                            </p>
                            <ButtonLink to={`/events/${eventId}/team`} variant="primary">
                                Go to your team
                            </ButtonLink>
                        </>
                    ) : (
                        <>
                            <p className="mb-1.5 text-sm text-pmc-mute">
                                One person creates the team and shares its code. Teams have 1 to{' '}
                                {maxTeamSize} members, so you can also compete alone. Still looking
                                on the day? Find us after opening remarks.
                            </p>
                            <TeamJoinForms eventId={eventId} />
                        </>
                    )}
                </div>
            </div>
        </Section>
    );
}
