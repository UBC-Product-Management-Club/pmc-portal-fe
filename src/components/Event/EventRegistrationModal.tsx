import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import {UserSchema} from "../OnboardingForm/types";
import {EventRegFormSchema} from "../FormInput/EventRegFormUtils";
import EventRegistrationGuest from "./EventRegistrationGuest";
import {EventPayment} from "./EventPayment";
import {useAuth0} from "@auth0/auth0-react";
import {useAuth} from "../../providers/Auth/AuthProvider";
import {v4 as generateAttendeeId} from "uuid";
import {PaymentIntent} from "@stripe/stripe-js";
import {addTransactionBody, attendeeType} from "../../types/api";
import {Timestamp} from "firebase/firestore";

Modal.setAppElement("#root");

// TODO: if alr signed up, don't make button visible
export function EventRegistrationModal(props: {
    eventId: string;
    memberPrice: number;
    nonMemberPrice: number;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const {user} = useAuth0();
    const {userData, isSignedIn} = useAuth();
    const [isGuest, setIsGuest] = useState(false);
    const defaultUserInfo: UserSchema = {
        first_name: "-",
        last_name: "-",
        pronouns: "-",
        ubc_student: "no, other",
        why_pm: "-",
        returning_member: "no",
        email: "",
        ...userData,
    };
    const [userInfo, setUserInfo] = useState<UserSchema>(defaultUserInfo);
    const [eventRegInfo, setEventRegInfo] = useState<EventRegFormSchema>();
    const [step, setStep] = useState(isSignedIn ? 2 : 0);
    const navigateTo = useNavigate();

    const handleContinueAsGuest = () => setStep(1);
    const handleSubmitGuest = async (data: UserSchema) => {
        setIsGuest(true);
        setUserInfo(data);
        setStep(2);
    };

    const handleSubmitEventRegInfo = async (data: EventRegFormSchema) => {
        setEventRegInfo(data);
        setStep(3);
    };

    const handlePaymentSuccess = async (paymentIntent: PaymentIntent | null) => {
        const attendeeId = generateAttendeeId() // generate attendee uuid here
        const attendeeInfo: attendeeType = {
            attendee_Id: attendeeId, // both members and non-members have this
            is_member: !isGuest,
            member_Id: user?.sub || "", // if they're not a member this is empty
            event_Id: props.eventId,
            ...userInfo,
            ...eventRegInfo!, // eventRegInfo can't be null...?
            email: user?.email ?? userInfo.email!,  // we don't want to overwrite this. Either provided from user profile or guest input
        }
        const paymentInfo: addTransactionBody = {
            type: "event",
            member_id: user?.sub || "",
            attendee_id: attendeeId,
            payment: paymentIntent
                ? {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    status: paymentIntent.status,
                    created: new Timestamp(paymentIntent.created, 0)
                }
                : {
                    id: attendeeId,
                    amount: 0,
                    status: 'succeeded',
                    created: new Timestamp(Math.floor(Date.now() / 1000), 0)
                }
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/registered`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        attendeeInfo: attendeeInfo,
                        paymentInfo: paymentInfo
                    })
                }
            )
            if (!response.ok) {
                // this would be pretty bad since the user has already paid at this point.
                throw Error("Event registration failed. Contact tech@ubcpmc.com for support")
            }
        } catch (e) {
            console.error(e)
        }
    };

    // what is this for?
    useEffect(() => {
        setUserInfo({...userInfo, ...userData});
    }, [props.isModalOpen]);

    const stepComponents = [
        <EventRegistrationSignIn
            isOpen={props.isModalOpen}
            onRequestClose={() => props.setIsModalOpen(false)}
            onSignInOrCreateAccount={() => navigateTo("/")}
            onContinueAsGuest={handleContinueAsGuest}
        />,
        <EventRegistrationGuest onSubmit={handleSubmitGuest}/>,
        <EventRegistrationForm onSubmit={handleSubmitEventRegInfo}/>,
        <EventPayment
            onPaymentSuccess={handlePaymentSuccess}
            isGuest={isGuest}
            eventId={props.eventId}
            nonMemberPrice={props.nonMemberPrice}
            memberPrice={props.memberPrice}
        />,
    ];

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    function handleClose() {
        if (isGuest) {
            setIsGuest(false);
        }
        setStep(isSignedIn ? 2 : 0);
        props.setIsModalOpen(false);
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            onRequestClose={handleClose}
            className="event-registration-modal"
            overlayClassName="event-registration-modal-overlay"
        >
            <div className={"event-registration-modal-content"} onClick={handleClick}>
                {stepComponents[step]}
            </div>
        </Modal>
    );
}
