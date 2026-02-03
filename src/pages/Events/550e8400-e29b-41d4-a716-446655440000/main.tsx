import { useEffect, useState } from 'react';
import { useUserData } from '../../../providers/UserData/UserDataProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gearyHeist from '../../../assets/gearyHeist.avif';
import PMCLogo from '../../../assets/pmclogo.svg';
import type { TeamResponse } from '../../../types/Team';
import { useTeam } from '../../../hooks/useTeam';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardVerticalWrapper,
    CardsWrapper,
} from '../../../components/Deliverables/utils';
import { TimelineCard } from '../../../components/Deliverables/TimelineCard';
import { useSubmissionWindow } from '../../../hooks/useSubmissionWindow';
import SubmissionVault from './SubmissionVault';

export default function ProductHeist() {
    const { getTeam, joinTeam, leaveTeam, createTeam } = useTeam();
    const { event_id } = useParams();
    const { user } = useUserData();
    const navigate = useNavigate();
    const pageClass = 'mx-auto w-full max-w-[1500px] px-4 md:px-8';
    const containerClass = 'min-h-screen bg-pmc-dark-blue';
    const topBarClass = 'flex items-center justify-between py-4';
    const logoClass = 'h-10 cursor-pointer pt-4';
    const greetingClass = 'rounded-full bg-white px-8 py-2 text-base font-semibold text-black';
    const contentClass = 'py-8 md:py-12';
    const headerClass = 'mb-6 text-left';
    const teamNameClass = 'text-[2.5rem] font-bold tracking-tight text-white';
    const teamCodeClass = 'text-[0.5em] font-normal opacity-70';
    const memberItemClass = 'border-b border-[rgba(141,155,235,0.15)] last:border-b-0';
    const memberContentClass = 'flex items-center gap-4';
    const avatarClass =
        'h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(141,155,235,0.3)]';
    const userInfoClass = 'flex w-full items-center justify-between';
    const userNameClass = 'text-lg font-semibold leading-tight text-white';
    const userEmailClass = 'truncate text-sm text-pmc-light-grey';
    const spinnerClass =
        'h-12 w-12 animate-spin rounded-full border-2 border-transparent border-b-pmc-light-blue';
    const loadingTextClass = 'mt-4 text-pmc-light-grey';
    const teamContainerClass = 'flex w-full flex-1 flex-col justify-between gap-6';
    const teamSetupContainerClass = 'flex w-full flex-1 flex-row items-center gap-6';
    const teamSectionClass = 'flex flex-col gap-3';
    const teamTitleClass = 'm-0 text-lg font-semibold text-white';
    const teamTextClass = 'text-sm leading-relaxed text-pmc-light-grey';
    const inputGroupClass = 'flex flex-col gap-2 sm:flex-row';
    const inputClass =
        'flex-1 rounded-lg border border-[rgba(141,155,235,0.3)] bg-pmc-dark-blue px-4 py-3 text-sm text-white placeholder:italic placeholder:opacity-50 focus:outline-none focus:border-pmc-light-blue focus:shadow-[0_0_0_3px_rgba(141,155,235,0.1)]';
    const buttonClass =
        'rounded-lg bg-[linear-gradient(135deg,var(--pmc-light-blue)_0%,#6b7bcf_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_6px_-1px_rgba(141,155,235,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_12px_-1px_rgba(141,155,235,0.3)] disabled:cursor-not-allowed disabled:bg-[rgba(141,155,235,0.3)] disabled:shadow-none';
    const errorClass =
        'mt-2 flex items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-red-300';
    const dividerClass =
        'self-stretch w-px bg-[linear-gradient(to_bottom,rgba(141,155,235,0)_0%,rgba(141,155,235,0.3)_15%,rgba(141,155,235,0.3)_85%,rgba(141,155,235,0)_100%)]';
    const countClass =
        'rounded-full bg-[rgba(141,155,235,0.2)] px-3 py-1 text-sm font-semibold text-[#8d9beb]';

    const [teamData, setTeamData] = useState<TeamResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const phase = useSubmissionWindow();

    const [formTeamCode, setFormTeamCode] = useState('');
    const [formTeamName, setFormTeamName] = useState('');
    const [joinError, setJoinError] = useState('');
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        const fetchTeam = async (eventId: string) => {
            try {
                const data = await getTeam(eventId);
                setTeamData(data || null);
                console.log(data);
            } catch (e) {
                setTeamData(null);
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (event_id) {
            fetchTeam(event_id);
        }
    }, [event_id, getTeam]);

    const members = teamData?.Team?.Team_Member || [];
    const teamName = teamData?.Team?.team_name;
    const teamCode = teamData?.Team?.team_code;

    const handleJoinTeam = async () => {
        try {
            if (!event_id) return;

            setJoinError('');
            const data = await joinTeam(event_id, formTeamCode);
            setTeamData(data);
            setFormTeamCode('');
        } catch (e) {
            console.log(e);
            setJoinError('Unable to join team. Please check the code and try again.');
        }
    };

    const handleCreateTeam = async () => {
        try {
            if (!event_id) return;

            setCreateError('');
            const data = await createTeam(event_id, formTeamName);
            setTeamData(data);
            setFormTeamName('');
            /* eslint-disable  @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            console.log(e);
            if (e.message.endsWith('Conflict')) {
                // just gonna assume team name taken. I don't think any other error is possible really
                setCreateError('Team name unavailable!');
            } else {
                setCreateError('Unable to create team!');
            }
        }
    };

    const handleLeaveTeam = async () => {
        try {
            if (!event_id) return;

            await leaveTeam(event_id);
            setTeamData(null);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className={pageClass}>
            <div className={containerClass}>
                {/* Top bar with logo and greeting */}
                <div className={topBarClass}>
                    <img
                        className={logoClass}
                        src={PMCLogo}
                        alt="PMC Logo"
                        onClick={() => navigate('/dashboard')}
                    />
                    {user && (
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div className={greetingClass}>Hi, {user.firstName}!</div>
                        </Link>
                    )}
                </div>

                <div className={contentClass}>
                    <div className={headerClass}>
                        <h1 className={teamNameClass}>
                            {teamName || 'No Team Assigned'}{' '}
                            {teamCode && <span className={teamCodeClass}>#{teamCode}</span>}
                        </h1>
                    </div>

                    <CardsWrapper>
                        {/* Team Members Card */}
                        <CardVerticalWrapper>
                            {/* Countdown Card (do NOT center) */}
                            <TimelineCard />

                            <Card>
                                <CardHeader>
                                    <CardTitle>Meet Your Accomplices</CardTitle>
                                    {members.length > 0 && (
                                        <div className={countClass}>{members.length}/4</div>
                                    )}
                                </CardHeader>
                                {/* ONLY center if loading or no members */}
                                <CardContent center={loading || members.length === 0}>
                                    {loading ? (
                                        <>
                                            <div className={spinnerClass} />
                                            <p className={loadingTextClass}>Loading team...</p>
                                        </>
                                    ) : members.length > 0 ? (
                                        <div className={teamContainerClass}>
                                            <div>
                                                {members.map((member) => {
                                                    const user = member.Attendee.User;
                                                    return (
                                                        <div
                                                            className={memberItemClass}
                                                            key={member.attendee_id}
                                                        >
                                                            <div className={memberContentClass}>
                                                                <div className={avatarClass}>
                                                                    <img
                                                                        src={gearyHeist}
                                                                        alt={`${user.first_name} ${user.last_name}`}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className={userInfoClass}>
                                                                    <h3 className={userNameClass}>
                                                                        {user.first_name}{' '}
                                                                        {user.last_name}
                                                                    </h3>
                                                                    <p className={userEmailClass}>
                                                                        {user.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                className={buttonClass}
                                                onClick={handleLeaveTeam}
                                                // disabled={phase !== 'before'}
                                            >
                                                Leave
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={teamSetupContainerClass}>
                                            <div className={teamSectionClass}>
                                                <h3 className={teamTitleClass}>Join a Team</h3>
                                                <p className={teamTextClass}>
                                                    Enter team code below to join your crew and
                                                    start planning the heist.
                                                </p>
                                                <div className={inputGroupClass}>
                                                    <input
                                                        className={inputClass}
                                                        type="text"
                                                        placeholder="e.g. J1C8V"
                                                        value={formTeamCode}
                                                        onChange={(e) =>
                                                            setFormTeamCode(
                                                                e.target.value.toUpperCase()
                                                            )
                                                        }
                                                        maxLength={5}
                                                    />
                                                    <button
                                                        className={buttonClass}
                                                        onClick={handleJoinTeam}
                                                        disabled={!formTeamCode.trim()}
                                                    >
                                                        Join
                                                    </button>
                                                </div>
                                                {joinError && (
                                                    <div className={errorClass}>⚠ {joinError}</div>
                                                )}
                                            </div>

                                            <div className={dividerClass} />

                                            <div className={teamSectionClass}>
                                                <h3 className={teamTitleClass}>Create a Team</h3>
                                                <p className={teamTextClass}>
                                                    Start your own crew and get a unique code to
                                                    share with your teammates.
                                                </p>
                                                <div className={inputGroupClass}>
                                                    <input
                                                        className={inputClass}
                                                        type="text"
                                                        placeholder="Enter team name"
                                                        value={formTeamName}
                                                        onChange={(e) =>
                                                            setFormTeamName(e.target.value)
                                                        }
                                                        maxLength={50}
                                                    />
                                                    <button
                                                        className={buttonClass}
                                                        onClick={handleCreateTeam}
                                                        disabled={!formTeamName.trim()}
                                                    >
                                                        Create
                                                    </button>
                                                </div>
                                                {createError && (
                                                    <div className={errorClass}>
                                                        ⚠ {createError}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </CardVerticalWrapper>
                        <Card>
                            <CardHeader>
                                <CardTitle>Submission Vault</CardTitle>
                            </CardHeader>
                            <SubmissionVault phase={phase} eventId={event_id!} />
                        </Card>
                    </CardsWrapper>
                </div>
            </div>
        </div>
    );
}
