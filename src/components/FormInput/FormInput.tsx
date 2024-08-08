import { useEffect, useState } from "react";
import "./FormInput.css"
import { FormInputProps } from "./types";


export default function FormInput({ type, placeholder, name, register, error, valueAsNumber } : FormInputProps) {
    const [errorState, setErrorState] = useState<boolean>(false)
    useEffect(() => {
        if (error) {
            setErrorState(true);
        } else {
            setErrorState(false)
        }
    },[error])
    return (
        <div className="onboarding-form-input-container">
            <input style={errorState ? 
                {
                    "border" : "0.25rem",
                    "borderColor" : "red"
                } : undefined
            }
            type={type} placeholder={placeholder} required {...register(name, { valueAsNumber })} />
            {errorState && error && <span className="error-message">{error.message}</span>}
        </div>
    )
}
