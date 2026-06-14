import { UseFormRegister } from 'react-hook-form';
import { EventRegFormSchema } from './EventRegFormUtils';
interface DropdownOption {
    value: string;
    label: string;
}

interface EventRegDropdownProps {
    name: keyof EventRegFormSchema;
    placeholder: string;
    options: DropdownOption[];
    register: UseFormRegister<EventRegFormSchema>;
    required: boolean;
}

export default function EventRegDropdown({
    name,
    placeholder,
    options,
    register,
    required,
}: EventRegDropdownProps) {
    return (
        <select
            className="w-full rounded-full bg-pmc-blue px-3 py-2 text-sm text-white focus:outline-none"
            required={required}
            {...register(name, { required: 'please select a value' })}
        >
            <option value={''} hidden>
                {required ? `${placeholder} *` : placeholder}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
