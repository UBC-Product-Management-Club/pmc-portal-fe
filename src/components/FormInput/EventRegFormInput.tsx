import '../styles/component-theme.css';
import { EventRegFormInputProps } from './EventRegFormUtils';

export default function EventRegistrationFormInput({
    type,
    placeholder,
    name,
    register,
    valueAsNumber,
    required,
}: EventRegFormInputProps) {
    return (
        <div>
            <input
                style={{ fontFamily: 'poppins' }}
                className={'bg-dark-blue form-input'}
                type={type}
                placeholder={required ? `${placeholder} *` : placeholder}
                required={required}
                {...register(name, { valueAsNumber })}
            />
        </div>
    );
}
