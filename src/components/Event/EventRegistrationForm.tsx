import '../component-theme.css';
import {useForm} from "react-hook-form";
import {OnboardingFormSchema, UserZodObj} from "../OnboardingForm/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {EventRegFormSchema, EventRegZodObj} from "../FormInput/EventRegFormUtils";
import EventRegistrationFormInput from "../FormInput/EventRegFormInput";
export default function EventRegistrationForm() {
    const {
        register,
        unregister,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<EventRegFormSchema>({
        resolver: zodResolver(EventRegZodObj)
    });

    function submit() {

    }

    return (
        <form className={"form-content"} autoComplete="off" onSubmit={() => handleSubmit()}>
            <select className={"form-select form-select-dark-blue"} required>
                <option value={""} hidden>How familiar are you with product management?</option>
                <option value={"beginner"}>Beginner; little to no knowledge</option>
                <option value={"intermediate"}>Intermediate; some knowledge from competitions, courses, self research</option>
                <option value={"advanced"}>Advanced; had formal experience, familiar with frameworks & applications</option>
                <option value={"mentor"}>Mentor; have mentored before</option>
            </select>
            <select className={"form-select form-select-dark-blue"} required>
                <option value={""} hidden>How did you find out about this event?</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="newsletter">Newsletter</option>
                <option value="website">Website</option>
                <option value="friend-or-colleague">Friend or Colleague</option>
                <option value="partner-event">Partner Event (another club, company, etc.)</option>
                <option value="pmc-booth">PMC Booth</option>
                <option value="other">Other</option>
            </select>
            <EventRegistrationFormInput
                type={"text"}
                placeholder={"Dietary restrictions"}
                name={"dietary"}
                register={register}
                error={errors.dietary}/>
            <EventRegistrationFormInput
                type={"text"}
                placeholder={"What do you hope to get out of this event?"}
                name={"expectation"}
                register={register}
                error={errors.expectation}/>
            <button className="pmc-button pmc-button-white" type="submit">Sign Up</button>
        </form>
    )
}