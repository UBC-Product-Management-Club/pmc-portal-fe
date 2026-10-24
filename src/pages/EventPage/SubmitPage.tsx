import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { MdCheck, MdLockOutline, MdOutlineSchedule, MdPauseCircleOutline } from 'react-icons/md';
import { useEvents } from '../../hooks/useEvents';
import { useTeam } from '../../hooks/useTeam';
import { useSubmission } from '../../hooks/useSubmission';
import { ApiError } from '../../service/RestClient';
import { Event } from '../../types/Event';
import { Phase, Submission, SubmissionField } from '../../types/EventDay';
import { TeamResponse } from '../../types/Team';
import { showToast } from '../../utils';
import { Badge } from '../../components/Portal/Badge';
import { Button } from '../../components/Portal/Button';
import { Field } from '../../components/Event/ApplicationField';
import {
    checkFile,
    checkLink,
    countWords,
    inputClass,
} from '../../components/Event/applicationRules';
import { formatPacific } from '../../components/Event/eventStatus';
import { effectiveDeadline, windowState } from '../../components/Event/submissionWindow';

const formatTime = (iso: string) => moment.utc(iso).tz('America/Vancouver').format('h:mm A');

// Counts down from the server's clock, not the laptop's
function useServerNow(serverTime?: string) {
    const offset = useRef(0);
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        if (serverTime) offset.current = new Date(serverTime).getTime() - Date.now();
        const tick = () => setNow(new Date(Date.now() + offset.current));
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [serverTime]);
    return now;
}

function countdown(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m ${s.toString().padStart(2, '0')}s`;
}

export default function SubmitPage() {
    const { event_id: eventId = '' } = useParams<{ event_id: string }>();
    const { getById } = useEvents();
    const { getTeam } = useTeam();
    const { getPhases, getSubmission, saveSubmission } = useSubmission();

    const [event, setEvent] = useState<Event>();
    const [team, setTeam] = useState<TeamResponse | null>();
    const [phase, setPhase] = useState<Phase | null>();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [conflict, setConflict] = useState<Submission | null>(null);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const loadSubmission = useCallback(
        async (phaseId: string) => {
            const latest = await getSubmission(eventId, phaseId).catch(() => null);
            setSubmission(latest);
            setValues(latest?.answers ?? {});
            setFiles({});
            setErrors({});
            setConflict(null);
        },
        [eventId, getSubmission]
    );

    useEffect(() => {
        getById(eventId).then(setEvent);
        getTeam(eventId)
            .then(setTeam)
            .catch(() => setTeam(null));
        getPhases(eventId)
            .then(([first]) => {
                setPhase(first ?? null);
                if (first) loadSubmission(first.phaseId);
            })
            .catch(() => setPhase(null));
    }, [eventId, getById, getTeam, getPhases, loadSubmission]);

    const now = useServerNow(phase?.serverTime);

    if (team === null) return <Navigate to={`/events/${eventId}#team-formation`} replace />;
    if (!event || !team || phase === undefined) return <p className="text-center">Loading…</p>;
    if (!phase) {
        return <div className="glass p-6">This event doesn't have a submission yet.</div>;
    }

    const deadline = effectiveDeadline(phase);
    const state = windowState(phase, now);
    const editable = state === 'open';

    const update = (key: string, value: string) => {
        setValues({ ...values, [key]: value });
        setErrors(Object.fromEntries(Object.entries(errors).filter(([k]) => k !== key)));
    };

    const validate = () => {
        const found: Record<string, string> = {};
        for (const field of phase.fields) {
            const value = values[field.id] ?? '';
            let error: string | undefined;
            if (field.type === 'file') {
                // An earlier upload counts unless it's being replaced
                const file = files[field.id] ?? null;
                error = file || !value ? checkFile(field, file) : undefined;
            } else if (field.type === 'url') {
                error = checkLink(value, field.required);
            } else if (field.required && !value.trim()) {
                error = 'This field is required.';
            } else if (field.maxWords && countWords(value) > field.maxWords) {
                error = `Keep this to ${field.maxWords} words.`;
            }
            if (error) found[field.id] = error;
        }
        return found;
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const formData = new FormData();
        for (const field of phase.fields) {
            const file = files[field.id];
            if (field.type === 'file') {
                if (file) formData.append(field.id, file);
            } else {
                formData.append(field.id, (values[field.id] ?? '').trim());
            }
        }
        formData.append('expected_version', String(submission?.version ?? 0));

        setSaving(true);
        try {
            const saved = await saveSubmission(eventId, phase.phaseId, formData);
            setSubmission(saved);
            setValues(saved.answers);
            setFiles({});
            setEditing(false);
            showToast('success', 'Project submitted.');
        } catch (error) {
            if (error instanceof ApiError && error.code === 'STALE') {
                const latest = await getSubmission(eventId, phase.phaseId).catch(() => null);
                setConflict(latest);
            } else if (error instanceof ApiError && error.fields) {
                setErrors(error.fields);
            } else {
                const messages: Record<string, string> = {
                    TEAM_TOO_SMALL: "Your team doesn't have enough members to submit yet.",
                    CLOSED: 'Submissions closed before your save finished.',
                    NOT_OPEN: "Submissions aren't open yet.",
                    DISABLED: 'Submissions are paused by the organizers.',
                };
                const code = error instanceof ApiError ? error.code : undefined;
                showToast('error', (code && messages[code]) ?? "Couldn't save. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const timer = (state === 'open' || state === 'not-open') && (
        <>
            <small className="text-xs text-slate-600">
                {state === 'open' ? 'Closes in' : 'Opens in'}
            </small>
            <span className="text-xl font-semibold tabular-nums">
                {countdown(
                    new Date(state === 'open' ? deadline : phase.startTime).getTime() -
                        now.getTime()
                )}
            </span>
            <small className="text-xs text-slate-600">
                {formatPacific(state === 'open' ? deadline : phase.startTime)}
                {state === 'open' && phase.extendedUntil && ' (extended)'}
            </small>
        </>
    );

    // A saved submission is shown as a summary; the form only appears while editing
    const showForm = editable && (!submission || editing);
    const savedBy = submission && (
        <>
            Last saved
            {submission.submittedAt && ` at ${formatTime(submission.submittedAt)} PT`} by{' '}
            {submission.submittedBy ?? 'a teammate'}
        </>
    );

    return (
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <p className="text-sm text-slate-600">
                <Link to={`/events/${eventId}`} className="underline">
                    {event.name}
                </Link>{' '}
                ›{' '}
                <Link to={`/events/${eventId}/team`} className="underline">
                    {team.Team.team_name}
                </Link>{' '}
                › Submission
            </p>

            {/* Phone: the countdown is a sticky bar at the top of the page */}
            {timer && (
                <div className="sticky top-[68px] z-20 -mx-4 flex items-center justify-between gap-2 bg-white/85 px-4 py-2 backdrop-blur md:hidden">
                    {timer}
                </div>
            )}

            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-3xl font-medium md:text-4xl">
                        {submission && !editing ? 'Your project' : 'Submit your project'}
                    </h1>
                    {submission ? (
                        <Badge tone="good">Submitted</Badge>
                    ) : (
                        <Badge tone="warn">Not submitted</Badge>
                    )}
                </div>
                {timer && (
                    <div className="glass hidden flex-col items-end px-4 py-2 md:flex">{timer}</div>
                )}
            </div>

            {submission && !showForm && (
                <StatusCard
                    icon={state === 'closed' ? <MdLockOutline /> : <MdCheck />}
                    title={state === 'closed' ? 'Submissions are closed' : 'Project submitted'}
                    detail={
                        <>
                            {savedBy}.{' '}
                            {state === 'open'
                                ? 'Any teammate can still edit it until the deadline.'
                                : 'This is what the judges will see.'}
                        </>
                    }
                    action={
                        editable && (
                            <Button onClick={() => setEditing(true)}>Edit submission</Button>
                        )
                    }
                />
            )}
            {!submission && state === 'closed' && (
                <StatusCard
                    icon={<MdLockOutline />}
                    title="Submissions are closed"
                    detail="Your team didn't submit before the deadline. Reach out to the organizers if something went wrong."
                />
            )}
            {state === 'not-open' && (
                <StatusCard
                    icon={<MdOutlineSchedule />}
                    title={`Submissions open ${formatPacific(phase.startTime)}`}
                    detail={
                        <>
                            Get these ready:
                            <ul className="mt-1 list-disc pl-5">
                                {phase.fields.map((field) => (
                                    <li key={field.id}>{field.label}</li>
                                ))}
                            </ul>
                        </>
                    }
                />
            )}
            {state === 'disabled' && (
                <StatusCard
                    icon={<MdPauseCircleOutline />}
                    title="Submissions are paused"
                    detail="The organizers have paused submissions. Check back soon."
                />
            )}

            {submission && !showForm && (
                <dl className="glass flex flex-col divide-y divide-white/70 px-4 md:px-6">
                    {phase.fields.map((field) => (
                        <div
                            key={field.id}
                            className="flex flex-col gap-1 py-3 md:flex-row md:gap-6"
                        >
                            <dt className="text-sm font-semibold md:w-56 md:shrink-0">
                                {field.label}
                            </dt>
                            <dd className="min-w-0 break-words text-slate-700">
                                <Answer field={field} value={submission.answers[field.id]} />
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            {conflict && (
                <div className="glass flex flex-col gap-3 border-amber-300 p-4 md:flex-row md:items-center">
                    <p className="flex-1">
                        {conflict.submittedBy ?? 'A teammate'} updated this
                        {conflict.submittedAt && ` at ${formatTime(conflict.submittedAt)}`}. Review
                        their changes before saving.
                    </p>
                    <Button onClick={() => loadSubmission(phase.phaseId)}>Reload</Button>
                </div>
            )}

            {showForm && (
                <>
                    <div className="glass flex flex-col gap-5 p-4 md:p-6">
                        <Field label="Team name">
                            <input className={inputClass} value={team.Team.team_name} disabled />
                        </Field>
                        <p className="-mt-3 text-xs text-slate-600">
                            From your team. Rename it on the team page.
                        </p>
                        {phase.fields.map((field) => (
                            <SubmissionInput
                                key={field.id}
                                field={field}
                                value={values[field.id] ?? ''}
                                file={files[field.id] ?? null}
                                error={errors[field.id]}
                                disabled={saving}
                                onChange={(value) => update(field.id, value)}
                                onFile={(file) => {
                                    setFiles({ ...files, [field.id]: file });
                                    const fileError = file ? checkFile(field, file) : undefined;
                                    setErrors(
                                        fileError ? { ...errors, [field.id]: fileError } : errors
                                    );
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
                        <span className="text-sm text-slate-600">
                            Any teammate can update it until the deadline. Uploads must finish
                            before then.
                        </span>
                        <div className="flex flex-col-reverse gap-3 md:flex-row">
                            {submission && (
                                <Button
                                    onClick={() => {
                                        loadSubmission(phase.phaseId);
                                        setEditing(false);
                                    }}
                                    disabled={saving}
                                    className="w-full md:w-auto"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={saving}
                                className="w-full md:w-auto md:px-8"
                            >
                                {saving
                                    ? 'Saving…'
                                    : submission
                                      ? 'Save changes'
                                      : 'Submit project'}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
}

function StatusCard({
    icon,
    title,
    detail,
    action,
}: {
    icon: ReactNode;
    title: string;
    detail: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="glass flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-6">
            <span className="portal-accent flex size-12 shrink-0 items-center justify-center rounded-full text-2xl text-white">
                {icon}
            </span>
            <div className="flex-1">
                <p className="text-xl font-semibold">{title}</p>
                <div className="text-sm text-slate-700">{detail}</div>
            </div>
            {action}
        </div>
    );
}

// Read-only answer: links open in a new tab, files show their name
function Answer({ field, value }: { field: SubmissionField; value?: string }) {
    if (!value) return <span className="text-slate-500">Not provided</span>;
    if (field.type === 'url') {
        return (
            <a href={value} target="_blank" rel="noreferrer" className="underline">
                {value}
            </a>
        );
    }
    if (field.type === 'file') return <span>📄 {value}</span>;
    return <span className="whitespace-pre-wrap">{value}</span>;
}

type SubmissionInputProps = {
    field: SubmissionField;
    value: string;
    file: File | null;
    error?: string;
    disabled: boolean;
    onChange: (value: string) => void;
    onFile: (file: File | null) => void;
};

function SubmissionInput({
    field,
    value,
    file,
    error,
    disabled,
    onChange,
    onFile,
}: SubmissionInputProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const label = field.required ? field.label : `${field.label} (optional)`;

    if (field.type === 'file') {
        const current = file ? `${file.name} · ${(file.size / 1_000_000).toFixed(1)} MB` : value;
        return (
            <Field
                label={label}
                error={error}
                help={field.maxSizeMB ? `PDF, up to ${field.maxSizeMB} MB` : undefined}
            >
                <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    accept={field.accept?.join(',')}
                    disabled={disabled}
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => fileInput.current?.click()}
                    className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-[10px] border border-dashed bg-white/60 px-3 py-2 text-left ${error ? 'border-red-500' : 'border-slate-400'}`}
                >
                    <span className="truncate">{current ? `📄 ${current}` : 'Choose a PDF'}</span>
                    {current && !disabled && (
                        <span className="shrink-0 text-sm underline">Replace</span>
                    )}
                </button>
            </Field>
        );
    }

    if (field.type === 'long-answer') {
        const words = countWords(value);
        const over = field.maxWords !== undefined && words > field.maxWords;
        return (
            <Field
                label={label}
                error={error}
                footer={
                    field.maxWords !== undefined && (
                        <span
                            className={`text-right text-xs ${over ? 'font-semibold text-red-700' : 'text-slate-600'}`}
                        >
                            {words} / {field.maxWords} words
                        </span>
                    )
                }
            >
                <textarea
                    className={`${inputClass} min-h-28 ${over ? 'border-red-500' : ''}`}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            </Field>
        );
    }

    return (
        <Field label={label} error={error}>
            <input
                className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                type={field.type === 'url' ? 'url' : 'text'}
                inputMode={field.type === 'url' ? 'url' : undefined}
                placeholder={field.type === 'url' ? 'https://' : undefined}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
        </Field>
    );
}
