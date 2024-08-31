import "../styles/component-theme.css"
import { useEffect, useState } from "react";
import {EventRegFormInputProps} from "./EventRegFormUtils";

export default function EventRegistrationFormInput({ type, placeholder, name, register, error, valueAsNumber } : EventRegFormInputProps) {
    const [errorState, setErrorState] = useState<boolean>(false)
    useEffect(() => {
        if (error) {
            setErrorState(true);
        } else {
            setErrorState(false)
        }
    },[error])
    return (
        <div>
            <input className={"bg-dark-blue"}
            type={type}
                placeholder={placeholder}
                required
                {...register(name, { valueAsNumber })}
            />
            {errorState && error && <span className="error-message">{error.message}</span>}
        </div>
    )
}
