import React from 'react';
import { TextAreaWrapper, StyledTextArea, CharacterCount } from './EventRegText.styles';
import { UseFormRegister, FieldValues, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { EventRegFormSchema } from './EventRegFormUtils';

interface EventRegTextProps {
    maxLength?: number;
    placeholder?: string;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;
    register: UseFormRegister<EventRegFormSchema>;
    name: keyof EventRegFormSchema;
    required?: boolean;
}

const EventRegText: React.FC<EventRegTextProps> = ({
    maxLength = 200,
    placeholder,
    error = false,
    register,
    name,
    required,
}) => {
    const [value, setValue] = React.useState('');

    return (
        <TextAreaWrapper>
            <StyledTextArea
                placeholder={required ? `${placeholder} *` : placeholder}
                maxLength={maxLength}
                hasError={!!error}
                {...register(name, {
                    required,
                    onChange: (e) => setValue(e.target.value),
                })}
            />
            <CharacterCount>
                {value.length}/{maxLength} Characters
            </CharacterCount>
        </TextAreaWrapper>
    );
};

export default EventRegText;
