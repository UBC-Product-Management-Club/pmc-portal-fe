/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    FormProvider,
    UseFormReturn,
    useFormContext,
    FieldValues,
} from 'react-hook-form';
import { Question } from '../../types/Question';
import React from 'react';
const contentClass = 'flex w-full flex-col justify-evenly gap-4';
const submitClass = 'ml-auto rounded-lg bg-white px-8 py-2 font-semibold text-pmc-midnight-blue';
const requiredMarkClass = 'ml-1 text-red-500';
const errorClass = 'font-semibold text-red-500';
const questionWrapperClass = 'flex flex-col gap-1';
const labelClass = 'mb-1 block font-semibold';
const formClass = 'flex flex-col gap-8 text-pmc-light-grey';
const baseInputClass =
    'rounded-lg border border-transparent bg-pmc-blue px-3 py-2 text-white placeholder:text-pmc-midnight-grey focus:outline-none';
const fileButtonClass =
    'rounded-lg bg-pmc-light-blue px-4 py-2 font-semibold text-white hover:bg-pmc-dark-purple';
const fileNameClass = 'italic text-pmc-midnight-grey';

type StyledInputProps = React.InputHTMLAttributes<HTMLInputElement> & { $hasError: boolean };
type StyledTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    $hasError: boolean;
};
type StyledSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { $hasError: boolean };

const DefaultTextInput = ({ $hasError, className, ...props }: StyledInputProps) => {
    const borderClass = $hasError ? 'border border-red-500' : 'border border-transparent';
    return <input {...props} className={`${baseInputClass} ${borderClass} ${className ?? ''}`} />;
};

const TextArea = ({ $hasError, className, ...props }: StyledTextAreaProps) => {
    const borderClass = $hasError ? 'border border-red-500' : 'border border-transparent';
    return (
        <textarea {...props} className={`${baseInputClass} ${borderClass} ${className ?? ''}`} />
    );
};

const Dropdown = ({ $hasError, className, ...props }: StyledSelectProps) => {
    const borderClass = $hasError ? 'border border-red-500' : 'border border-transparent';
    const dropdownArrowClass = 'pr-4';
    return (
        <select
            {...props}
            className={`${baseInputClass} ${borderClass} ${dropdownArrowClass} ${className ?? ''}`}
        />
    );
};

interface EventFormProps<T extends FieldValues = FieldValues> {
    submitText?: string;
    onSubmit: (data: T) => Promise<void>;
    questions: Question[];
    methods: UseFormReturn<T>;
    loading: boolean;
    error: string | null;
}

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
    <div className={questionWrapperClass}>
        <label className={labelClass} htmlFor={id}>
            {label}
            {required && <span className={requiredMarkClass}>*</span>}
        </label>
        {children}
        {error && <span className={errorClass}>{error}</span>}
    </div>
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
                const { value, ...restField } = field;
                return (
                    <>
                        <input
                            {...restField}
                            ref={fileInputRef}
                            type="file"
                            id={question.id}
                            onChange={(e) => field.onChange(e.target.files?.[0])} // manually update RHF state
                            className="hidden"
                        />
                        <button
                            className={fileButtonClass}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose file
                        </button>
                        <span className={fileNameClass}>
                            {file ? `File selected: ${file.name}` : 'No file chosen'}
                        </span>
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
        <div className={contentClass}>
            <FormProvider {...methods}>
                <form
                    className={formClass}
                    autoComplete="off"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    {error && <span className={errorClass}>{error}</span>}

                    {questions.map((q) => (
                        <RenderQuestion key={q.id} question={q} />
                    ))}

                    <button className={submitClass} disabled={loading} type="submit">
                        {loading ? 'Loading...' : submitText}
                    </button>
                </form>
            </FormProvider>
        </div>
    );
};
