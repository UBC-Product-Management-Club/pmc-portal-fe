import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useTeam } from '../../hooks/useTeam';
import { useSubmission } from '../../hooks/useSubmission';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { Event } from '../../types/Event';
import { Phase, Submission } from '../../types/EventDay';
import { TeamResponse } from '../../types/Team';
import { showToast } from '../../utils';
import { Badge } from '../../components/Portal/Badge';
import { Button, ButtonLink } from '../../components/Portal/Button';
import { inputClass } from '../../components/Event/applicationRules';
import { formatPacific } from '../../components/Event/eventStatus';
import { effectiveDeadline, windowState } from '../../components/Event/submissionWindow';
import { teamErrorMessage } from '../../components/Event/teamErrors';
import { FinalistCard } from '../../components/Event/FinalistCard';

export default function TeamPage() {
    const { event_id: eventId = '' } = useParams<{ event_id: string }>();
    const navigate = useNavigate();
    const { user } = useUserData();
    const { getById, getRegisteredContent } = useEvents();
    const { getTeam, renameTeam, leaveTeam } = useTeam();
    const { getPhases, getSubmission } = useSubmission();

    const [event, setEvent] = useState<Event>();
    const [team, setTeam] = useState<TeamResponse | null>();
    const [phase, setPhase] = useState<Phase | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [maxTeamSize, setMaxTeamSize] = useState(4);
    const [renaming, setRenaming] = useState(false);
    const [newName, setNewName] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        const result = await getTeam(eventId).catch(() => null);
        setTeam(result);
        if (!result) return;
        const [first] = await getPhases(eventId).catch(() => []);
        setPhase(first ?? null);
        if (first) setSubmission(await getSubmission(eventId, first.phaseId).catch(() => null));
    }, [eventId, getTeam, getPhases, getSubmission]);

    useEffect(() => {
        getById(eventId).then(setEvent);
        getRegisteredContent(eventId)
            .then((content) => setMaxTeamSize(content.maxTeamSize))
            .catch(() => undefined);
        load();
    }, [eventId, getById, getRegisteredContent, load]);

    if (team === null) return <Navigate to={`/events/${eventId}#team-formation`} replace />;
    if (!team || !event) return <p className="text-center">Loading…</p>;

    const members = team.Team.Team_Member;
    const code = team.Team.team_code;
    const deadline = phase ? effectiveDeadline(phase) : null;
    const submitWindow = phase ? windowState(phase, new Date(phase.serverTime)) : null;
    const afterDeadline = submitWindow === 'closed';
    const rosterLocked = !!submission;

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            showToast('success', 'Team code copied');
        } catch {
            showToast('error', `Couldn't copy. The code is ${code}`);
        }
    };

    const shareCode = () =>
        navigator.share?.({ text: `Join my ${event.name} team with code ${code}` }).catch(() => {});

    const submitRename = async (e: FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            setTeam(await renameTeam(eventId, newName.trim()));
            setRenaming(false);
        } catch (error) {
            showToast('error', teamErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    const leave = async () => {
        if (!window.confirm('Leave this team? You can join or create another one after.')) return;
        setBusy(true);
        try {
            await leaveTeam(eventId);
            navigate(`/events/${eventId}#team-formation`);
        } catch (error) {
            showToast('error', teamErrorMessage(error));
            setBusy(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <p className="text-sm text-slate-600">
                <Link to={`/events/${eventId}`} className="underline">
                    {event.name}
                </Link>{' '}
                › Your team
            </p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {renaming ? (
                    <form onSubmit={submitRename} className="flex flex-1 flex-wrap gap-2">
                        <input
                            className={`${inputClass} max-w-sm flex-1`}
                            value={newName}
                            maxLength={80}
                            autoFocus
                            aria-label="Team name"
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Button type="submit" disabled={busy || !newName.trim()}>
                            Save
                        </Button>
                        <Button onClick={() => setRenaming(false)}>Cancel</Button>
                    </form>
                ) : (
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl leading-tight font-medium break-words">
                            {team.Team.team_name}
                        </h1>
                        {!afterDeadline && (
                            <Button
                                onClick={() => {
                                    setNewName(team.Team.team_name);
                                    setRenaming(true);
                                }}
                            >
                                Rename
                            </Button>
                        )}
                        <Badge>
                            {members.length} / {maxTeamSize} members
                        </Badge>
                    </div>
                )}
                {/* Phone: large code with Copy and Share on their own row */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <span className="text-xs text-slate-600">Team code</span>
                    <span className="rounded-[10px] bg-white/70 px-3 py-1 font-mono text-2xl tracking-widest md:text-lg">
                        {code}
                    </span>
                    <div className="flex gap-2">
                        <Button onClick={copyCode} className="flex-1 md:flex-none">
                            Copy
                        </Button>
                        {'share' in navigator && (
                            <Button onClick={shareCode} className="flex-1 md:hidden">
                                Share
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <FinalistCard isFinalist={team.Team.is_finalist} />

            <div className="grid gap-4 md:grid-cols-2">
                <div className="glass flex flex-col gap-2 p-4">
                    <span className="text-sm text-slate-600">Submission</span>
                    <div>
                        {submission ? (
                            <Badge tone="good">Submitted ✓</Badge>
                        ) : (
                            <Badge tone="warn">Not submitted</Badge>
                        )}
                    </div>
                    {deadline && (
                        <span className="text-sm text-slate-600">
                            {afterDeadline ? 'Closed' : 'Closes'} {formatPacific(deadline)}
                            {phase?.extendedUntil && ' (extended)'}
                        </span>
                    )}
                </div>
                <div className="glass flex flex-col gap-2 p-4">
                    <span className="text-sm text-slate-600">Next step</span>
                    <span className="font-medium">
                        {submission ? 'Review or update your submission' : 'Submit your project'}
                    </span>
                    <ButtonLink to={`/events/${eventId}/submit`} className="self-start">
                        Open submission
                    </ButtonLink>
                </div>
            </div>

            <section className="flex flex-col gap-2">
                <h2 className="text-xl font-medium">Members</h2>
                <ul className="glass flex flex-col divide-y divide-white/70 p-2">
                    {members.map(({ attendee_id, Attendee }) => {
                        const { first_name, last_name, email } = Attendee.User;
                        const isYou = Attendee.user_id === user?.userId;
                        return (
                            <li
                                key={attendee_id}
                                className="flex flex-col gap-0.5 p-3 md:flex-row md:items-center md:gap-6"
                            >
                                <span className="font-medium md:w-64">
                                    {first_name} {last_name}
                                    {isYou && (
                                        <span className="ml-1 text-sm text-slate-600">(you)</span>
                                    )}
                                </span>
                                <span className="text-slate-700">{email}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <span className="text-sm text-slate-600">
                        Teams have 1 to {maxTeamSize} members.
                        {members.length < maxTeamSize &&
                            ` Share the code ${code} so others can join.`}{' '}
                        Any member can rename the team or edit the submission until the deadline.
                    </span>
                    <Button
                        onClick={leave}
                        disabled={busy || afterDeadline || rosterLocked}
                        className="shrink-0 whitespace-nowrap text-red-700"
                    >
                        Leave team
                    </Button>
                </div>
                {(afterDeadline || rosterLocked) && (
                    <p className="text-sm text-slate-600">
                        {rosterLocked
                            ? "Your team has submitted, so its members can't change."
                            : 'The deadline has passed, so the team can no longer change.'}
                    </p>
                )}
            </section>
        </div>
    );
}
