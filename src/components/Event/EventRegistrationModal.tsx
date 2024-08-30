import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/Auth/AuthProvider";
import {Dispatch, SetStateAction, useState} from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import {UserSchema} from "../OnboardingForm/types";
import {UserDataForm} from "../UserDataForm";
import {EventRegFormSchema} from "../FormInput/EventRegFormUtils";

export function EventRegistrationModal(props:
    {
        eventId: string,
        isModalOpen: boolean,
        setIsModalOpen: Dispatch<SetStateAction <boolean>>
    }) {
    const {currentUser} = useAuth();
    const [isGuest, setIsGuest] = useState(false);
    // TODO: if existing user, fetch user data
    const [userData, setUserData] = useState<UserSchema>();
    const navigateTo = useNavigate();

    const handleContinueAsGuest = () => setStep(1);
    const handleSubmitGuest = async (data: UserSchema) => {
        setIsGuest(true);
        setUserData(data);
        setStep(2);
    }

    // TODO: post proper form content
    const handleSubmitEventForm = async (data: EventRegFormSchema) => {
        const eventFormBody = JSON.stringify({
            "is_member": !isGuest,
            "event_Id": props.eventId,
            "email": "lol@gmail.com",
            ...userData,
            ...data
        });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/attendee/addAttendee`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                },
                body: eventFormBody
            })
            if (response.ok) {
                setStep(3);
            } else {
                throw Error("Failed to register attendee")
            }
        } catch (e) {
            console.error(e);
        }
    }

    function handleClose() {
        if (isGuest)
        props.setIsModalOpen(false)
    }

    const [step, setStep] = useState(currentUser ? 2 : 0);
    const stepComponents = [
        <EventRegistrationSignIn
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            onSignInOrCreateAccount={() => navigateTo("/")}
            onContinueAsGuest={handleContinueAsGuest}/>,
        <UserDataForm onSubmit={handleSubmitGuest} excludeReturningAndWhyPM={true}/>,
        <EventRegistrationForm onSubmit={handleSubmitEventForm}/>,
        <h2>You have successfully registered for the event!</h2>
    ];

    return (
        <Modal
            isOpen={props.isModalOpen}
            onRequestClose={handleClose}
            className="event-registration-modal"
            overlayClassName="event-registration-modal-overlay"
        >
            {stepComponents[step]}
        </Modal>
    )
}