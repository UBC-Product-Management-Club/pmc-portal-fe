import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EventRegDropdown from '../FormInput/EventRegDropdown';
import EventRegFileUpload from '../FormInput/EventRegFileUpload';
import EventRegText from '../FormInput/EventRegText';
import EventRegistrationFormInput from '../FormInput/EventRegFormInput';
import { EventRegFormSchema } from '../FormInput/EventRegFormUtils';
import EventRegCheckbox from '../FormInput/EventRegCheckbox';

type Question = {
    label: keyof EventRegFormSchema;
    questionType: 'short-answer' | 'long-answer' | 'dropdown' | 'file' | 'checkbox';
    options?: string[];
    required?: boolean;
};

type EventForm = {
    title: string;
    questions: Question[];
};

export default function EventRegistrationForm({
    onSubmit,
    formId,
}: {
    onSubmit: (data: EventRegFormSchema, files: File[]) => Promise<void>;
    formId: string;
}) {
    const [formData, setFormData] = useState<EventForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const { register, handleSubmit } = useForm<EventRegFormSchema>();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/eventForm/${formId}`
                );
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Error fetching form:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForm();
    }, [formId]);

    if (isLoading || !formData) {
        return <div style={{ color: 'white' }}>Loading form...</div>;
    }

    const handleFileSelect = (files: File[] | null) => {
        if (files) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    const renderQuestion = (question: Question) => {
        switch (question.questionType) {
            case 'dropdown':
                return (
                    <EventRegDropdown
                        name={question.label}
                        placeholder={question.label}
                        options={question.options?.map((opt) => ({ value: opt, label: opt })) || []}
                        register={register}
                        required={question.required!}
                    />
                );

            case 'file':
                return (
                    <EventRegFileUpload
                        name={question.label}
                        register={register}
                        required={question.required}
                        onFileSelect={handleFileSelect}
                    />
                );

            case 'long-answer':
                return (
                    <EventRegText
                        placeholder={question.label}
                        name={question.label}
                        register={register}
                        required={question.required}
                    />
                );

            case 'short-answer':
            default:
                return (
                    <EventRegistrationFormInput
                        type="text"
                        placeholder={question.label}
                        name={question.label}
                        register={register}
                        required={question.required}
                    />
                );

            case 'checkbox':
                return (
                    <EventRegCheckbox
                        name={question.label}
                        options={question.options || []}
                        register={register}
                        required={question.required}
                    />
                );
        }
    };

    return (
        <form
            className="form-content form-bg-dark-blue"
            autoComplete="off"
            onSubmit={handleSubmit(
                (data) => onSubmit(data, uploadedFiles),
                () => {
                    window.alert('Please fill in all required fields');
                }
            )}
            style={{
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 150px)',
            }}
        >
            <h2>{formData.title}</h2>
            <small style={{ color: '#999', marginBottom: '16px', display: 'block' }}>
                * indicates required field
            </small>
            {formData.questions.map((question, index) => (
                <div key={index} className="form-field">
                    {renderQuestion(question)}
                </div>
            ))}
            <button
                className="pmc-button pmc-button-white"
                type="submit"
                style={{ marginTop: '16px' }}
            >
                Continue to Payment
            </button>
        </form>
    );
}
