import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/Auth/AuthProvider";

export function EventRegistrationModal(props:
    {
        isModalOpen: boolean,
        setIsModalOpen: React.Dispatch<React.SetStateAction <boolean>>
    }) {
    const {currentUser} = useAuth();
    const navigateTo = useNavigate();

    return (
        <Modal
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            className="event-registration-modal"
            overlayClassName="event-registration-modal-overlay"
        >
            {currentUser == null &&
                <EventRegistrationSignIn
                    isOpen={props.isModalOpen}
                    onRequestClose={() => props.setIsModalOpen(false)}
                    onSignInOrCreateAccount={() => navigateTo("/")}
                    onContinueAsGuest={() => {}}/>}
        </Modal>
    )
}