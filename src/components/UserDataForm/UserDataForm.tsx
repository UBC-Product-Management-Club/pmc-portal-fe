import { Control, FieldValues, Path, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect } from 'react';
import { MdArrowForward, MdOutlineVerifiedUser } from 'react-icons/md';
import { Universities, UserDataFromUser, UserDataFromUserSchema, years } from '../../types/User';
import { showToast, useInAppBrowser } from '../../utils';

type UserDataFormProps = {
    responses: Partial<UserDataFromUser>;
    onSubmit: (data: UserDataFromUser) => void;
    hasWaiver?: boolean;
    buttonText?: string;
};

const WHY_PM_MAX = 300;

// Its own component so typing only re-renders the counter, not the whole form
function WhyPmCounter<T extends FieldValues>({
    control,
    initial,
}: {
    control: Control<T>;
    initial?: string;
}) {
    const value = useWatch({ control, name: 'whyPm' as Path<T> }) as string | undefined;
    const length = (value ?? initial ?? '').length;
    return (
        <span
            id="why-pm-count"
            className={`pointer-events-none absolute right-3 bottom-2.5 flex gap-4 text-sm ${
                length >= WHY_PM_MAX ? 'font-medium text-red-700' : 'text-pmc-mute'
            }`}
        >
            <span>Max {WHY_PM_MAX} characters</span>
            <span>
                {length} / {WHY_PM_MAX}
            </span>
        </span>
    );
}

export function UserDataForm({
    responses,
    onSubmit,
    hasWaiver,
    buttonText = 'Continue',
}: UserDataFormProps) {
    const form = useForm({
        resolver: zodResolver(UserDataFromUserSchema),
    });
    const contentClass = 'flex w-full flex-col gap-5';
    const groupClass = 'flex w-full flex-row items-start gap-4';
    const baseInputClass =
        'min-h-11 w-full rounded-[10px] bg-white px-3 py-2 text-pmc-ink placeholder:text-pmc-mute outline-none focus-visible:border-pmc-accent focus-visible:ring-2 focus-visible:ring-pmc-accent/20';
    const baseTextAreaClass =
        'min-h-32 w-full rounded-[10px] bg-white px-3 pt-2 pb-9 text-pmc-ink placeholder:text-pmc-mute outline-none focus-visible:border-pmc-accent focus-visible:ring-2 focus-visible:ring-pmc-accent/20';
    const labelClass = 'mb-1.5 text-sm font-medium text-pmc-ink';
    const pillClass =
        'inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-7 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
    const submitClass = `${pillClass} pmc-btn-gradient ml-auto text-white`;
    const waiverLinkClass = 'font-medium text-pmc-accent underline underline-offset-2';
    const errorTextClass = 'mt-1 text-sm text-red-700';
    const widthClassMap: Record<number, string> = {
        30: 'w-[30%]',
        35: 'w-[35%]',
    };
    const borderClass = (hasError: boolean) =>
        hasError ? 'border-2 border-red-600' : 'border border-portal-stroke';
    const inputClass = (hasError: boolean) => `${baseInputClass} ${borderClass(hasError)}`;
    const textAreaClass = (hasError: boolean) => `${baseTextAreaClass} ${borderClass(hasError)}`;

    const university = form.watch('university');

    const isStudent: boolean = university && university !== Universities[4];
    const isUbcStudent: boolean = isStudent && university === Universities[0];
    const { isInAppBrowser, isMobile } = useInAppBrowser();
    const stacked = isMobile || isInAppBrowser;

    useEffect(() => {
        // if not a ubc student
        if (university !== Universities[0]) {
            form.unregister('studentId');
        }
        // if not a student
        if (university === Universities[4]) {
            form.unregister('faculty');
            form.unregister('year');
            form.unregister('major');
        }
    }, [form, university]);

    const handleInvalid = () => {
        showToast('error', 'Please fix the highlighted fields.');
    };

    const errors = form.formState.errors;
    const message = (key: keyof UserDataFromUser) => errors[key]?.message as string | undefined;

    // A labelled field: the label with a red * (every field here is required), the control
    // and its error. width is its share of a row, 'fill' takes what's left of the row, and
    // leaving it out makes it full width.
    const field = (
        id: string,
        label: string,
        control: ReactNode,
        { error, width }: { error?: string; width?: number | 'fill' } = {}
    ) => (
        <div
            className={`flex flex-col ${
                typeof width === 'number'
                    ? widthClassMap[width]
                    : width === 'fill'
                      ? 'flex-1'
                      : 'w-full'
            }`}
        >
            <label htmlFor={id} className={labelClass}>
                {label}
                <span className="ml-1 text-red-600" aria-hidden>
                    *
                </span>
            </label>
            {control}
            {error && <span className={errorTextClass}>{error}</span>}
        </div>
    );

    const firstName = field(
        'signup-first-name',
        'First name',
        <input
            id="signup-first-name"
            placeholder="Enter your first name"
            defaultValue={responses.firstName}
            required
            {...form.register('firstName')}
            className={inputClass(!!errors.firstName)}
        />,
        { error: message('firstName'), width: stacked ? undefined : 35 }
    );
    const lastName = field(
        'signup-last-name',
        'Last name',
        <input
            id="signup-last-name"
            placeholder="Enter your last name"
            defaultValue={responses.lastName}
            required
            {...form.register('lastName')}
            className={inputClass(!!errors.lastName)}
        />,
        { error: message('lastName'), width: stacked ? undefined : 35 }
    );
    const pronouns = field(
        'signup-pronouns',
        'Pronouns',
        <input
            id="signup-pronouns"
            placeholder="e.g. she/her"
            defaultValue={responses.pronouns}
            required
            {...form.register('pronouns')}
            className={inputClass(!!errors.pronouns)}
        />,
        { error: message('pronouns'), width: stacked ? undefined : 30 }
    );
    const universityField = field(
        'signup-university',
        'University',
        <select
            id="signup-university"
            data-testid="university-dropdown"
            required
            {...form.register('university', { required: 'please select a value' })}
            defaultValue={responses.university ?? ''}
            className={inputClass(!!errors.university)}
        >
            <option value="" disabled hidden>
                Select your university
            </option>
            {Universities.map((uni) => {
                return (
                    <option value={uni} key={uni}>
                        {uni}
                    </option>
                );
            })}
        </select>,
        { error: message('university') }
    );
    const studentId = field(
        'signup-student-id',
        'Student ID',
        <input
            id="signup-student-id"
            placeholder="Enter your student ID"
            inputMode="numeric"
            defaultValue={responses.studentId}
            required
            {...form.register('studentId')}
            className={inputClass(!!errors.studentId)}
        />,
        { error: message('studentId') }
    );
    const faculty = field(
        'signup-faculty',
        'Faculty',
        <input
            id="signup-faculty"
            placeholder="Enter your faculty"
            defaultValue={responses.faculty}
            required
            {...form.register('faculty')}
            className={inputClass(!!errors.faculty)}
        />,
        { error: message('faculty'), width: stacked ? undefined : 35 }
    );
    const major = field(
        'signup-major',
        'Major',
        <input
            id="signup-major"
            placeholder="Enter your major"
            defaultValue={responses.major}
            required
            {...form.register('major')}
            className={inputClass(!!errors.major)}
        />,
        { error: message('major'), width: stacked ? undefined : 35 }
    );
    const year = field(
        'signup-year',
        'Year',
        <select
            id="signup-year"
            data-testid="year-dropdown"
            defaultValue={responses.year ?? ''}
            required
            {...form.register('year')}
            className={inputClass(!!errors.year)}
        >
            <option value="" disabled hidden>
                Select year
            </option>
            {years.map((year) => {
                return (
                    <option value={year} key={year}>
                        {year}
                    </option>
                );
            })}
        </select>,
        { error: message('year'), width: stacked ? undefined : 'fill' }
    );
    const whyPm = field(
        'signup-why-pm',
        'Why Product Management?',
        <div className="relative flex">
            <textarea
                id="signup-why-pm"
                placeholder="Share what excites you about product management"
                aria-describedby="why-pm-count"
                defaultValue={responses.whyPm}
                rows={4}
                maxLength={WHY_PM_MAX}
                required
                {...form.register('whyPm')}
                className={textAreaClass(!!errors.whyPm)}
            />
            <WhyPmCounter control={form.control} initial={responses.whyPm} />
        </div>,
        { error: message('whyPm') }
    );
    const waiver = hasWaiver && isUbcStudent && (
        <div className="flex items-center gap-4 rounded-[12px] border border-portal-stroke bg-white/70 p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-portal-badge text-pmc-accent">
                <MdOutlineVerifiedUser className="size-7" aria-hidden />
            </span>
            <div className="flex flex-col gap-2 text-pmc-ink">
                <div>
                    Please sign the following form:{' '}
                    <a
                        className={waiverLinkClass}
                        href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Insurance/Liability Waiver
                    </a>
                    .
                </div>
                <label className="flex cursor-pointer items-start gap-2">
                    <input
                        type="checkbox"
                        required
                        className="mt-1 size-4 shrink-0 accent-pmc-accent"
                    />
                    <span>
                        I have signed the Insurance/Liability Waiver form.
                        <span className="ml-1 text-red-600" aria-hidden>
                            *
                        </span>
                    </span>
                </label>
            </div>
        </div>
    );
    const actions = (
        <div className="mt-1 flex items-center">
            <button className={submitClass} type="submit">
                {buttonText}
                <MdArrowForward aria-hidden />
            </button>
        </div>
    );

    return (
        <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
            data-testid={stacked ? 'mobile-form' : undefined}
        >
            <div className={contentClass}>
                {stacked ? (
                    <>
                        {firstName}
                        {lastName}
                        {pronouns}
                    </>
                ) : (
                    <div className={groupClass}>
                        {firstName}
                        {lastName}
                        {pronouns}
                    </div>
                )}
                {universityField}
                {isUbcStudent && studentId}
                {isStudent &&
                    (stacked ? (
                        <>
                            {faculty}
                            {major}
                            {year}
                        </>
                    ) : (
                        <div className={groupClass}>
                            {faculty}
                            {major}
                            {year}
                        </div>
                    ))}
                {whyPm}
                {waiver}
                {actions}
            </div>
        </form>
    );
}
