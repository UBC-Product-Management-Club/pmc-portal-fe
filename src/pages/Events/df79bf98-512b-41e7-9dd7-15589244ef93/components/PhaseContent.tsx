import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    useDeliverableFlags,
    getSubmissionStatus,
    canSubmitDeliverable,
    type DeliverableFlag,
} from '../../../../hooks/useDeliverableFlags';
import { useTeam } from '../../../../hooks/useTeam';
import type { Phase, Submission, SubmittedFile } from '../types';
import { getResourceIcon, formatDate, formatDateRange, PHASE_FLAG_MAP } from '../types';

// LocalStorage key for tasks
const getTasksStorageKey = (eventId: string, phaseId: string) => `pmc_tasks_${eventId}_${phaseId}`;

interface PhaseContentProps {
    phase: Phase;
}

export default function PhaseContent({ phase }: PhaseContentProps) {
    const { event_id } = useParams();
    const { getFlags } = useDeliverableFlags();
    const { submitDeliverable, getDeliverable } = useTeam();

    // Tasks state - load from localStorage
    const [tasksState, setTasksState] = useState<Record<string, boolean>>(() => {
        if (event_id) {
            const stored = localStorage.getItem(getTasksStorageKey(event_id, phase.id));
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    // Fall through to default
                }
            }
        }
        // Default: all tasks uncompleted
        const initial: Record<string, boolean> = {};
        phase.tasks.forEach((task) => {
            initial[task.id] = false;
        });
        return initial;
    });

    // Selected files for deliverables
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>(() => {
        const initial: Record<string, File | null> = {};
        phase.deliverables.forEach((d) => {
            initial[d.id] = null;
        });
        return initial;
    });

    // Last submission
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Deliverable flags
    const [phaseFlag, setPhaseFlag] = useState<DeliverableFlag | null>(null);
    const [flagsLoading, setFlagsLoading] = useState(true);

    // Save tasks to localStorage when they change
    useEffect(() => {
        if (event_id) {
            localStorage.setItem(
                getTasksStorageKey(event_id, phase.id),
                JSON.stringify(tasksState)
            );
        }
    }, [tasksState, event_id, phase.id]);

    // Fetch deliverable flags and existing submission
    useEffect(() => {
        const fetchData = async (eventId: string) => {
            // Clear previous submission when switching phases
            setSubmission(null);
            setFlagsLoading(true);

            try {
                const flags = await getFlags(eventId);
                const flagId = PHASE_FLAG_MAP[phase.id];
                const flag = flags.find((f) => f.id === flagId);
                setPhaseFlag(flag || null);

                // Fetch existing submission for this phase
                const existing = await getDeliverable(eventId, phase.id);
                if (existing) {
                    const submissionData = existing.submission as unknown as
                        | Record<string, unknown>
                        | undefined;
                    const fileLinks = (submissionData?.file_links as string[]) || [];
                    const files: SubmittedFile[] = fileLinks.map((link: string, index: number) => {
                        const filename = link.substring(link.lastIndexOf('/') + 1);
                        return {
                            deliverableId: `file-${index}`,
                            fileName: filename,
                        };
                    });

                    setSubmission({
                        submittedAt: new Date(existing.submitted_at || new Date()),
                        files,
                    });
                }
            } catch {
                setPhaseFlag(null);
            } finally {
                setFlagsLoading(false);
            }
        };
        if (event_id) {
            fetchData(event_id);
        }
    }, [event_id, getFlags, getDeliverable, phase.id]);

    // Calculate task progress
    const completedTasks = Object.values(tasksState).filter(Boolean).length;
    const totalTasks = phase.tasks.length;

    // Handle task toggle
    const handleTaskToggle = (taskId: string) => {
        setTasksState((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    // Handle file select
    const handleFileSelect = (deliverableId: string, file: File | null) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [deliverableId]: file,
        }));
    };

    // Check submission status from flag (disable while loading)
    const submissionStatus = getSubmissionStatus(phaseFlag || undefined);
    const isSubmissionOpen = !flagsLoading && canSubmitDeliverable(phaseFlag || undefined);

    // Get submission readiness
    const requiredDeliverables = phase.deliverables.filter((d) => d.required);
    const selectedCount = Object.values(selectedFiles).filter((f) => f !== null).length;
    const requiredSelected = requiredDeliverables.filter(
        (d) => selectedFiles[d.id] !== null
    ).length;
    const canSubmit = isSubmissionOpen && requiredSelected === requiredDeliverables.length;

    // Handle submit
    const handleSubmit = async () => {
        if (!event_id || !canSubmit) return;

        setSubmitting(true);
        try {
            const formData = new FormData();

            Object.entries(selectedFiles).forEach(([deliverableId, file]) => {
                if (file) {
                    formData.append(deliverableId, file);
                }
            });

            await submitDeliverable(event_id, phase.id, formData);

            // Re-fetch to get actual file URLs
            const saved = await getDeliverable(event_id, phase.id);
            if (saved) {
                const submissionData = saved.submission as unknown as
                    | Record<string, unknown>
                    | undefined;
                const fileLinks = (submissionData?.file_links as string[]) || [];
                const files: SubmittedFile[] = fileLinks.map((link: string, index: number) => {
                    const filename = link.substring(link.lastIndexOf('/') + 1);
                    return {
                        deliverableId: `file-${index}`,
                        fileName: filename,
                    };
                });

                setSubmission({
                    submittedAt: new Date(saved.submitted_at || new Date()),
                    files,
                });
            }

            // Clear selected files after submission
            setSelectedFiles(Object.fromEntries(Object.keys(selectedFiles).map((k) => [k, null])));
        } catch (error) {
            console.error('Error submitting deliverables:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto">
            {/* Phase Header */}
            <div
                className="rounded-2xl p-8 mb-8 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${phase.glowColor}, rgba(38, 45, 71, 0.6))`,
                    border: `1px solid ${phase.color}44`,
                }}
            >
                <div
                    className="absolute -top-1/2 -right-[10%] w-[300px] h-[300px] pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${phase.color}22 0%, transparent 70%)`,
                    }}
                />
                <div className="relative z-10 flex justify-between items-start gap-8 max-sm:flex-col">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{
                                    background: phase.color,
                                    boxShadow: `0 0 10px ${phase.color}`,
                                }}
                            />
                            {phase.name}
                        </h1>
                        <p className="text-sm text-gray-400 mb-2">
                            {formatDateRange(phase.startDate, phase.endDate)}
                            {flagsLoading ? (
                                <span className="ml-3 inline-block w-14 h-4 bg-gray-600/30 rounded animate-pulse align-middle" />
                            ) : (
                                <>
                                    {submissionStatus === 'locked' && (
                                        <span className="ml-3 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs font-medium uppercase">
                                            Locked
                                        </span>
                                    )}
                                    {submissionStatus === 'open' && (
                                        <span
                                            className="ml-3 px-2 py-0.5 rounded text-xs font-medium uppercase"
                                            style={{
                                                background: `${phase.color}33`,
                                                color: phase.color,
                                            }}
                                        >
                                            Open
                                        </span>
                                    )}
                                    {submissionStatus === 'closed' && (
                                        <span className="ml-3 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium uppercase">
                                            Closed
                                        </span>
                                    )}
                                    {submissionStatus === 'disabled' && (
                                        <span className="ml-3 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs font-medium uppercase">
                                            Disabled
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                        <p className="text-base text-gray-300 mb-6 leading-relaxed">
                            {phase.description}
                        </p>
                        <div className="flex gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold" style={{ color: phase.color }}>
                                    {completedTasks}/{totalTasks}
                                </span>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">
                                    Tasks Done
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold" style={{ color: phase.color }}>
                                    {phase.deliverables.length}
                                </span>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">
                                    Deliverables
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-[120px] h-[120px] relative animate-bounce max-sm:hidden">
                        <div
                            className="w-full h-full rounded-full flex items-center justify-center text-5xl"
                            style={{
                                background: `linear-gradient(135deg, ${phase.color}44, ${phase.color}11)`,
                                border: `3px solid ${phase.color}`,
                            }}
                        >
                            ⚙️
                        </div>
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)] flex justify-between items-center">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        📚 Phase Resources
                    </h2>
                </div>
                <div className="p-6">
                    {phase.resources.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                            {phase.resources.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3.5 bg-[rgba(15,12,41,0.4)] border border-[rgba(141,155,235,0.15)] rounded-xl no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-opacity-50"
                                    style={{ ['--hover-color' as string]: phase.color }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${phase.color}66`;
                                        e.currentTarget.style.background = `${phase.color}11`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor =
                                            'rgba(141, 155, 235, 0.15)';
                                        e.currentTarget.style.background = 'rgba(15, 12, 41, 0.4)';
                                    }}
                                >
                                    <span
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                                        style={{
                                            background: `${phase.color}22`,
                                            color: phase.color,
                                        }}
                                    >
                                        {getResourceIcon(resource.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <span className="block text-sm font-medium text-white truncate">
                                            {resource.title}
                                        </span>
                                        <span className="text-xs text-gray-400 capitalize">
                                            {resource.type}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No resources available for this phase.
                        </div>
                    )}
                </div>
            </section>

            {/* Tasks Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)] flex justify-between items-center">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        ✅ Tasks to Complete
                    </h2>
                    <span className="text-sm font-semibold" style={{ color: phase.color }}>
                        {completedTasks}/{totalTasks}
                    </span>
                </div>
                <div className="p-6">
                    {phase.tasks.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {phase.tasks.map((task) => {
                                const isCompleted = tasksState[task.id] || false;
                                return (
                                    <label
                                        key={task.id}
                                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                                            ${
                                                isCompleted
                                                    ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/15'
                                                    : 'bg-[rgba(15,12,41,0.4)] border border-[rgba(141,155,235,0.15)] hover:bg-[rgba(141,155,235,0.1)]'
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isCompleted}
                                            onChange={() => handleTaskToggle(task.id)}
                                            className="appearance-none w-5 h-5 border-2 border-[rgba(141,155,235,0.5)] rounded cursor-pointer flex-shrink-0 mt-0.5 relative transition-all duration-200 checked:bg-green-500 checked:border-green-500 checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
                                        />
                                        <div
                                            className={`flex-1 ${isCompleted ? 'opacity-70 line-through' : ''}`}
                                        >
                                            <span className="block text-sm text-white font-medium">
                                                {task.title}
                                            </span>
                                            {task.description && (
                                                <span className="block text-xs text-gray-400 mt-1">
                                                    {task.description}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No tasks for this phase.
                        </div>
                    )}
                </div>
            </section>

            {/* Deliverables Section */}
            <section className="bg-[rgba(38,45,71,0.6)] backdrop-blur-sm border border-[rgba(141,155,235,0.15)] rounded-2xl mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(141,155,235,0.1)] flex justify-between items-center">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        📤 Submit Deliverables
                    </h2>
                </div>
                <div className="p-6">
                    {/* Last Submission Box */}
                    {submission && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">✓</span>
                                <span className="text-sm font-semibold text-green-500">
                                    Last Submission
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    {formatDate(submission.submittedAt)}
                                </span>
                            </div>
                            <ul className="m-0 p-0 list-none">
                                {submission.files.map((file) => {
                                    const deliverable = phase.deliverables.find(
                                        (d) => d.id === file.deliverableId
                                    );
                                    return (
                                        <li
                                            key={file.deliverableId}
                                            className="flex items-center gap-2 text-xs text-gray-400 py-1"
                                        >
                                            📄 <strong>{deliverable?.title}:</strong>{' '}
                                            {file.fileName}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Deliverable Upload Items */}
                    {phase.deliverables.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-3">
                                {phase.deliverables.map((deliverable) => {
                                    const file = selectedFiles[deliverable.id];
                                    return (
                                        <div
                                            key={deliverable.id}
                                            className="flex items-center gap-4 p-4 bg-[rgba(15,12,41,0.4)] border border-[rgba(141,155,235,0.15)] rounded-xl max-sm:flex-col max-sm:items-stretch"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <span className="flex items-center gap-2 text-sm font-medium text-white">
                                                    {deliverable.title}
                                                    {deliverable.required && (
                                                        <span className="text-[0.65rem] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-500">
                                                            Required
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <label
                                                className={`flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg transition-all duration-200 min-w-[200px] max-sm:w-full max-sm:justify-center
                                                ${
                                                    isSubmissionOpen
                                                        ? 'bg-[rgba(141,155,235,0.1)] border-[rgba(141,155,235,0.3)] cursor-pointer hover:bg-[rgba(141,155,235,0.15)] hover:border-[rgba(141,155,235,0.5)]'
                                                        : 'bg-[rgba(107,114,128,0.1)] border-[rgba(107,114,128,0.2)] cursor-not-allowed opacity-50'
                                                }`}
                                            >
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    disabled={!isSubmissionOpen}
                                                    onChange={(e) =>
                                                        handleFileSelect(
                                                            deliverable.id,
                                                            e.target.files?.[0] || null
                                                        )
                                                    }
                                                />
                                                <span
                                                    className={`text-xs truncate max-w-[150px] ${file ? 'text-green-500' : 'text-gray-400'}`}
                                                >
                                                    {flagsLoading
                                                        ? '...'
                                                        : !isSubmissionOpen
                                                          ? '🔒 Locked'
                                                          : file
                                                            ? file.name
                                                            : 'Choose file...'}
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(141,155,235,0.1)] max-sm:flex-col max-sm:gap-4">
                                <span className="text-sm text-gray-400">
                                    {flagsLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                    ) : submissionStatus === 'locked' ? (
                                        <span className="text-gray-500">Submissions locked</span>
                                    ) : submissionStatus === 'closed' ? (
                                        <span className="text-red-500">Submissions closed</span>
                                    ) : submissionStatus === 'disabled' ? (
                                        <span className="text-gray-500">Submissions disabled</span>
                                    ) : (
                                        <>
                                            {selectedCount}/{phase.deliverables.length} files
                                            selected
                                            {requiredSelected < requiredDeliverables.length && (
                                                <span>
                                                    {' '}
                                                    (
                                                    {requiredDeliverables.length -
                                                        requiredSelected}{' '}
                                                    required remaining)
                                                </span>
                                            )}
                                        </>
                                    )}
                                </span>
                                <button
                                    disabled={!canSubmit || submitting}
                                    onClick={handleSubmit}
                                    className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                                        ${
                                            !canSubmit || submitting
                                                ? 'bg-gray-500/30 text-white/50 cursor-not-allowed'
                                                : 'text-white cursor-pointer hover:-translate-y-0.5'
                                        }
                                    `}
                                    style={
                                        canSubmit && !submitting
                                            ? {
                                                  background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`,
                                                  boxShadow: `0 4px 15px ${phase.color}44`,
                                              }
                                            : {}
                                    }
                                >
                                    {submitting ? 'Submitting...' : 'Submit All Deliverables'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No deliverables for this phase.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
