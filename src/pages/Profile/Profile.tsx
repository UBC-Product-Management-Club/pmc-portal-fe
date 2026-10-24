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

type Form = Required<ProfileUpdate>;
type Group = 'name' | 'pronouns' | 'academics';

// Same rules as the onboarding form and the PATCH
function validate(form: Form) {
    const errors: Partial<Record<keyof Form, string>> = {};
    if (!form.first_name.trim()) errors.first_name = 'Please enter a first name.';
    if (!form.last_name.trim()) errors.last_name = 'Please enter a last name.';
    if (!form.pronouns.trim()) errors.pronouns = 'Please enter your pronouns.';
    if (!(years as readonly string[]).includes(form.year)) errors.year = 'Please pick a year.';
    if (!form.major.trim()) errors.major = 'Please enter a major.';
    const why = form.why_pm.trim().length;
    if (why < 1 || why > 300) errors.why_pm = 'Must be 1–300 characters.';
    return errors;
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-[10px] text-slate-700 hover:bg-white/60"
        >
            <MdOutlineEdit className="size-6" aria-hidden />
        </button>
    );
}

function ReadOnlyMark({ why }: { why: string }) {
    return (
        <span title={why} className="flex size-6 items-center justify-center text-slate-500">
            <MdLockOutline className="size-5" aria-label={why} />
        </span>
    );
}

function Pill({ children }: { children: ReactNode }) {
    return <Badge>{children}</Badge>;
}

export function Profile() {
    const { user, isMember, update } = useUserData();
    const { updateProfile } = useUserService();
    const [editing, setEditing] = useState<Group | null>(null);
    const [form, setForm] = useState<Form | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
    const [saving, setSaving] = useState(false);

    const original: Form | null = useMemo(
        () =>
            user
                ? {
                      first_name: user.firstName ?? '',
                      last_name: user.lastName ?? '',
                      pronouns: user.pronouns ?? '',
                      year: user.year ?? '',
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

    const set = (key: keyof Form, value: string) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: undefined });
    };

    // Save Changes sends every edited field in one PATCH
    const changes = Object.fromEntries(
        Object.entries(form)
            .map(([key, value]) => [key, value.trim()])
            .filter(([key, value]) => value !== original[key as keyof Form].trim())
    ) as ProfileUpdate;
    const dirty = Object.keys(changes).length > 0;

    const save = async () => {
        const found = validate(form);
        const relevant = Object.fromEntries(
            Object.entries(found).filter(([key]) => key in changes)
        );
        setErrors(relevant);
        if (Object.keys(relevant).length > 0) return;

        setSaving(true);
        try {
            const saved = await updateProfile(changes);
            update({ type: ActionTypes.LOAD, payload: saved });
            setForm(null);
            setEditing(null);
            showToast('success', 'Profile saved.');
        } catch (error) {
            if (error instanceof ApiError && error.fields) setErrors(error.fields);
            showToast('error', "Couldn't save your profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const field = (key: keyof Form, label: string, children?: ReactNode) => (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{label}</span>
            {children ?? (
                <input
                    className={inputClass}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                />
            )}
            {errors[key] && <span className="text-sm text-red-700">{errors[key]}</span>}
        </label>
    );

    return (
        <div className="flex flex-col gap-12">
            <section className="grid gap-8 rounded-[10px] bg-white/30 p-4 md:grid-cols-5 md:p-8">
                <div className="flex flex-col gap-8 md:col-span-2">
                    <img
                        src={user.pfp}
                        alt=""
                        className="size-[140px] rounded-full bg-[#919191] object-cover"
                    />

                    {editing === 'name' ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {field('first_name', 'First name')}
                            {field('last_name', 'Last name')}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl leading-none font-medium break-words md:text-5xl">
                                {form.first_name} {form.last_name}
                            </h1>
                            <EditButton label="Edit name" onClick={() => setEditing('name')} />
                        </div>
                    )}

                    {editing === 'pronouns' ? (
                        field('pronouns', 'Pronouns')
                    ) : (
                        <div className="flex flex-wrap items-center gap-2">
                            <Pill>{isMember ? 'Member' : 'Non-Member'}</Pill>
                            <Pill>{form.pronouns || 'Add pronouns'}</Pill>
                            <EditButton
                                label="Edit pronouns"
                                onClick={() => setEditing('pronouns')}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl leading-7 font-medium">Email</h2>
                        <div className="portal-tint flex items-center gap-2 rounded-[10px] p-4">
                            <span className="min-w-0 truncate">{user.email}</span>
                            <ReadOnlyMark why="Your login email can't be changed here" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl leading-7 font-medium">Academics</h2>
                        {editing === 'academics' ? (
                            <div className="grid gap-3 sm:grid-cols-2">
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
                                {field('major', 'Major')}
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                {form.year && <Pill>Year {form.year}</Pill>}
                                {form.major && <Pill>{form.major}</Pill>}
                                <EditButton
                                    label="Edit year and major"
                                    onClick={() => setEditing('academics')}
                                />
                            </div>
                        )}
                        {user.university && (
                            <div className="flex flex-wrap items-center gap-2">
                                <Pill>{user.university}</Pill>
                                <ReadOnlyMark why="University sets your membership price, so it can't be changed here" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-3">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="text-xl leading-7 font-medium">Event Passport</h2>
                        <p>Attend events to collect badges in your passport!</p>
                    </div>
                    {/* Badges arrive with the Digital Passport feature; empty until then */}
                    <div className="portal-tint flex flex-1 flex-col gap-6 rounded-[10px] p-6 md:p-8">
                        <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
                            {Array.from({ length: 10 }, (_, i) => (
                                <span
                                    key={i}
                                    className="aspect-square w-full max-w-[100px] justify-self-center rounded-full border-2 border-dashed border-slate-300"
                                />
                            ))}
                        </div>
                        <p className="text-center text-slate-600">No badges yet</p>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-xl leading-7 font-medium">Why Product Management?</h2>
                    <p>Tell us about yourself!</p>
                </div>
                <div className="rounded-[10px] bg-white/30 p-4">
                    <div className="portal-tint flex flex-col gap-2 rounded-[10px] p-4">
                        <textarea
                            className={`${inputClass} min-h-28 bg-transparent`}
                            value={form.why_pm}
                            maxLength={300}
                            aria-label="Why Product Management?"
                            onChange={(e) => set('why_pm', e.target.value)}
                        />
                        <span className="text-right text-xs text-slate-600">
                            {form.why_pm.trim().length} / 300 characters
                        </span>
                        {errors.why_pm && (
                            <span className="text-sm text-red-700">{errors.why_pm}</span>
                        )}
                        <Button onClick={save} disabled={!dirty || saving} className="w-full">
                            {saving ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
