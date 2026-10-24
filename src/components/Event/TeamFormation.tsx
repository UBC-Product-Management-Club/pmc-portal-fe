import { ButtonLink } from '../Portal/Button';
import { Section } from './EventSections';
import { TeamJoinForms } from './TeamJoinForms';

type TeamFormationProps = {
    eventId: string;
    discordUrl: string | null;
    maxTeamSize: number;
    onTeam: boolean;
};

const cardClass = 'flex flex-col items-start gap-1.5 rounded-[10px] bg-white/60 p-3.5';

export function TeamFormation({ eventId, discordUrl, maxTeamSize, onTeam }: TeamFormationProps) {
    return (
        <Section title="Team Formation" id="team-formation">
            <div className="glass grid items-start gap-3.5 p-3.5 md:grid-cols-2">
                <div className={cardClass}>
                    <h3 className="text-[13px] font-semibold">Before the event</h3>
                    <p className="mb-1.5 text-[13px] text-slate-600">
                        Meet other participants in the Discord channel and form a team of up to{' '}
                        {maxTeamSize}.
                    </p>
                    {discordUrl && (
                        <a
                            href={discordUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#5865f2] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                        >
                            Open Discord
                        </a>
                    )}
                </div>
                <div className={cardClass}>
                    <h3 className="text-[13px] font-semibold">Record your team here</h3>
                    {onTeam ? (
                        <>
                            <p className="mb-1.5 text-[13px] text-slate-600">
                                You're on a team. Rename it, share its code or submit from the team
                                page.
                            </p>
                            <ButtonLink to={`/events/${eventId}/team`} variant="primary">
                                Go to your team
                            </ButtonLink>
                        </>
                    ) : (
                        <>
                            <p className="mb-1.5 text-[13px] text-slate-600">
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
