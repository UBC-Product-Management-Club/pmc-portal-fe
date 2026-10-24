import { ButtonLink } from '../Portal/Button';
import { Section } from './EventSections';
import { TeamJoinForms } from './TeamJoinForms';

type TeamFormationProps = {
    eventId: string;
    discordUrl: string | null;
    maxTeamSize: number;
    onTeam: boolean;
};

export function TeamFormation({ eventId, discordUrl, maxTeamSize, onTeam }: TeamFormationProps) {
    return (
        <Section title="Team Formation" id="team-formation">
            <div className="glass grid gap-4 p-4 md:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-[10px] bg-white/60 p-4">
                    <h3 className="text-sm font-semibold">Before the event</h3>
                    <p className="text-sm text-slate-700">
                        Meet other participants in the Discord channel and form a team of up to{' '}
                        {maxTeamSize}. Still looking on the day? Come find us in the room after
                        opening remarks and we'll help you find a team.
                    </p>
                    {discordUrl && (
                        <a
                            href={discordUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center self-start rounded-[10px] bg-[#5865f2] px-4 font-medium text-white"
                        >
                            Open Discord
                        </a>
                    )}
                </div>
                <div className="flex flex-col gap-3 rounded-[10px] bg-white/60 p-4">
                    <h3 className="text-sm font-semibold">Record your team here</h3>
                    {onTeam ? (
                        <ButtonLink to={`/events/${eventId}/team`} className="self-start">
                            Go to your team
                        </ButtonLink>
                    ) : (
                        <>
                            <p className="text-sm text-slate-700">
                                One person creates the team and shares its code. Teams have 1 to{' '}
                                {maxTeamSize} members, so you can also compete alone.
                            </p>
                            <TeamJoinForms eventId={eventId} />
                        </>
                    )}
                </div>
            </div>
        </Section>
    );
}
