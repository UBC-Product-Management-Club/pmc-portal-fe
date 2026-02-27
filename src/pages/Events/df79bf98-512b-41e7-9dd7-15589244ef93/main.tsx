import { useState, useMemo, useEffect } from 'react';
import { useUserData } from '../../../providers/UserData/UserDataProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PMCLogo from '../../../assets/pmclogo.svg';
import { PHASES, formatDateRange, PHASE_FLAG_MAP } from './types';
import type { PhaseId } from './types';
import {
    useDeliverableFlags,
    getSubmissionStatus,
    type DeliverableFlag,
    type SubmissionStatus,
} from '../../../hooks/useDeliverableFlags';

// Phase components
import OverviewPhase from './phases/OverviewPhase';
import DiscoveryPhase from './phases/DiscoveryPhase';
import PlanningPhase from './phases/PlanningPhase';
import PrototypingPhase from './phases/PrototypingPhase';
import PitchingPhase from './phases/PitchingPhase';

// View type includes overview + phases
type ViewId = 'overview' | PhaseId;

// Generate star shadows for the starfield effect
function generateStarShadows(): string {
    let shadows = '';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        shadows += `${x}vw ${y}vh rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})${i < 99 ? ',' : ''}`;
    }
    return shadows;
}

const ViewComponents: Record<ViewId, React.ComponentType> = {
    overview: OverviewPhase,
    discovery: DiscoveryPhase,
    planning: PlanningPhase,
    prototyping: PrototypingPhase,
    pitching: PitchingPhase,
};

export default function ProductSprintDashboard() {
    const { user } = useUserData();
    const navigate = useNavigate();
    const { event_id } = useParams();
    const { getFlags } = useDeliverableFlags();

    // Star shadows memoized to prevent regeneration
    const starShadows = useMemo(() => generateStarShadows(), []);

    // Selected view (overview or phase)
    const [selectedViewId, setSelectedViewId] = useState<ViewId>('overview');

    // Flags state
    const [flags, setFlags] = useState<DeliverableFlag[]>([]);
    const [flagsLoaded, setFlagsLoaded] = useState(false);

    // Fetch flags
    useEffect(() => {
        const fetchFlags = async () => {
            if (!event_id) return;
            try {
                const data = await getFlags(event_id);
                setFlags(data || []);
            } catch {
                setFlags([]);
            } finally {
                setFlagsLoaded(true);
            }
        };
        fetchFlags();
    }, [event_id, getFlags]);

    // Get flag for a phase
    const getFlagForPhase = (phaseId: PhaseId): DeliverableFlag | undefined => {
        const flagId = PHASE_FLAG_MAP[phaseId];
        return flags.find((f) => f.id === flagId);
    };

    // Get the component for the selected view
    const ViewComponent = ViewComponents[selectedViewId];

    // Get status badge styles based on submission status
    const getStatusBadgeStyles = (status: SubmissionStatus, color: string) => {
        if (status === 'open') {
            return {
                background: `${color}33`,
                color: color,
            };
        } else if (status === 'closed') {
            return {
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
            };
        } else if (status === 'locked') {
            return {
                background: 'rgba(107, 114, 128, 0.2)',
                color: '#6b7280',
            };
        } else {
            // disabled
            return {
                background: 'rgba(107, 114, 128, 0.2)',
                color: '#6b7280',
            };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1d233f] to-[#24243e] relative overflow-hidden">
            {/* Star Field */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                    style={{ boxShadow: starShadows }}
                />
            </div>

            {/* Top Bar */}
            <div className="flex justify-between items-center px-8 py-4 fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[rgba(15,12,41,0.95)] to-transparent">
                <img
                    src={PMCLogo}
                    alt="PMC Logo"
                    className="h-10 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                />
                {user && (
                    <Link to="/profile" className="no-underline">
                        <div className="bg-gradient-to-br from-[rgba(141,155,235,0.2)] to-[rgba(175,113,170,0.2)] border border-[rgba(141,155,235,0.3)] text-white rounded-[20px] px-6 py-2 font-semibold text-sm backdrop-blur-sm">
                            Hi, {user.firstName}!
                        </div>
                    </Link>
                )}
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex min-h-screen">
                {/* Sidebar — fixed, does not scroll with page */}
                <aside className="w-[320px] min-w-[320px] fixed top-0 left-0 bottom-0 bg-[rgba(38,45,71,0.6)] backdrop-blur-xl border-r border-[rgba(141,155,235,0.15)] pt-24 px-6 pb-8 flex-col gap-4 overflow-y-auto hidden md:flex z-40">
                    {/* Overview Button */}
                    <button
                        onClick={() => setSelectedViewId('overview')}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left w-full transition-all duration-200 cursor-pointer
                            ${selectedViewId === 'overview' ? 'border-opacity-100' : 'border-transparent'}
                        `}
                        style={{
                            background:
                                selectedViewId === 'overview'
                                    ? 'rgba(141, 155, 235, 0.3)'
                                    : 'rgba(38, 45, 71, 0.4)',
                            borderColor: selectedViewId === 'overview' ? '#8d9beb' : 'transparent',
                            boxShadow:
                                selectedViewId === 'overview'
                                    ? '0 0 20px rgba(141, 155, 235, 0.2)'
                                    : 'none',
                        }}
                    >
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm bg-[rgba(141,155,235,0.2)] border-2 border-[#8d9beb] text-[#8d9beb]">
                            🏠
                        </span>
                        <div className="flex-1">
                            <span className="block text-sm font-semibold text-white">Overview</span>
                            <span className="block text-xs text-gray-400">Team & Schedule</span>
                        </div>
                    </button>

                    <h2 className="text-xs font-semibold text-[rgba(141,155,235,0.7)] uppercase tracking-wider mt-4 mb-2">
                        Competition Phases
                    </h2>
                    <div className="flex flex-col gap-2">
                        {PHASES.map((phase, index) => {
                            const flag = getFlagForPhase(phase.id);
                            const status = getSubmissionStatus(flag);
                            const isSelected = selectedViewId === phase.id;

                            return (
                                <button
                                    key={phase.id}
                                    onClick={() => setSelectedViewId(phase.id)}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left w-full transition-all duration-200 cursor-pointer
                                        ${isSelected ? 'border-opacity-100' : 'border-transparent'}
                                    `}
                                    style={{
                                        background: isSelected
                                            ? phase.glowColor
                                            : 'rgba(38, 45, 71, 0.4)',
                                        borderColor: isSelected ? phase.color : 'transparent',
                                        boxShadow: isSelected
                                            ? `0 0 20px ${phase.color}33`
                                            : 'none',
                                    }}
                                >
                                    <span
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                                        style={{
                                            background: `linear-gradient(135deg, ${phase.color}33, ${phase.color}11)`,
                                            border: `2px solid ${phase.color}`,
                                            color: phase.color,
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <span className="block text-sm font-semibold text-white">
                                            {phase.name}
                                        </span>
                                        <span className="block text-xs text-gray-400">
                                            {formatDateRange(phase.startDate, phase.endDate)}
                                        </span>
                                    </div>
                                    {flagsLoaded ? (
                                        <span
                                            className="text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                            style={getStatusBadgeStyles(status, phase.color)}
                                        >
                                            {status}
                                        </span>
                                    ) : (
                                        <span className="w-12 h-4 bg-gray-600/30 rounded-full animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content — offset by sidebar width on md+ */}
                <main className="flex-1 md:ml-[320px] pt-24 px-8 pb-8 overflow-y-auto max-md:px-4 max-md:pt-20">
                    {/* Mobile View Picker */}
                    <div className="hidden max-md:block mb-6">
                        <select
                            value={selectedViewId}
                            onChange={(e) => setSelectedViewId(e.target.value as ViewId)}
                            className="w-full p-3.5 rounded-xl bg-[rgba(38,45,71,0.6)] text-white text-base font-medium cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] border border-[rgba(141,155,235,0.3)]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            }}
                        >
                            <option value="overview" className="bg-[#1d233f] text-white">
                                🏠 Overview - Team & Schedule
                            </option>
                            {PHASES.map((phase, index) => {
                                const flag = getFlagForPhase(phase.id);
                                const status = flagsLoaded ? getSubmissionStatus(flag) : '...';
                                return (
                                    <option
                                        key={phase.id}
                                        value={phase.id}
                                        className="bg-[#1d233f] text-white"
                                    >
                                        {index + 1}. {phase.name} (
                                        {formatDateRange(phase.startDate, phase.endDate)}) -{' '}
                                        {status}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Render the selected view component */}
                    <ViewComponent />
                </main>
            </div>
        </div>
    );
}
