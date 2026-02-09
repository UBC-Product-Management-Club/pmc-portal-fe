import { UseFormRegister, FieldError } from 'react-hook-form';

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
    const inputClass =
        'w-full rounded-full border border-transparent bg-pmc-blue px-3 py-2 text-white placeholder:text-pmc-midnight-grey focus:outline-none';
    const errorClass = 'border-2 border-red-500';
    const errorTextClass = 'ml-2 text-sm text-red-400';
    return (
        <div>
            <input
                className={`${inputClass} ${error ? errorClass : ''}`}
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
            {error && <span className={errorTextClass}>{error.message}</span>}
        </div>
    );
}
