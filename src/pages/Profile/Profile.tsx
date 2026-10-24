import { ReactNode, useEffect, useMemo, useState } from 'react';
import { MdLockOutline, MdOutlineEdit } from 'react-icons/md';
import { useUserService } from '../../hooks/useUserService';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';
import { ApiError } from '../../service/RestClient';
import { ProfileUpdate } from '../../service/UserService';
import { years } from '../../types/User';
import { showToast } from '../../utils';
import { Badge } from '../../components/Portal/Badge';
import { Button } from '../../components/Portal/Button';
import { inputClass } from '../../components/Event/applicationRules';
import Geary from '../../assets/geary normal.png';

type Form = Required<ProfileUpdate>;
type Key = keyof Form;

// Each card saves only its own fields
const DETAIL_KEYS: Key[] = ['first_name', 'last_name', 'pronouns', 'year', 'faculty', 'major'];
const WHY_KEYS: Key[] = ['why_pm'];

// Same rules as the onboarding form and the PATCH
function validate(form: Form) {
    const errors: Partial<Record<Key, string>> = {};
    if (!form.first_name.trim()) errors.first_name = 'Please enter a first name.';
    if (!form.last_name.trim()) errors.last_name = 'Please enter a last name.';
    if (!form.pronouns.trim()) errors.pronouns = 'Please enter your pronouns.';
    if (!(years as readonly string[]).includes(form.year)) errors.year = 'Please pick a year.';
    if (!form.faculty.trim()) errors.faculty = 'Please enter a faculty.';
    if (!form.major.trim()) errors.major = 'Please enter a major.';
    const why = form.why_pm.trim().length;
    if (why < 1 || why > 300) errors.why_pm = 'Must be 1–300 characters.';
    return errors;
}

// A value that can't be edited here says why in words, not only with an icon
function Locked({ children, why }: { children: ReactNode; why: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 rounded-[10px] bg-white/60 px-4 py-3">
                <span className="min-w-0 flex-1 truncate">{children}</span>
                <MdLockOutline className="size-5 shrink-0 text-slate-500" aria-hidden />
            </div>
            <span className="text-xs text-slate-600">{why}</span>
        </div>
    );
}

export function Profile() {
    const { user, isMember, update } = useUserData();
    const { updateProfile } = useUserService();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Form | null>(null);
    const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
    const [saving, setSaving] = useState<'details' | 'why' | null>(null);

    const original: Form | null = useMemo(
        () =>
            user
                ? {
                      first_name: user.firstName ?? '',
                      last_name: user.lastName ?? '',
                      pronouns: user.pronouns ?? '',
                      year: user.year ?? '',
                      faculty: user.faculty ?? '',
                      major: user.major ?? '',
                      why_pm: user.whyPm ?? '',
                  }
                : null,
        [user]
    );

    useEffect(() => {
        if (original && !form) setForm(original);
    }, [original, form]);

    if (!user || !form || !original) return <p className="text-center">Loading…</p>;

    const set = (key: Key, value: string) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: undefined });
    };

    const changesIn = (keys: Key[]) =>
        Object.fromEntries(
            keys
                .map((key) => [key, form[key].trim()])
                .filter(([key, value]) => value !== original[key as Key].trim())
        ) as ProfileUpdate;

    // Sends one PATCH with only the changed fields of that card
    const save = async (card: 'details' | 'why') => {
        const keys = card === 'details' ? DETAIL_KEYS : WHY_KEYS;
        const changes = changesIn(keys);
        if (Object.keys(changes).length === 0) {
            if (card === 'details') setEditing(false);
            return;
        }
        const found = validate(form);
        const relevant = Object.fromEntries(
            Object.entries(found).filter(([key]) => key in changes)
        );
        setErrors(relevant);
        if (Object.keys(relevant).length > 0) return;

        setSaving(card);
        try {
            const saved = await updateProfile(changes);
            update({ type: ActionTypes.LOAD, payload: saved });
            // Keep unsaved edits in the other card
            setForm({ ...form, ...changes });
            if (card === 'details') setEditing(false);
            showToast('success', 'Profile saved.');
        } catch (error) {
            if (error instanceof ApiError && error.fields) setErrors(error.fields);
            showToast('error', "Couldn't save your profile. Please try again.");
        } finally {
            setSaving(null);
        }
    };

    const cancel = () => {
        setForm({ ...form, ...Object.fromEntries(DETAIL_KEYS.map((key) => [key, original[key]])) });
        setErrors({});
        setEditing(false);
    };

    const field = (key: Key, label: string, children?: ReactNode) => (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{label}</span>
            {children ?? (
                <input
                    className={`${inputClass} ${errors[key] ? 'border-red-500' : ''}`}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                />
            )}
            {errors[key] && <span className="text-sm text-red-700">{errors[key]}</span>}
        </label>
    );

    const whyDirty = Object.keys(changesIn(WHY_KEYS)).length > 0;

    return (
        <div className="flex flex-col gap-12">
            <section className="glass grid gap-8 p-4 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <img
                            src={Geary}
                            alt=""
                            className="size-28 rounded-full bg-white object-cover md:size-[140px]"
                        />
                        {!editing && (
                            <Button onClick={() => setEditing(true)} className="gap-2">
                                <MdOutlineEdit className="size-5" aria-hidden />
                                Edit details
                            </Button>
                        )}
                    </div>

                    {editing ? (
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {field('first_name', 'First name')}
                                {field('last_name', 'Last name')}
                                {field('pronouns', 'Pronouns')}
                                {field(
                                    'year',
                                    'Year',
                                    <select
                                        className={inputClass}
                                        value={form.year}
                                        onChange={(e) => set('year', e.target.value)}
                                    >
                                        <option value="">Select…</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                Year {year}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {field('faculty', 'Faculty')}
                                {field('major', 'Major')}
                            </div>
                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button onClick={cancel} disabled={saving !== null}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => save('details')}
                                    disabled={saving !== null}
                                >
                                    {saving === 'details' ? 'Saving…' : 'Save changes'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl leading-tight font-medium break-words">
                                {form.first_name} {form.last_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone={isMember ? 'good' : 'neutral'}>
                                    {isMember ? 'Member' : 'Non-Member'}
                                </Badge>
                                {form.pronouns && <Badge>{form.pronouns}</Badge>}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl leading-7 font-medium">Email</h2>
                        <Locked why="You sign in with this, so it can't be changed here.">
                            {user.email}
                        </Locked>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl leading-7 font-medium">Academics</h2>
                        {!editing && (
                            <div className="flex flex-wrap items-center gap-2">
                                {form.year && <Badge>Year {form.year}</Badge>}
                                {form.faculty && <Badge>{form.faculty}</Badge>}
                                {form.major && <Badge>{form.major}</Badge>}
                            </div>
                        )}
                        {user.university && (
                            <Locked why="Your university sets your membership price, so it can't be changed here.">
                                {user.university}
                            </Locked>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="text-xl leading-7 font-medium">Event Passport</h2>
                        <p className="text-slate-600">Attend events to collect badges!</p>
                    </div>
                    {/* Badges arrive with the Digital Passport feature; empty until then */}
                    <div className="flex flex-1 flex-col justify-center gap-6 rounded-[10px] bg-white/60 p-6 md:p-8">
                        <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
                            {Array.from({ length: 10 }, (_, i) => (
                                <span
                                    key={i}
                                    className="aspect-square w-full max-w-[90px] justify-self-center rounded-full border-2 border-dashed border-slate-300"
                                />
                            ))}
                        </div>
                        <p className="text-center text-slate-600">
                            No badges yet. Your first one arrives after your first event.
                        </p>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-xl leading-7 font-medium">Why Product Management?</h2>
                    <p className="text-slate-600">Tell us about yourself!</p>
                </div>
                <div className="glass flex flex-col gap-2 p-4">
                    <textarea
                        className={`${inputClass} min-h-28 ${errors.why_pm ? 'border-red-500' : ''}`}
                        value={form.why_pm}
                        maxLength={300}
                        aria-label="Why Product Management?"
                        onChange={(e) => set('why_pm', e.target.value)}
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-slate-600">
                            {form.why_pm.trim().length} / 300 characters
                            {whyDirty && ' · Unsaved changes'}
                        </span>
                        <Button
                            variant="primary"
                            onClick={() => save('why')}
                            disabled={!whyDirty || saving !== null}
                            className="sm:px-8"
                        >
                            {saving === 'why' ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                    {errors.why_pm && <span className="text-sm text-red-700">{errors.why_pm}</span>}
                </div>
            </section>
        </div>
    );
}
