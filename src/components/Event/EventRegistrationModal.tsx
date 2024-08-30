import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/Auth/AuthProvider";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import {UserSchema} from "../OnboardingForm/types";
import {EventRegFormSchema} from "../FormInput/EventRegFormUtils";
import EventRegistrationGuest from "./EventRegistrationGuest";

// TODO: if alr signed up, don't make button visible
export function EventRegistrationModal(props:
    {
        eventId: string,
        isModalOpen: boolean,
        setIsModalOpen: Dispatch<SetStateAction <boolean>>
    }) {
    const {currentUser, userData} = useAuth();
    const [isGuest, setIsGuest] = useState(false);
    const defaultUserInfo: UserSchema = {
        first_name: "-",
        last_name: "-",
        pronouns: "-",
        ubc_student: "no, other",
        why_pm: "-",
        returning_member: "no",
        ...userData
    }
    const [userInfo, setUserInfo] = useState<UserSchema>(defaultUserInfo);
    const navigateTo = useNavigate();

    const handleContinueAsGuest = () => setStep(1);
    const handleSubmitGuest = async (data: UserSchema) => {
        setIsGuest(true);
        setUserInfo(data);
        setStep(2);
    }

    const handleSubmitEventForm = async (data: EventRegFormSchema) => {
        const eventFormBody = JSON.stringify({
            "is_member": !isGuest,
            "event_Id": props.eventId,
            "email": currentUser?.email,
            ...userInfo,
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

    useEffect(() => {
        setUserInfo({...userInfo, ...userData})
    }, [userData, userInfo]);

    const [step, setStep] = useState(currentUser ? 2 : 0);
    const stepComponents = [
        <EventRegistrationSignIn
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            onSignInOrCreateAccount={() => navigateTo("/")}
            onContinueAsGuest={handleContinueAsGuest}/>,
        <EventRegistrationGuest onSubmit={handleSubmitGuest}/>,
        <EventRegistrationForm onSubmit={handleSubmitEventForm}/>,
        <h2>You have successfully registered for the event!</h2>
    ];

    function handleClose() {
        if (isGuest) {
            setIsGuest(false);
        }
        setStep(currentUser ? 2 : 0);
        props.setIsModalOpen(false)
    }

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