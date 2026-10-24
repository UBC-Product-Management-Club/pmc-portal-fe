import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { usePaymentService } from '../../hooks/usePaymentService';
import { DraftValues, useApplicationDraft } from '../../hooks/useApplicationDraft';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { ApiError } from '../../service/RestClient';
import { Attendee } from '../../types/Attendee';
import { Event } from '../../types/Event';
import { parseQuestions, Question } from '../../types/Question';
import { renderDate, showToast } from '../../utils';
import { Badge } from '../../components/Portal/Badge';
import { Button, ButtonLink } from '../../components/Portal/Button';
import { Field, QuestionField } from '../../components/Event/ApplicationField';
import { checkFile, countWords, inputClass } from '../../components/Event/applicationRules';
import { formatPrice, getEventStatus } from '../../components/Event/eventStatus';

const without = (errors: Record<string, string>, key: string) =>
    Object.fromEntries(Object.entries(errors).filter(([k]) => k !== key));

const SAVE_LABELS = {
    idle: '',
    saving: 'Saving…',
    saved: 'Saved ✓',
    error: "Couldn't save",
    stale: '',
};

export default function ApplicationPage() {
    const { event_id: eventId = '' } = useParams<{ event_id: string }>();
    const navigate = useNavigate();
    const { user, isMember } = useUserData();
    const { getById, addAttendee } = useEvents();
    const { getAttendee } = useAttendee();
    const paymentService = usePaymentService();

    const [event, setEvent] = useState<Event>();
    const [attendee, setAttendee] = useState<Attendee | null | undefined>(undefined);
    const [values, setValues] = useState<DraftValues>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const draft = useApplicationDraft(eventId, !!user && attendee === null);
    const questions: Question[] = useMemo(
        () => (event ? parseQuestions(event.eventFormQuestions) : []),
        [event]
    );

    useEffect(() => {
        getById(eventId).then(setEvent);
    }, [eventId, getById]);

    useEffect(() => {
        if (!user) return;
        getAttendee(eventId)
            .then(setAttendee)
            .catch(() => setAttendee(null));
    }, [eventId, user, getAttendee]);

    // Name and email start from the profile; a restored draft wins
    useEffect(() => {
        if (!draft.loaded || !user) return;
        setValues({
            name: [user.firstName, user.lastName].filter(Boolean).join(' '),
            email: user.email ?? '',
            ...draft.initial,
        });
    }, [draft.loaded, draft.initial, user]);

    if (!event) return <p className="text-center">Loading…</p>;

    const backLink = (
        <ButtonLink to={`/events/${eventId}`} className="self-start">
            Back to {event.name}
        </ButtonLink>
    );

    if (!user) {
        return (
            <div className="glass flex flex-col gap-4 p-6">
                <h1 className="text-3xl font-medium">Apply to {event.name}</h1>
                <p>Sign in to start your application. Your answers save as you go.</p>
                <Button className="self-start" onClick={() => navigate('/')}>
                    Sign in
                </Button>
            </div>
        );
    }

    if (attendee === undefined || (attendee === null && !draft.loaded)) {
        return <p className="text-center">Loading…</p>;
    }

    if (attendee)
        return <SubmittedAnswers event={event} attendee={attendee} questions={questions} />;

    const status = getEventStatus({ event, attendee, hasDraft: false, isSignedIn: true });
    if (status === 'NOT_OPEN_YET' || status === 'CLOSED' || status === 'FULL') {
        const reason = {
            NOT_OPEN_YET: "Applications aren't open yet.",
            CLOSED: 'Applications for this event are closed.',
            FULL: 'This event is full.',
        }[status];
        return (
            <div className="glass flex flex-col gap-4 p-6">
                <h1 className="text-3xl font-medium">Apply to {event.name}</h1>
                <p>{reason}</p>
                {backLink}
            </div>
        );
    }

    const update = (key: string, value: string) => {
        const next = { ...values, [key]: value };
        setValues(next);
        setErrors((current) => without(current, key));
        draft.queueSave(next);
    };

    const validate = () => {
        const found: Record<string, string> = {};
        if (!values.name?.trim()) found.name = 'Please enter your name.';
        if (!/^\S+@\S+\.\S+$/.test(values.email ?? '')) found.email = 'Please enter a valid email.';
        for (const q of questions) {
            const answer = values[q.id] ?? '';
            if (q.type === 'file') {
                const fileError = checkFile(q, files[q.id] ?? null);
                if (fileError) found[q.id] = fileError;
            } else if (q.required && !answer.trim()) {
                found[q.id] = 'This field is required.';
            } else if (q.type === 'long-answer' && q.maxWords && countWords(answer) > q.maxWords) {
                found[q.id] = `Keep this to ${q.maxWords} words.`;
            }
        }
        return found;
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) {
            showToast('error', 'Please fix the highlighted answers.');
            return;
        }

        // Submit sends the full current answers, not whatever autosave stored last
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => formData.append(key, value.trim()));
        Object.entries(files).forEach(([key, file]) => file && formData.append(key, file));

        setSubmitting(true);
        try {
            await addAttendee(eventId, formData);
            await draft.clear();
            if (!event.needsReview) {
                const { url } = await paymentService.getOrCreateEventCheckoutSession(eventId);
                window.location.href = url;
                return;
            }
            showToast('success', 'Application submitted. We’ll let you know once it’s reviewed.');
            navigate(`/events/${eventId}`);
        } catch (error) {
            if (error instanceof ApiError && error.fields) setErrors(error.fields);
            const messages: Record<string, string> = {
                EVENT_FULL: 'This event filled up before you submitted.',
                CLOSED: 'Applications closed before you submitted.',
            };
            const code = error instanceof ApiError ? error.code : undefined;
            showToast('error', (code && messages[code]) ?? "Couldn't submit. Please try again.");
            setSubmitting(false);
        }
    };

    const price = isMember ? event.memberPrice : event.nonMemberPrice;

    return (
        <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-3xl leading-tight font-medium md:text-4xl">
                        Apply to {event.name}
                    </h1>
                    <Badge>Draft</Badge>
                </div>
                <span className="text-sm text-slate-600" aria-live="polite">
                    {SAVE_LABELS[draft.status]}
                    {draft.status === 'error' && (
                        <button type="button" onClick={draft.retry} className="ml-2 underline">
                            Retry
                        </button>
                    )}
                </span>
            </div>
            <p className="-mt-3 text-slate-700">
                {renderDate(event.startTime, event.endTime)} · Your price {formatPrice(price)}
            </p>

            {draft.status === 'stale' && (
                <div className="glass flex flex-col gap-3 border-amber-300 p-4 md:flex-row md:items-center">
                    <p className="flex-1">
                        These answers were changed in another tab or device. Pick which version to
                        keep.
                    </p>
                    <Button onClick={() => setValues({ ...values, ...draft.takeServerCopy() })}>
                        Use the newer version
                    </Button>
                    <Button onClick={draft.keepMine}>Keep this tab's answers</Button>
                </div>
            )}

            <div className="glass flex flex-col gap-5 p-4 md:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                        <input
                            className={inputClass}
                            value={values.name ?? ''}
                            autoComplete="name"
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </Field>
                    <Field label="Email address" error={errors.email}>
                        <input
                            className={inputClass}
                            type="email"
                            value={values.email ?? ''}
                            autoComplete="email"
                            onChange={(e) => update('email', e.target.value)}
                        />
                    </Field>
                </div>
                <p className="-mt-3 text-xs text-slate-600">
                    Filled in from your PMC profile; changes here apply to this application only.
                </p>
                {questions.map((q) => (
                    <QuestionField
                        key={q.id}
                        question={q}
                        value={values[q.id] ?? ''}
                        file={files[q.id] ?? null}
                        error={errors[q.id]}
                        onChange={(value) => update(q.id, value)}
                        onFile={(file) => {
                            setFiles({ ...files, [q.id]: file });
                            const fileError = file ? checkFile(q, file) : undefined;
                            setErrors((current) =>
                                fileError
                                    ? { ...current, [q.id]: fileError }
                                    : without(current, q.id)
                            );
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
                <span className="text-sm text-slate-600">
                    Once you submit, your answers can't be edited.
                </span>
                <Button type="submit" disabled={submitting} className="w-full md:w-auto md:px-8">
                    {submitting ? 'Submitting…' : 'Submit application'}
                </Button>
            </div>
        </form>
    );
}

function SubmittedAnswers({
    event,
    attendee,
    questions,
}: {
    event: Event;
    attendee: Attendee;
    questions: Question[];
}) {
    const answers = (attendee.eventFormAnswers ?? {}) as Record<string, unknown>;
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl font-medium md:text-4xl">Your application</h1>
                <Badge>Submitted</Badge>
            </div>
            <p>Submitted answers can't be edited. Check the event page for your status.</p>
            <dl className="glass flex flex-col gap-4 p-4 md:p-6">
                {questions.map((q) => (
                    <div key={q.id}>
                        <dt className="text-sm font-semibold">{q.label}</dt>
                        <dd className="whitespace-pre-wrap text-slate-700">
                            {q.type === 'file' ? 'Uploaded' : String(answers[q.id] ?? '—')}
                        </dd>
                    </div>
                ))}
            </dl>
            <ButtonLink to={`/events/${event.eventId}`} className="self-start">
                Back to {event.name}
            </ButtonLink>
        </div>
    );
}
