import {UserDataForm} from "../UserDataForm/UserDataForm";
import {UserSchema} from "../OnboardingForm/types";

export default function EventRegistrationGuest({onSubmit}: {onSubmit: (data: UserSchema) => Promise<void>}) {
    return (
        <div className={"form-bg-dark-blue"}>
            <UserDataForm onSubmit={onSubmit} excludeReturningAndWhyPM={true} includeEmail={true}/>
        </div>
    )
}