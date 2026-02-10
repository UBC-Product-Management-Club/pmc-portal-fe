import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '../../../../hooks/useTeam';
import type { TeamResponse } from '../../../../types/Team';
import { getInitials } from '../types';

// Workshop schedule data
const WORKSHOPS = [
    {
        id: 'w1',
        title: 'Discovery Workshop',
        date: new Date(2026, 2, 1, 14, 0), // Mar 1, 2:00 PM
        duration: '2 hours',
        description: 'Learn user research techniques and competitive analysis frameworks.',
    },
    {
        id: 'w2',
        title: 'Product Planning Workshop',
        date: new Date(2026, 2, 4, 14, 0), // Mar 4, 2:00 PM
        duration: '2 hours',
        description: 'Master PRD writing and feature prioritization methods.',
    },
    {
        id: 'w3',
        title: 'Prototyping Workshop',
        date: new Date(2026, 2, 8, 14, 0), // Mar 8, 2:00 PM
        duration: '2 hours',
        description: 'Hands-on Figma session and usability testing techniques.',
    },
    {
        id: 'w4',
        title: 'Pitching Workshop',
        date: new Date(2026, 2, 11, 14, 0), // Mar 11, 2:00 PM
        duration: '2 hours',
        description: 'Craft your story and practice your pitch presentation.',
    },
];

// Notion embed URL (replace with actual URL)
const NOTION_EMBED_URL = 'https://pmcubc.notion.site/Product-Sprint-2026-1234567890abcdef';

export default function OverviewPhase() {
    const { event_id } = useParams();
    const { getTeam, joinTeam, leaveTeam, createTeam } = useTeam();

    const [teamData, setTeamData] = useState<TeamResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [formTeamCode, setFormTeamCode] = useState('');
    const [formTeamName, setFormTeamName] = useState('');
    const [joinError, setJoinError] = useState('');
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        const fetchTeam = async (eventId: string) => {
            try {
                const data = await getTeam(eventId);
                setTeamData(data || null);
            } catch {
                setTeamData(null);
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
        } catch {
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
        } catch (e: unknown) {
            const error = e as Error;
            if (error.message?.endsWith('Conflict')) {
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
        } catch {
            // Handle error silently
        }
    };

    const formatWorkshopDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const isWorkshopPast = (date: Date) => new Date() > date;

    return (
        <div className="max-w-[1000px] mx-auto">
            {/* Welcome Header */}
            <div className="rounded-2xl p-8 mb-8 relative overflow-hidden bg-gradient-to-br from-[rgba(141,155,235,0.3)] to-[rgba(38,45,71,0.6)] border border-[rgba(141,155,235,0.3)]">
                <div className="absolute -top-1/2 -right-[10%] w-[300px] h-[300px] pointer-events-none bg-[radial-gradient(circle,rgba(141,155,235,0.2)_0%,transparent_70%)]" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <span
                            className="inline-block w-2 h-2 rounded-full bg-[#8d9beb]"
                            style={{ boxShadow: '0 0 10px #8d9beb' }}
                        />
                        Product Sprint 2026
                    </h1>
                    <p className="text-base text-gray-300 leading-relaxed">
                        Welcome to Product Sprint! Form your team, attend workshops, and compete
                        through 4 phases to build and pitch your product idea.
                    </p>
                </div>
            </div>

            {/* Team Formation Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)] flex justify-between items-center">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        👥 Your Team
                    </h2>
                    {members.length > 0 && (
                        <span className="text-sm font-semibold text-[#8d9beb]">
                            {members.length}/4
                        </span>
                    )}
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[150px] text-gray-400">
                            <div className="h-12 w-12 rounded-full border-[3px] border-[rgba(141,155,235,0.2)] border-t-blue-400 animate-spin" />
                            <p className="mt-4">Loading team...</p>
                        </div>
                    ) : members.length > 0 ? (
                        <div className="space-y-4">
                            {/* Team Name & Code */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{teamName}</h3>
                                    <p className="text-sm text-gray-400">
                                        Team Code:{' '}
                                        <span className="font-mono text-[#8d9beb]">{teamCode}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {members.map((member) => {
                                    const memberUser = member.Attendee.User;
                                    const fullName = `${memberUser.first_name} ${memberUser.last_name}`;
                                    return (
                                        <div
                                            key={member.attendee_id}
                                            className="flex items-center gap-3 p-3 bg-[rgba(15,12,41,0.4)] border border-[rgba(141,155,235,0.15)] rounded-xl"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-base text-white font-semibold flex-shrink-0">
                                                {getInitials(fullName)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-sm font-medium text-white truncate">
                                                    {fullName}
                                                </span>
                                                <span className="text-xs text-gray-400 truncate block">
                                                    {memberUser.email}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Leave Team Button */}
                            <button
                                onClick={handleLeaveTeam}
                                className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                            >
                                Leave Team
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6 relative">
                            {/* Join Team */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">Join a Team</h3>
                                <p className="text-sm text-gray-400">
                                    Enter the team code shared by your teammate to join their team.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. J1C8V"
                                        value={formTeamCode}
                                        onChange={(e) =>
                                            setFormTeamCode(e.target.value.toUpperCase())
                                        }
                                        maxLength={5}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-[rgba(141,155,235,0.3)] bg-[rgba(15,12,41,0.4)] text-white text-sm focus:outline-none focus:border-[#8d9beb] transition-colors"
                                    />
                                    <button
                                        onClick={handleJoinTeam}
                                        disabled={!formTeamCode.trim()}
                                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#8d9beb] to-[#6b7bcf] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                    >
                                        Join
                                    </button>
                                </div>
                                {joinError && (
                                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        ⚠ {joinError}
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(141,155,235,0.3)] to-transparent" />

                            {/* Create Team */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">Create a Team</h3>
                                <p className="text-sm text-gray-400">
                                    Create a team and get a unique code to share with teammates.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter team name"
                                        value={formTeamName}
                                        onChange={(e) => setFormTeamName(e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-[rgba(141,155,235,0.3)] bg-[rgba(15,12,41,0.4)] text-white text-sm focus:outline-none focus:border-[#8d9beb] transition-colors"
                                    />
                                    <button
                                        onClick={handleCreateTeam}
                                        disabled={!formTeamName.trim()}
                                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#8d9beb] to-[#6b7bcf] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                    >
                                        Create
                                    </button>
                                </div>
                                {createError && (
                                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        ⚠ {createError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Workshop Calendar Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)]">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        📅 Workshop Schedule
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {WORKSHOPS.map((workshop) => {
                            const isPast = isWorkshopPast(workshop.date);
                            return (
                                <div
                                    key={workshop.id}
                                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                                        isPast
                                            ? 'bg-[rgba(15,12,41,0.2)] border-[rgba(141,155,235,0.1)] opacity-60'
                                            : 'bg-[rgba(15,12,41,0.4)] border-[rgba(141,155,235,0.15)] hover:border-[rgba(141,155,235,0.3)]'
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                                            isPast ? 'bg-gray-500/20' : 'bg-[#8d9beb]/20'
                                        }`}
                                    >
                                        {isPast ? '✓' : '📚'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-semibold text-white">
                                                {workshop.title}
                                            </h3>
                                            {isPast && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            {formatWorkshopDate(workshop.date)} •{' '}
                                            {workshop.duration}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {workshop.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Notion Embed Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)] flex justify-between items-center">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        📋 Event Information
                    </h2>
                    <a
                        href={NOTION_EMBED_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8d9beb] hover:underline"
                    >
                        Open in Notion ↗
                    </a>
                </div>
                <div className="p-6">
                    <div className="rounded-xl overflow-hidden border border-[rgba(141,155,235,0.15)] bg-white">
                        <iframe
                            src={NOTION_EMBED_URL}
                            className="w-full h-[500px] border-0"
                            title="Product Sprint Information"
                            loading="lazy"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Having trouble viewing?{' '}
                        <a
                            href={NOTION_EMBED_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8d9beb] hover:underline"
                        >
                            Open directly in Notion
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}
