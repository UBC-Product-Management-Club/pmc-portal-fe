import { UseFormRegister } from 'react-hook-form';
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
    const groupClass = 'flex flex-col gap-2';
    const labelClass = 'mb-2 text-sm font-medium text-white';
    const itemClass = 'flex items-center gap-2';
    const inputClass = 'h-[18px] w-[18px] cursor-pointer accent-pmc-light-blue';
    const optionLabelClass = 'cursor-pointer text-sm text-white';
    return (
        <div className={groupClass}>
            <label className={labelClass}>
                {name}
                {required && ' *'}
            </label>
            {options.map((option, index) => (
                <div className={itemClass} key={index}>
                    <input
                        className={inputClass}
                        type="checkbox"
                        id={`${name}-${index}`}
                        value={option}
                        {...register(name, {
                            required: required ? 'This field is required' : false,
                            validate: (value) =>
                                (value && value.length > 0) || 'Please select at least one option',
                        })}
                    />
                    <label className={optionLabelClass} htmlFor={`${name}-${index}`}>
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
}
