import { UseFormRegister } from "react-hook-form";

interface DropdownOption {
    value: string;
    label: string;
}

interface EventRegDropdownProps {
    name: string;
    placeholder: string;
    options: DropdownOption[];
    register: UseFormRegister<any>;
    required: boolean;
}

export default function EventRegDropdown({ name, placeholder, options, register, required }: EventRegDropdownProps) {
    return (
        <select className={"form-select"} required={required}
                {...register(name, {required: "please select a value"})}>
            <option value={""} hidden>{required ? `${placeholder} *` : placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
} 
