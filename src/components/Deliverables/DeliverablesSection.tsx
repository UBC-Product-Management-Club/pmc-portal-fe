import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useTeam } from '../../hooks/useTeam';

const DeliverablesLayout = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const DeliverablesForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    flex: 1;
    overflow-y: auto;
    padding-right: 0.25rem;
`;

const DeliverableItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ActionsRow = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const RequiredMark = styled.span`
    color: #ef4444;
`;

const HelperText = styled.p`
    font-size: 0.8rem;
    color: var(--pmc-light-grey);
    margin: 0;
`;

const TextInput = styled.input<{ $hasError?: boolean }>`
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid ${(props) => (props.$hasError ? '#ef4444' : 'rgba(141, 155, 235, 0.3)')};
    background-color: var(--pmc-dark-blue);
    color: #ffffff;
    font-size: 0.875rem;
    box-sizing: border-box;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: var(--pmc-light-blue);
        box-shadow: 0 0 0 3px rgba(141, 155, 235, 0.1);
    }

    &::placeholder {
        font-style: italic;
        opacity: 0.5;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const FileUploadButton = styled.button`
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background: rgba(141, 155, 235, 0.12);
    color: #ffffff;
    cursor: pointer;
    font-weight: 500;
    border: 1px dashed rgba(141, 155, 235, 0.5);
    font-size: 0.875rem;
    transition: all 0.2s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background: rgba(141, 155, 235, 0.2);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px -1px rgba(141, 155, 235, 0.25);
    }
`;

const FileNameText = styled.span`
    font-size: 0.8rem;
    color: var(--pmc-light-grey);
    font-style: italic;
    margin-top: 0.25rem;
`;

const ExistingFileLink = styled.a`
    font-size: 0.8rem;
    color: var(--pmc-light-blue);
    margin-left: 0.25rem;
    text-decoration: underline;
`;

const FieldError = styled.span`
    font-size: 0.75rem;
    color: #fca5a5;
    margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, var(--pmc-light-blue) 0%, #6b7bcf 100%);
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(141, 155, 235, 0.2);

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 12px -1px rgba(141, 155, 235, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: rgba(141, 155, 235, 0.3);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const SubmissionInfo = styled.div`
    font-size: 0.8rem;
    color: var(--pmc-light-grey);
    padding: 0.5rem 0.75rem;
    border-radius: 999px;
    background: rgba(141, 155, 235, 0.12);
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    flex-wrap: wrap;

    code {
        font-family: inherit;
        font-size: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.1rem 0.35rem;
        border-radius: 999px;
        color: #e5e7eb;
    }
`;

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

    return (
        <DeliverablesLayout onSubmit={handleSubmit(onSubmit)}>
            <DeliverablesForm>
                {submissionMeta && (
                    <SubmissionInfo>
                        <span>Last submitted:</span>
                        <strong>{formattedSubmittedAt}</strong>
                        <span>by</span>
                        <code>{submissionMeta.submitted_by}</code>
                    </SubmissionInfo>
                )}

                <DeliverableItem>
                    <Label htmlFor="projectTitle">
                        Project Title<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>Give your heist a memorable, clear name.</HelperText>
                    <TextInput
                        id="projectTitle"
                        type="text"
                        placeholder="e.g. PathFinder"
                        $hasError={!!errors.projectTitle}
                        {...register('projectTitle', {
                            required: 'Project title is required',
                        })}
                    />
                    {errors.projectTitle && <FieldError>{errors.projectTitle.message}</FieldError>}
                </DeliverableItem>

                <DeliverableItem>
                    <Label htmlFor="figmaLink">
                        Prototype File Link<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>
                        Link to your main prototype design file (ie. Figma, Lovable, etc).
                    </HelperText>
                    <TextInput
                        id="figmaLink"
                        type="url"
                        placeholder="https://www.figma.com/file/your-file-id/your-file-name"
                        $hasError={!!errors.figmaLink}
                        {...register('figmaLink', {
                            required: 'Figma file link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.figmaLink && <FieldError>{errors.figmaLink.message}</FieldError>}
                </DeliverableItem>

                <DeliverableItem>
                    <Label htmlFor="figjamLink">
                        FigJam Link<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>
                        Link to your FigJam board with brainstorming, flows, or planning.
                    </HelperText>
                    <TextInput
                        id="figjamLink"
                        type="url"
                        placeholder="https://www.figma.com/figjam/your-board-id/your-board-name"
                        $hasError={!!errors.figjamLink}
                        {...register('figjamLink', {
                            required: 'FigJam link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.figjamLink && <FieldError>{errors.figjamLink.message}</FieldError>}
                </DeliverableItem>

                <DeliverableItem>
                    <Label htmlFor="presentationFile">
                        Presentation File (PDF, PPT, etc.)<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>Upload the deck you’ll present to the judges.</HelperText>

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
                                    <HiddenFileInput
                                        {...restField}
                                        ref={fileInputRef}
                                        type="file"
                                        id="presentationFile"
                                        accept=".pdf,.ppt,.pptx"
                                        onChange={(e) =>
                                            field.onChange(e.target.files?.[0] || null)
                                        }
                                    />

                                    <FileUploadButton
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        📎{' '}
                                        {presentationFile
                                            ? 'Change File'
                                            : existingFileUrl
                                              ? 'Replace File'
                                              : 'Choose File'}
                                    </FileUploadButton>

                                    <FileNameText>
                                        {presentationFile ? (
                                            <>Selected: {presentationFile.name}</>
                                        ) : existingFileUrl ? (
                                            <>
                                                Previously uploaded:
                                                <ExistingFileLink
                                                    href={existingFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {existingFileName}
                                                </ExistingFileLink>
                                            </>
                                        ) : (
                                            'No file chosen (PDF, PPT, PPTX)'
                                        )}
                                    </FileNameText>
                                </>
                            );
                        }}
                    />

                    {errors.presentationFile && (
                        <FieldError>{errors.presentationFile.message}</FieldError>
                    )}
                </DeliverableItem>
            </DeliverablesForm>

            <ActionsRow>
                <SubmitButton type="submit">Submit Deliverables</SubmitButton>
            </ActionsRow>
        </DeliverablesLayout>
    );
};
