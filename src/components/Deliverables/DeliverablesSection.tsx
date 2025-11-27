import { useForm, Controller } from 'react-hook-form';
import { useRef } from 'react';
import { useTeam } from '../../hooks/useTeam';
import styled from 'styled-components';

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
        color: var(--pmc-light-grey);
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

type DeliverablesFormData = {
    projectTitle: string;
    githubLink: string;
    demoLink: string;
    presentationFile: File | null;
};

export const DeliverablesSection = ({ eventId }: { eventId: string }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<DeliverablesFormData>({
        defaultValues: {
            projectTitle: '',
            githubLink: '',
            demoLink: '',
            presentationFile: null,
        },
    });

    const teamService = useTeam();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const presentationFile = watch('presentationFile');

    const onSubmit = async (data: DeliverablesFormData) => {
        console.log('Submitting deliverables:', data);

        const formData = new FormData();
        formData.append('projectTitle', data.projectTitle);
        formData.append('figmaLink', data.githubLink);
        formData.append('figjamLink', data.demoLink);
        if (data.presentationFile) {
            formData.append('presentationFile', data.presentationFile);
        }

        try {
            if (!eventId) return;

            const data = await teamService.submitDeliverable(eventId, formData);
            console.log('Deliverables submitted successfully:', data);
        } catch (e) {
            console.log('Error submitting deliverables:', e);
        }
    };

    return (
        <DeliverablesLayout onSubmit={handleSubmit(onSubmit)}>
            <DeliverablesForm>
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
                    <Label htmlFor="githubLink">
                        Figma File Link<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>
                        Link to your main Figma design file (final mockups / UI screens).
                    </HelperText>
                    <TextInput
                        id="githubLink"
                        type="url"
                        placeholder="https://www.figma.com/file/your-file-id/your-file-name"
                        $hasError={!!errors.githubLink}
                        {...register('githubLink', {
                            required: 'Figma file link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.githubLink && <FieldError>{errors.githubLink.message}</FieldError>}
                </DeliverableItem>

                <DeliverableItem>
                    <Label htmlFor="demoLink">
                        FigJam Link<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>
                        Link to your FigJam board with brainstorming, flows, or planning.
                    </HelperText>
                    <TextInput
                        id="demoLink"
                        type="url"
                        placeholder="https://www.figma.com/figjam/your-board-id/your-board-name"
                        $hasError={!!errors.demoLink}
                        {...register('demoLink', {
                            required: 'FigJam link is required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL',
                            },
                        })}
                    />
                    {errors.demoLink && <FieldError>{errors.demoLink.message}</FieldError>}
                </DeliverableItem>

                <DeliverableItem>
                    <Label htmlFor="presentationFile">
                        Presentation File (PDF, PPT, etc.)<RequiredMark>*</RequiredMark>
                    </Label>
                    <HelperText>Upload the deck you’ll present to the judges.</HelperText>
                    <Controller
                        name="presentationFile"
                        control={control}
                        rules={{ required: 'Presentation file is required' }}
                        render={({ field }) => {
                            const { value, ...restField } = field;
                            console.log('Presentation file field value:', value);
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
                                        📎 {presentationFile ? 'Change File' : 'Choose File'}
                                    </FileUploadButton>
                                    <FileNameText>
                                        {presentationFile
                                            ? `Selected: ${presentationFile.name}`
                                            : 'No file chosen (PDF, PPT, PPTX)'}
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
