import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/Auth/AuthProvider";
import {Dispatch, SetStateAction, useState} from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import {UserSchema} from "../OnboardingForm/types";
import {UserDataForm} from "../UserDataForm";

export function EventRegistrationModal(props:
    {
        isModalOpen: boolean,
        setIsModalOpen: Dispatch<SetStateAction <boolean>>
    }) {
    const {currentUser} = useAuth();
    const [userData, setUserData] = useState<UserSchema>({
        first_name: "",
        last_name: "",
        pronouns: "",
        ubc_student: "yes",
        student_id: 12345678,
        why_pm: "",
        returning_member: "no"
    });
    const navigateTo = useNavigate();

    const handleContinueAsGuest = () => setStep(1);
    const handleSubmitGuest = async (data: UserSchema) => {
        setUserData(data);
        setStep(2);
        console.log(userData);
    }

    const [step, setStep] = useState(currentUser ? 2 : 0);
    const stepComponents = [
        <EventRegistrationSignIn
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            onSignInOrCreateAccount={() => navigateTo("/")}
            onContinueAsGuest={handleContinueAsGuest}/>,
        <UserDataForm onSubmit={handleSubmitGuest} excludeReturningAndWhyPM={true}/>,
        <EventRegistrationForm/>
    ];

    return (
        <Modal
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            className="event-registration-modal"
            overlayClassName="event-registration-modal-overlay"
        >
            {stepComponents[step]}
        </Modal>
    )
}