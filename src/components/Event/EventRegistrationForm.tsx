import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import EventRegDropdown from '../FormInput/EventRegDropdown';
import EventRegFileUpload from '../FormInput/EventRegFileUpload';
import EventRegText from '../FormInput/EventRegText';
import EventRegistrationFormInput from '../FormInput/EventRegFormInput';
import { EventRegFormSchema } from '../FormInput/EventRegFormUtils';

type Question = {
  label: string;
  questionType: 'short-answer' | 'long-answer' | 'dropdown' | 'file';
  options?: string[];
  required?: boolean;
};

type EventForm = {
  title: string;
  questions: Question[];
};

export default function EventRegistrationForm({
  onSubmit,
  formId
}: {
  onSubmit: (data: EventRegFormSchema) => Promise<void>;
  formId: string;
}) {
  const [formData, setFormData] = useState<EventForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
  } = useForm<any>();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/eventForm/${formId}`);
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

  const renderQuestion = (question: Question) => {
    switch (question.questionType) {
      case 'dropdown':
        return (
          <EventRegDropdown
            name={question.label}
            placeholder={question.label}
            options={question.options?.map(opt => ({ value: opt, label: opt })) || []}
            register={register}
            required={question.required!}
          />
        );

      case 'file':
        return (
          <EventRegFileUpload
            name={question.label}
            register={register}
            required={question.required!}
            onFileSelect={() => {}}
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
    }
  };

  return (
    <form className="form-content form-bg-dark-blue" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <h2>{formData.title}</h2>
      {formData.questions.map((question, index) => (
        <div key={index} className="form-field">
          {renderQuestion(question)}
        </div>
      ))}
      <button className="pmc-button pmc-button-white" type="submit">Continue to Payment</button>
    </form>
  );
}