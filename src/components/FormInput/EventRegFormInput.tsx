import { EventRegFormInputProps } from './EventRegFormUtils';

export default function EventRegistrationFormInput({
    type,
    placeholder,
    name,
    register,
    valueAsNumber,
    required,
}: EventRegFormInputProps) {
    const inputClass =
        'w-full rounded-full bg-pmc-blue px-3 py-2 text-sm text-white placeholder:text-pmc-midnight-grey focus:outline-none';
    return (
        <div>
            <input
                className={inputClass}
                type={type}
                placeholder={required ? `${placeholder} *` : placeholder}
                required={required}
                {...register(name, { valueAsNumber })}
            />
        </div>
    );
}
