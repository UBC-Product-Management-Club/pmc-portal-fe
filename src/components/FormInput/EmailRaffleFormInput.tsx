import { UseFormRegister, FieldError } from 'react-hook-form';
import '../styles/component-theme.css';

type RaffleFormData = {
    email: string;
};

interface FormInputProps {
    type: string;
    placeholder?: string;
    name: keyof RaffleFormData;
    register: UseFormRegister<RaffleFormData>;
    error?: FieldError;
}

export default function RaffleFormInput({
    type,
    placeholder,
    name,
    register,
    error,
}: FormInputProps) {
    return (
        <div>
            <input
                className={'bg-dark-blue'}
                style={error ? { border: '0.25rem solid red' } : undefined}
                type={type}
                placeholder={placeholder}
                {...register(name, {
                    required: 'Email is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                    },
                })}
            />
            {error && <span className="error-message">{error.message}</span>}
        </div>
    );
}
