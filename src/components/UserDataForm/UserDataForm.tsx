import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Universities, UserDataFromUser, UserDataFromUserSchema, years } from '../../types/User';
import { showToast, useInAppBrowser } from '../../utils';

type UserDataFormProps = {
    responses: Partial<UserDataFromUser>;
    onSubmit: (data: UserDataFromUser) => void;
    hasWaiver?: boolean;
    buttonText?: string;
};

export function UserDataForm({
    responses,
    onSubmit,
    hasWaiver,
    buttonText = 'Continue',
}: UserDataFormProps) {
    const form = useForm({
        resolver: zodResolver(UserDataFromUserSchema),
    });
    const contentClass = 'flex w-full flex-col justify-evenly gap-4';
    const groupClass = 'flex w-full flex-row items-center gap-3';
    const baseInputClass =
        'min-h-11 rounded-[10px] bg-white px-3 py-2 text-pmc-ink placeholder:text-pmc-mute outline-none focus-visible:border-pmc-accent focus-visible:ring-2 focus-visible:ring-pmc-accent/20';
    const baseTextAreaClass =
        'min-h-28 rounded-[10px] bg-white px-3 py-2 text-pmc-ink placeholder:text-pmc-mute outline-none focus-visible:border-pmc-accent focus-visible:ring-2 focus-visible:ring-pmc-accent/20';
    const submitClass =
        'pmc-btn-gradient ml-auto inline-flex min-h-12 cursor-pointer items-center rounded-full px-7 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
    const waiverClass = 'm-0 flex flex-col gap-2 text-pmc-ink';
    const waiverLinkClass = 'font-medium text-pmc-accent underline underline-offset-2';
    const errorTextClass = 'mt-1 text-sm text-red-700';
    const widthClassMap: Record<number, string> = {
        20: 'w-[20%]',
        40: 'w-[40%]',
        45: 'w-[45%]',
    };
    const inputClass = (hasError: boolean, width?: number) => {
        const widthClass = width ? widthClassMap[width] : 'flex-1';
        const errorClass = hasError ? 'border-2 border-red-600' : 'border border-portal-stroke';
        return `${baseInputClass} ${widthClass} ${errorClass}`;
    };
    const dropdownClass = (hasError: boolean, width?: number) => {
        const widthClass = width ? widthClassMap[width] : 'flex-1';
        const errorClass = hasError ? 'border-2 border-red-600' : 'border border-portal-stroke';
        return `${baseInputClass} ${widthClass} ${errorClass}`;
    };
    const textAreaClass = (hasError: boolean) => {
        const errorClass = hasError ? 'border-2 border-red-600' : 'border border-portal-stroke';
        return `${baseTextAreaClass} ${errorClass}`;
    };

    const university = form.watch('university');

    const isStudent: boolean = university && university !== Universities[4];
    const isUbcStudent: boolean = isStudent && university === Universities[0];
    const { isInAppBrowser, isMobile } = useInAppBrowser();

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

    if (isMobile || isInAppBrowser) {
        return (
            <form
                autoComplete="off"
                onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
                data-testid="mobile-form"
            >
                <div className={contentClass}>
                    <input
                        placeholder="First name"
                        aria-label="First name"
                        defaultValue={responses.firstName}
                        required
                        {...form.register('firstName')}
                        className={inputClass(!!form.formState.errors.firstName)}
                    />
                    {form.formState.errors.firstName && (
                        <span className={errorTextClass}>
                            {form.formState.errors.firstName.message as string}
                        </span>
                    )}
                    <input
                        placeholder="Last name"
                        aria-label="Last name"
                        defaultValue={responses.lastName}
                        required
                        {...form.register('lastName')}
                        className={inputClass(!!form.formState.errors.lastName)}
                    />
                    {form.formState.errors.lastName && (
                        <span className={errorTextClass}>
                            {form.formState.errors.lastName.message as string}
                        </span>
                    )}
                    <input
                        placeholder="Pronouns"
                        aria-label="Pronouns"
                        defaultValue={responses.pronouns}
                        required
                        {...form.register('pronouns')}
                        className={inputClass(!!form.formState.errors.pronouns)}
                    />
                    {form.formState.errors.pronouns && (
                        <span className={errorTextClass}>
                            {form.formState.errors.pronouns.message as string}
                        </span>
                    )}
                    <select
                        data-testid="university-dropdown"
                        aria-label="What university do you go to?"
                        required
                        {...form.register('university', { required: 'please select a value' })}
                        defaultValue={responses.university}
                        className={dropdownClass(!!form.formState.errors.university)}
                    >
                        <option value="" hidden>
                            What university do you go to?
                        </option>
                        {Universities.map((uni) => {
                            return (
                                <option value={uni} key={uni}>
                                    {uni}
                                </option>
                            );
                        })}
                    </select>
                    {form.formState.errors.university && (
                        <span className={errorTextClass}>
                            {form.formState.errors.university.message as string}
                        </span>
                    )}
                    {isUbcStudent && (
                        <>
                            <input
                                placeholder="Student ID"
                                aria-label="Student ID"
                                defaultValue={responses.studentId}
                                required
                                {...form.register('studentId')}
                                className={inputClass(!!form.formState.errors.studentId)}
                            />
                            {form.formState.errors.studentId && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.studentId.message as string}
                                </span>
                            )}
                        </>
                    )}
                    {isStudent && (
                        <>
                            <input
                                placeholder="Faculty"
                                aria-label="Faculty"
                                defaultValue={responses.faculty}
                                required
                                {...form.register('faculty')}
                                className={inputClass(!!form.formState.errors.faculty)}
                            />
                            {form.formState.errors.faculty && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.faculty.message as string}
                                </span>
                            )}
                            <input
                                placeholder="Major"
                                aria-label="Major"
                                defaultValue={responses.major}
                                required
                                {...form.register('major')}
                                className={inputClass(!!form.formState.errors.major)}
                            />
                            {form.formState.errors.major && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.major.message as string}
                                </span>
                            )}
                            <select
                                data-testid="year-dropdown"
                                aria-label="Year"
                                defaultValue={responses.year}
                                required
                                {...form.register('year')}
                                className={dropdownClass(!!form.formState.errors.year)}
                            >
                                <option value="" hidden>
                                    Year
                                </option>
                                {years.map((year) => {
                                    return (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            {form.formState.errors.year && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.year.message as string}
                                </span>
                            )}
                        </>
                    )}
                    <textarea
                        placeholder="Why Product Management?"
                        aria-label="Why Product Management?"
                        defaultValue={responses.whyPm}
                        rows={5}
                        required
                        {...form.register('whyPm')}
                        className={textAreaClass(!!form.formState.errors.whyPm)}
                    />
                    {form.formState.errors.whyPm && (
                        <span className={errorTextClass}>
                            {form.formState.errors.whyPm.message as string}
                        </span>
                    )}

                    {hasWaiver && isUbcStudent && (
                        <div className={waiverClass}>
                            <div>
                                Please sign the following form:
                                <a
                                    className={waiverLinkClass}
                                    href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {' '}
                                    Insurance/Liability Waiver.
                                </a>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="size-4 accent-pmc-accent"
                                />
                                I have signed the Insurance/Liability Waiver form.
                            </label>
                        </div>
                    )}

                    <button className={submitClass} type="submit">
                        {buttonText}
                    </button>
                </div>
            </form>
        );
    } else {
        return (
            <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit, handleInvalid)}>
                <div className={contentClass}>
                    <div className={groupClass}>
                        <input
                            placeholder="First name"
                            aria-label="First name"
                            defaultValue={responses.firstName}
                            width={40}
                            required
                            {...form.register('firstName')}
                            className={inputClass(!!form.formState.errors.firstName, 40)}
                        />
                        {form.formState.errors.firstName && (
                            <span className={errorTextClass}>
                                {form.formState.errors.firstName.message as string}
                            </span>
                        )}
                        <input
                            placeholder="Last name"
                            aria-label="Last name"
                            defaultValue={responses.lastName}
                            width={40}
                            required
                            {...form.register('lastName')}
                            className={inputClass(!!form.formState.errors.lastName, 40)}
                        />
                        {form.formState.errors.lastName && (
                            <span className={errorTextClass}>
                                {form.formState.errors.lastName.message as string}
                            </span>
                        )}
                        <input
                            placeholder="Pronouns"
                            aria-label="Pronouns"
                            defaultValue={responses.pronouns}
                            width={20}
                            required
                            {...form.register('pronouns')}
                            className={inputClass(!!form.formState.errors.pronouns, 20)}
                        />
                        {form.formState.errors.pronouns && (
                            <span className={errorTextClass}>
                                {form.formState.errors.pronouns.message as string}
                            </span>
                        )}
                    </div>

                    <select
                        data-testid="university-dropdown"
                        aria-label="What university do you go to?"
                        required
                        {...form.register('university', { required: 'please select a value' })}
                        defaultValue={responses.university}
                        className={dropdownClass(!!form.formState.errors.university)}
                    >
                        <option value="" hidden>
                            What university do you go to?
                        </option>
                        {Universities.map((uni) => {
                            return (
                                <option value={uni} key={uni}>
                                    {uni}
                                </option>
                            );
                        })}
                    </select>
                    {form.formState.errors.university && (
                        <span className={errorTextClass}>
                            {form.formState.errors.university.message as string}
                        </span>
                    )}

                    {isUbcStudent && (
                        <div className={groupClass}>
                            <input
                                placeholder="Student ID"
                                aria-label="Student ID"
                                defaultValue={responses.studentId}
                                required
                                {...form.register('studentId')}
                                className={inputClass(!!form.formState.errors.studentId)}
                            />
                            {form.formState.errors.studentId && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.studentId.message as string}
                                </span>
                            )}
                        </div>
                    )}

                    {isStudent && (
                        <div className={groupClass}>
                            <input
                                placeholder="Faculty"
                                aria-label="Faculty"
                                defaultValue={responses.faculty}
                                width={45}
                                required
                                {...form.register('faculty')}
                                className={inputClass(!!form.formState.errors.faculty, 45)}
                            />
                            {form.formState.errors.faculty && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.faculty.message as string}
                                </span>
                            )}
                            <input
                                placeholder="Major"
                                aria-label="Major"
                                defaultValue={responses.major}
                                width={45}
                                required
                                {...form.register('major')}
                                className={inputClass(!!form.formState.errors.major, 45)}
                            />
                            {form.formState.errors.major && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.major.message as string}
                                </span>
                            )}
                            <select
                                data-testid="year-dropdown"
                                aria-label="Year"
                                defaultValue={responses.year}
                                required
                                {...form.register('year')}
                                className={dropdownClass(!!form.formState.errors.year)}
                            >
                                <option value="" hidden>
                                    Year
                                </option>
                                {years.map((year) => {
                                    return (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            {form.formState.errors.year && (
                                <span className={errorTextClass}>
                                    {form.formState.errors.year.message as string}
                                </span>
                            )}
                        </div>
                    )}

                    <textarea
                        placeholder="Why Product Management?"
                        aria-label="Why Product Management?"
                        defaultValue={responses.whyPm}
                        rows={5}
                        required
                        {...form.register('whyPm')}
                        className={textAreaClass(!!form.formState.errors.whyPm)}
                    />
                    {form.formState.errors.whyPm && (
                        <span className={errorTextClass}>
                            {form.formState.errors.whyPm.message as string}
                        </span>
                    )}

                    {hasWaiver && isUbcStudent && (
                        <div className={waiverClass}>
                            <div>
                                Please sign the following form:
                                <a
                                    className={waiverLinkClass}
                                    href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {' '}
                                    Insurance/Liability Waiver.
                                </a>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="size-4 accent-pmc-accent"
                                />
                                I have signed the Insurance/Liability Waiver form.
                            </label>
                        </div>
                    )}

                    <button className={submitClass} type="submit">
                        {buttonText}
                    </button>
                </div>
            </form>
        );
    }
}
