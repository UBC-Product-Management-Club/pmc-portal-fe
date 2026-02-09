import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTeam } from '../../hooks/useTeam';

type DeliverablesFormData = {
    projectTitle: string;
    figjamLink: string;
    figmaLink: string;
    presentationFile: File | null;
};

type DeliverableResponse = {
    submission: {
        projectTitle: string;
        figjamLink: string;
        figmaLink: string;
        file_links?: string[];
    };
    submitted_at: string;
    submitted_by: string;
    User: {
        first_name: string;
        last_name: string;
    };
};

export const DeliverablesSection = ({ eventId }: { eventId: string }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<DeliverablesFormData>({
        defaultValues: {
            projectTitle: '',
            figjamLink: '',
            figmaLink: '',
            presentationFile: null,
        },
    });

    const { getDeliverable, submitDeliverable } = useTeam();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const presentationFile = watch('presentationFile');
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
    const [submissionMeta, setSubmissionMeta] = useState<{
        submitted_at: string;
        submitted_by: string;
    } | null>(null);

    const onSubmit = async (data: DeliverablesFormData) => {
        console.log('Submitting deliverables:', data);

        const formData = new FormData();
        formData.append('projectTitle', data.projectTitle);
        formData.append('figmaLink', data.figmaLink);
        formData.append('figjamLink', data.figjamLink);
        if (data.presentationFile) {
            formData.append('presentationFile', data.presentationFile);
        }

        try {
            if (!eventId) return;

            const res = await submitDeliverable(eventId, formData);
            console.log('Deliverables submitted successfully:', res);

            const refreshed = (await getDeliverable(eventId)) as DeliverableResponse | null;
            if (refreshed) {
                const firstLink = refreshed.submission.file_links?.[0] ?? null;
                setExistingFileUrl(firstLink);
                setSubmissionMeta({
                    submitted_at: refreshed.submitted_at,
                    submitted_by: `${refreshed.User.first_name} ${refreshed.User.last_name}`,
                });
            }
        } catch (e) {
            console.log('Error submitting deliverables:', e);
        }
    };

    const extractOriginalFileName = (url: string): string => {
        const fullName = url.substring(url.lastIndexOf('/') + 1);
        return fullName.substring(fullName.indexOf('-') + 1);
    };

    useEffect(() => {
        const loadExistingDeliverable = async () => {
            if (!eventId) return;

            try {
                const existing = (await getDeliverable(eventId)) as DeliverableResponse | null;
                if (!existing) return;

                const { submission, submitted_at, User } = existing;
                console.log('Existing deliverable submission:', existing);

                reset({
                    projectTitle: submission.projectTitle ?? '',
                    figmaLink: submission.figmaLink ?? '',
                    figjamLink: submission.figjamLink ?? '',
                    presentationFile: null,
                });

                const firstLink = submission.file_links?.[0] ?? null;
                setExistingFileUrl(firstLink);
                setSubmissionMeta({
                    submitted_at,
                    submitted_by: `${User.first_name} ${User.last_name}`,
                });
            } catch (err) {
                console.log('Error loading existing deliverable:', err);
            }
        };

        loadExistingDeliverable();
    }, [eventId, getDeliverable, reset]);

    const formattedSubmittedAt =
        submissionMeta && new Date(submissionMeta.submitted_at).toLocaleString();
    const layoutClass = 'flex flex-col gap-4';
    const formClass = 'flex flex-1 flex-col gap-5 overflow-y-auto pr-1';
    const itemClass = 'flex flex-col gap-2';
    const actionsClass = 'flex justify-end';
    const labelClass = 'flex items-center gap-1 text-sm font-semibold text-white';
    const requiredClass = 'text-red-500';
    const helperClass = 'text-[0.8rem] text-pmc-light-grey';
    const inputBaseClass =
        'w-full rounded-lg border bg-pmc-dark-blue px-4 py-3 text-sm text-white transition-all placeholder:italic placeholder:opacity-50 focus:outline-none focus:border-pmc-light-blue focus:shadow-[0_0_0_3px_rgba(141,155,235,0.1)]';
    const fileInputClass = 'hidden';
    const fileButtonClass =
        'flex items-center gap-2 rounded-lg border border-dashed border-[rgba(141,155,235,0.5)] bg-[rgba(141,155,235,0.12)] px-4 py-3 text-left text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[rgba(141,155,235,0.2)] hover:shadow-[0_4px_8px_-1px_rgba(141,155,235,0.25)]';
    const fileNameClass = 'mt-1 text-[0.8rem] italic text-pmc-light-grey';
    const existingFileLinkClass = 'ml-1 text-[0.8rem] text-pmc-light-blue underline';
    const errorClass = 'mt-1 text-[0.75rem] text-red-300';
    const submitClass =
        'rounded-full bg-[linear-gradient(135deg,var(--pmc-light-blue)_0%,#6b7bcf_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_6px_-1px_rgba(141,155,235,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_12px_-1px_rgba(141,155,235,0.3)] disabled:cursor-not-allowed disabled:bg-[rgba(141,155,235,0.3)] disabled:shadow-none';
    const submissionInfoClass =
        'inline-flex flex-wrap items-baseline gap-2 rounded-full bg-[rgba(141,155,235,0.12)] px-3 py-2 text-[0.8rem] text-pmc-light-grey';
    const submissionCodeClass =
        'rounded-full bg-[rgba(0,0,0,0.3)] px-1.5 py-0.5 text-[0.8rem] text-[#e5e7eb]';
    const inputClass = (hasError?: boolean) =>
        `${inputBaseClass} ${hasError ? 'border-red-500' : 'border-[rgba(141,155,235,0.3)]'}`;

    return (
        <form className={layoutClass} onSubmit={handleSubmit(onSubmit)}>
            <div className={formClass}>
                {submissionMeta && (
                    <div className={submissionInfoClass}>
                        <span>Last submitted:</span>
                        <strong>{formattedSubmittedAt}</strong>
                        <span>by</span>
                        <code className={submissionCodeClass}>{submissionMeta.submitted_by}</code>
                    </div>
                )}

                <div className={itemClass}>
                    <label className={labelClass} htmlFor="projectTitle">
                        Project Title<span className={requiredClass}>*</span>
                    </label>
                    <p className={helperClass}>Give your heist a memorable, clear name.</p>
                    <input
                        id="projectTitle"
                        type="text"
                        placeholder="e.g. PathFinder"
                        className={inputClass(!!errors.projectTitle)}
                        {...register('projectTitle', {
                            required: 'Project title is required',
                        })}
                    />
                    {errors.projectTitle && (
                        <span className={errorClass}>{errors.projectTitle.message}</span>
                    )}
                </div>

                <div className={itemClass}>
                    <label className={labelClass} htmlFor="figmaLink">
                        Prototype File Link<span className={requiredClass}>*</span>
                    </label>
                    <p className={helperClass}>
                        Link to your main prototype design file (ie. Figma, Lovable, etc).
                    </p>
                    <input
                        id="figmaLink"
                        type="url"
                        placeholder="https://www.figma.com/file/your-file-id/your-file-name"
                        className={inputClass(!!errors.figmaLink)}
                        {...register('figmaLink', {
                            required: 'Figma file link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.figmaLink && (
                        <span className={errorClass}>{errors.figmaLink.message}</span>
                    )}
                </div>

                <div className={itemClass}>
                    <label className={labelClass} htmlFor="figjamLink">
                        FigJam Link<span className={requiredClass}>*</span>
                    </label>
                    <p className={helperClass}>
                        Link to your FigJam board with brainstorming, flows, or planning.
                    </p>
                    <input
                        id="figjamLink"
                        type="url"
                        placeholder="https://www.figma.com/figjam/your-board-id/your-board-name"
                        className={inputClass(!!errors.figjamLink)}
                        {...register('figjamLink', {
                            required: 'FigJam link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.figjamLink && (
                        <span className={errorClass}>{errors.figjamLink.message}</span>
                    )}
                </div>

                <div className={itemClass}>
                    <label className={labelClass} htmlFor="presentationFile">
                        Presentation File (PDF, PPT, etc.)<span className={requiredClass}>*</span>
                    </label>
                    <p className={helperClass}>Upload the deck you’ll present to the judges.</p>

                    <Controller
                        name="presentationFile"
                        control={control}
                        rules={{
                            validate: (file) =>
                                !!file || !!existingFileUrl || 'Presentation file is required',
                        }}
                        render={({ field }) => {
                            const { value, ...restField } = field;
                            console.log(value);

                            const existingFileName = existingFileUrl
                                ? extractOriginalFileName(existingFileUrl)
                                : '';

                            return (
                                <>
                                    <input
                                        {...restField}
                                        ref={fileInputRef}
                                        type="file"
                                        id="presentationFile"
                                        accept=".pdf,.ppt,.pptx"
                                        className={fileInputClass}
                                        onChange={(e) =>
                                            field.onChange(e.target.files?.[0] || null)
                                        }
                                    />

                                    <button
                                        className={fileButtonClass}
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        📎{' '}
                                        {presentationFile
                                            ? 'Change File'
                                            : existingFileUrl
                                              ? 'Replace File'
                                              : 'Choose File'}
                                    </button>

                                    <span className={fileNameClass}>
                                        {presentationFile ? (
                                            <>Selected: {presentationFile.name}</>
                                        ) : existingFileUrl ? (
                                            <>
                                                Previously uploaded:
                                                <a
                                                    className={existingFileLinkClass}
                                                    href={existingFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {existingFileName}
                                                </a>
                                            </>
                                        ) : (
                                            'No file chosen (PDF, PPT, PPTX)'
                                        )}
                                    </span>
                                </>
                            );
                        }}
                    />

                    {errors.presentationFile && (
                        <span className={errorClass}>{errors.presentationFile.message}</span>
                    )}
                </div>
            </div>

            <div className={actionsClass}>
                <button className={submitClass} type="submit">
                    Submit Deliverables
                </button>
            </div>
        </form>
    );
};
