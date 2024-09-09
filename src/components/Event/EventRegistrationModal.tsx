import "./EventRegistrationModal.css";
import EventRegistrationSignIn from "./EventRegistrationSignIn";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import { UserSchema } from "../OnboardingForm/types";
import { EventRegFormSchema } from "../FormInput/EventRegFormUtils";
import EventRegistrationGuest from "./EventRegistrationGuest";
import { EventPayment } from "./EventPayment";
import {useAuth0} from "@auth0/auth0-react";
Modal.setAppElement("#root");

// TODO: if alr signed up, don't make button visible
export function EventRegistrationModal(props: {
  eventId: string;
  memberPrice: number;
  nonMemberPrice: number;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { user, isAuthenticated } = useAuth0()
  const [isGuest, setIsGuest] = useState(false);
  const defaultUserInfo: UserSchema = {
    first_name: "-",
    last_name: "-",
    pronouns: "-",
    ubc_student: "no, other",
    why_pm: "-",
    returning_member: "no",
    ...user?.user_metadata,
  };
  const [userInfo, setUserInfo] = useState<UserSchema>(defaultUserInfo);
  const [eventRegInfo, setEventRegInfo] = useState<EventRegFormSchema>();
  const [step, setStep] = useState(isAuthenticated ? 2 : 0);
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

  const handlePaymentSuccess = async () => {
    const eventFormBody = JSON.stringify({
      is_member: !isGuest,
      event_Id: props.eventId,
      email: user?.email,
      member_Id: user?.sub,
      ...userInfo,
      ...eventRegInfo,
    });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/attendee/addAttendee`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: eventFormBody,
        }
      );
      if (!response.ok) {
        throw Error("Failed to register attendee");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setUserInfo({ ...userInfo, ...user?.user_metadata });
  }, [props.isModalOpen]);

  const stepComponents = [
    <EventRegistrationSignIn
      isOpen={props.isModalOpen}
      onRequestClose={() => props.setIsModalOpen(false)}
      onSignInOrCreateAccount={() => navigateTo("/")}
      onContinueAsGuest={handleContinueAsGuest}
    />,
    <EventRegistrationGuest onSubmit={handleSubmitGuest} />,
    <EventRegistrationForm onSubmit={handleSubmitEventRegInfo} />,
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
    setStep(isAuthenticated ? 2 : 0);
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
