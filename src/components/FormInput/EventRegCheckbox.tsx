import { UseFormRegister } from 'react-hook-form';
import {
    CheckboxGroup,
    CheckboxLabel,
    CheckboxItem,
    CheckboxInput,
    OptionLabel,
} from './EventRegCheckbox.styles';
import { EventRegFormSchema } from './EventRegFormUtils';

interface EventRegCheckboxProps {
    name: keyof EventRegFormSchema;
    options: string[];
    register: UseFormRegister<EventRegFormSchema>;
    required?: boolean;
}

export default function EventRegCheckbox({
    name,
    options,
    register,
    required = false,
}: EventRegCheckboxProps) {
    return (
        <CheckboxGroup>
            <CheckboxLabel>
                {name}
                {required && ' *'}
            </CheckboxLabel>
            {options.map((option, index) => (
                <CheckboxItem key={index}>
                    <CheckboxInput
                        type="checkbox"
                        id={`${name}-${index}`}
                        value={option}
                        {...register(name, {
                            required: required ? 'This field is required' : false,
                            validate: (value) =>
                                (value && value.length > 0) || 'Please select at least one option',
                        })}
                    />
                    <OptionLabel htmlFor={`${name}-${index}`}>{option}</OptionLabel>
                </CheckboxItem>
            ))}
        </CheckboxGroup>
    );
}
