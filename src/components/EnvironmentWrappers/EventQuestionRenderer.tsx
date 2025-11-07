import {
    Controller,
    FormProvider,
    UseFormReturn,
    useFormContext,
    FieldValues,
} from 'react-hook-form';
import { Question } from '../../types/Question';
import { styled } from 'styled-components';
import React from 'react';

const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
`;

const Dropdown = styled.select<{ $hasError: boolean }>`
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    flex: 1;
    font-family: 'poppins';

    &::placeholder {
        color: var(--pmc-midnight-blue);
    }

    border: ${(props) => props.$hasError && '0.2rem solid red'};
`;

const Submit = styled.button`
    font-family: poppins;
    font-weight: 600;
    margin-left: auto;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    color: var(--pmc-midnight-blue);
    cursor: pointer;
`;

const RequiredMark = styled.span`
    color: red;
    margin-left: 0.25rem;
`;

const ErrorMessage = styled.span`
    font-family: poppins;
    font-weight: 600;
    color: red;
`;

const DefaultTextInput = styled.input<{ $hasError: boolean }>`
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    flex: ${(props) => (props.width ? '' : 1)};
    font-family: poppins;
    border: 1px solid ${(props) => (props.$hasError ? 'red' : '#ccc')};
    outline: none;
    box-sizing: border-box;

    &::placeholder {
        color: var(--pmc-midnight-blue);
    }
`;

const TextArea = styled.textarea<{ $hasError: boolean }>`
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${(props) => (props.$hasError ? 'red' : '#ccc')};
    outline: none;
    box-sizing: border-box;
    font-family: poppins;

    &::placeholder {
        color: var(--pmc-midnight-blue);
    }
`;

const StyledQuestionWrapper = styled.div`
    display: flex;
    flex-direction: column; /* stack label + input vertically */
    gap: 0.25rem; /* small spacing */
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.25rem; /* add space below label */
    font-weight: 600;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const FileUploadButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--pmc-light-blue);
    color: white;
    cursor: pointer;
    font-weight: 600;
    border: none;

    &:hover {
        background-color: var(--pmc-dark-purple);
    }
`;

const FileNameText = styled.span`
    font-style: italic;
    color: var(--pmc-midnight-grey);
`;

const StyledForm = styled.form`
    display: flex;
    color: var(--pmc-light-grey);
    flex-direction: column;
    gap: 2rem; // adjust spacing here
`;

interface EventFormProps<T extends FieldValues = FieldValues> {
    submitText?: string;
    onSubmit: (data: T) => Promise<void>;
    questions: Question[];
    methods: UseFormReturn<T>;
    loading: boolean;
    error: string | null;
}

type StyledInputProps = React.ComponentProps<typeof DefaultTextInput>;

type TextBasedQuestion = Extract<Question, { type: 'short-answer' | 'long-answer' }>;

type TextBasedInputProps = {
    question: TextBasedQuestion;
    StyledComponent: React.ComponentType<StyledInputProps>;
};

type FileBasedInputProps = {
    question: Extract<Question, { type: 'file' }>;
};

type DropdownInputProps = {
    question: Extract<Question, { type: 'dropdown' }>;
    StyledComponent: React.ComponentType<StyledInputProps>;
};

type QuestionWrapperProps = {
    id: string;
    label: string;
    required: boolean;
    error?: string;
    placeholder?: string;
    children: React.ReactNode;
};

// General question layout, taking input element as children
const QuestionWrapper = ({ id, label, required, error, children }: QuestionWrapperProps) => (
    <StyledQuestionWrapper>
        <Label htmlFor={id}>
            {label}
            {required && <RequiredMark>*</RequiredMark>}
        </Label>
        {children}
        {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledQuestionWrapper>
);

// Form control for long and short answers
const TextBasedInput = ({ question, StyledComponent }: TextBasedInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const hasError = !!errors[question.id];
    const FinalInput = StyledComponent;
    return (
        <FinalInput
            id={question.id}
            type="text"
            $hasError={!!hasError}
            {...register(question.id, { required: question.required && 'This field is required' })}
        ></FinalInput>
    );
};

// Allows for single file uploads (add multiple attribute if needed)
// Does not yet support previewing and file deletion

const FileBasedInput = ({ question }: FileBasedInputProps) => {
    const { control, watch } = useFormContext();
    const file = watch(question.id);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <Controller
            name={question.id}
            control={control}
            rules={{ required: question.required && 'This field is required' }}
            render={({ field }) => {
                const { ...restField } = field;
                return (
                    <>
                        <HiddenFileInput
                            {...restField}
                            ref={fileInputRef}
                            type="file"
                            id={question.id}
                            onChange={(e) => field.onChange(e.target.files?.[0])} // manually update RHF state
                        />
                        <FileUploadButton
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose file
                        </FileUploadButton>
                        <FileNameText>
                            {file ? `File selected: ${file.name}` : 'No file chosen'}
                        </FileNameText>
                    </>
                );
            }}
        />
    );
};

const DropdownInput = ({ question, StyledComponent }: DropdownInputProps) => {
    const {
        formState: { errors },
        register,
    } = useFormContext();
    const hasError = !!errors[question.id];
    const FinalInput = StyledComponent;
    return (
        <FinalInput
            id={question.id}
            $hasError={!!hasError}
            {...register(question.id, {
                required: question.required && 'This field is required',
            })}
            defaultValue=""
        >
            <option value="" hidden>
                Select an option
            </option>
            {question.options?.map((opt, idx) => (
                <option key={idx} value={opt}>
                    {opt}
                </option>
            ))}
        </FinalInput>
    );
};

const RenderQuestion = ({ question }: { question: Question }) => {
    const {
        formState: { errors },
    } = useFormContext();
    const errorMessage = errors?.[question.id]?.message as string;

    return (
        <QuestionWrapper
            id={question.id}
            label={question.label}
            required={question.required}
            error={errorMessage}
        >
            {(() => {
                switch (question.type) {
                    case 'short-answer':
                        return (
                            <TextBasedInput
                                question={question}
                                StyledComponent={DefaultTextInput}
                            />
                        );
                    case 'long-answer':
                        return <TextBasedInput question={question} StyledComponent={TextArea} />;
                    case 'dropdown':
                        return <DropdownInput question={question} StyledComponent={Dropdown} />;
                    case 'file':
                        return <FileBasedInput question={question} />;
                    default:
                        return <div />;
                }
            })()}
        </QuestionWrapper>
    );
};

export const EventQuestionRenderer = <T extends FieldValues = FieldValues>({
    submitText = 'Submit & Pay',
    onSubmit,
    questions,
    methods,
    loading,
    error,
}: EventFormProps<T>) => {
    return (
        <Content>
            <FormProvider {...methods}>
                <StyledForm autoComplete="off" onSubmit={methods.handleSubmit(onSubmit)}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    {questions.map((q) => (
                        <RenderQuestion key={q.id} question={q} />
                    ))}

                    <Submit disabled={loading} type="submit">
                        {loading ? 'Loading...' : submitText}
                    </Submit>
                </StyledForm>
            </FormProvider>
        </Content>
    );
};
