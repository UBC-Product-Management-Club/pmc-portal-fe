import { useRef } from 'react';
import { Question } from '../../types/Question';
import { countWords, inputClass } from './applicationRules';

type FieldProps = {
    label: string;
    error?: string;
    help?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export function Field({ label, error, help, children, footer }: FieldProps) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{label}</span>
            {children}
            {help && <span className="text-xs text-slate-600">{help}</span>}
            {footer}
            {error && <span className="text-sm font-medium text-red-700">{error}</span>}
        </label>
    );
}

type QuestionFieldProps = {
    question: Question;
    value: string;
    file: File | null;
    error?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    onFile: (file: File | null) => void;
};

export function QuestionField({
    question: q,
    value,
    file,
    error,
    disabled,
    onChange,
    onFile,
}: QuestionFieldProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const label = q.required ? q.label : `${q.label} (optional)`;

    if (q.type === 'long-answer') {
        const words = countWords(value);
        const over = q.maxWords !== undefined && words > q.maxWords;
        return (
            <Field
                label={label}
                error={error}
                footer={
                    q.maxWords !== undefined && (
                        <span
                            className={`text-right text-xs ${over ? 'font-semibold text-red-700' : 'text-slate-600'}`}
                        >
                            {over && `Over the limit: cut ${words - q.maxWords} words to submit · `}
                            {words} / {q.maxWords} words
                        </span>
                    )
                }
            >
                <textarea
                    className={`${inputClass} min-h-28 ${over ? 'border-red-500' : ''}`}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            </Field>
        );
    }

    if (q.type === 'dropdown') {
        return (
            <Field label={label} error={error}>
                <select
                    className={inputClass}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select…</option>
                    {q.options.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                </select>
            </Field>
        );
    }

    if (q.type === 'file') {
        const types = q.accept?.includes('application/pdf') ? 'PDF only' : 'Any file';
        const size = q.maxSizeMB ? `, up to ${q.maxSizeMB} MB` : '';
        return (
            <Field
                label={label}
                error={error}
                help={`${types}${size}. Your text answers save as you type; the file uploads when you submit.`}
            >
                <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    accept={q.accept?.join(',')}
                    disabled={disabled}
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
                <span
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-[10px] border border-dashed bg-white/60 px-3 py-2 ${error ? 'border-red-500' : 'border-slate-400'}`}
                >
                    {file ? (
                        <>
                            <span className="truncate">
                                📄 {file.name} · {Math.ceil(file.size / 1024)} KB
                            </span>
                            <button
                                type="button"
                                className="min-h-11 shrink-0 px-2 text-sm underline"
                                disabled={disabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onFile(null);
                                    if (fileInput.current) fileInput.current.value = '';
                                }}
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="min-h-11 w-full text-left text-slate-600"
                            disabled={disabled}
                            onClick={() => fileInput.current?.click()}
                        >
                            Choose a file
                        </button>
                    )}
                </span>
            </Field>
        );
    }

    return (
        <Field
            label={label}
            error={error}
            help={q.id === 'phone' ? 'Only the organizers see this' : undefined}
        >
            <input
                className={inputClass}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
        </Field>
    );
}
