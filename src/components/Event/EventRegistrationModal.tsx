import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/Auth/AuthProvider";
import {useState} from "react";
import EventRegistrationForm from "./EventRegistrationForm";

export function EventRegistrationModal(props:
    {
        isModalOpen: boolean,
        setIsModalOpen: React.Dispatch<React.SetStateAction <boolean>>
    }) {
    const {currentUser} = useAuth();
    const navigateTo = useNavigate();

    const [step, setStep] = useState(currentUser ? 1 : 0);
    const stepComponents = [
        <EventRegistrationSignIn
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            onSignInOrCreateAccount={() => navigateTo("/")}
            onContinueAsGuest={() => setStep(1)}/>,
        <EventRegistrationForm/>
    ]

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