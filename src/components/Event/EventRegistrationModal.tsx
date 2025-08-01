// import "./EventRegistrationModal.css";
// import EventRegistrationSignIn from "./EventRegistrationSignIn";
// import Modal from "react-modal";
// import {useNavigate} from "react-router-dom";
// import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
// import EventRegistrationForm from "./EventRegistrationForm";
// import {UserSchema} from "../OnboardingForm/types";
// import {EventRegFormSchema} from "../FormInput/EventRegFormUtils";
// import EventRegistrationGuest from "./EventRegistrationGuest";
// import {EventPayment} from "./EventPayment";
// import {v4 as generateAttendeeId} from "uuid";
// import {PaymentIntent} from "@stripe/stripe-js";
// import {addTransactionBody, attendeeType} from "../../types/api";
// import {Timestamp} from "firebase/firestore";
// import { UserDataContext } from "../../providers/UserData/UserDataProvider";

// Modal.setAppElement("#root");

// // TODO: if alr signed up, don't make button visible
// export function EventRegistrationModal(props: {
//     eventId: string;
//     memberPrice: number;
//     nonMemberPrice: number;
//     isModalOpen: boolean;
//     setIsModalOpen: Dispatch<SetStateAction<boolean>>;
//     formId: string;
// }) {
//     const [isGuest, setIsGuest] = useState(false);
//     const { user, isMember } = useContext(UserDataContext)
//     const defaultUserInfo: UserSchema = {
//         firstName: "-",
//         lastName: "-",
//         pronouns: "-",
//         whyPm: "-",
//         returningMember: "no",
//         email: "",
//         ...user,
//     };
//     const [userInfo, setUserInfo] = useState<UserSchema>(defaultUserInfo);
//     const [eventRegInfo, setEventRegInfo] = useState<EventRegFormSchema>();
//     const [step, setStep] = useState(isSignedIn ? 2 : 0);
//     const navigateTo = useNavigate();

//   const handleContinueAsGuest = () => setStep(1);
//   const handleSubmitGuest = async (data: UserSchema) => {
//     const isRegistered = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${props.eventId}/attendees/isRegistered`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({email: data.email}),
//     });
//     if (!isRegistered.ok) {
//       throw Error("Failed to check if user is registered");
//     }
//     const isRegisteredData = await isRegistered.json();
//     if (!isRegisteredData.isRegistered) {
//       setIsGuest(true);
//       setUserInfo(data);
//       setStep(2);
//     } else {
//       alert("You've already registered for this event");
//       handleClose();
//     }
//   };
//     const handleSubmitEventRegInfo = async (data: EventRegFormSchema, files: File[]) => {
//         setEventRegInfo(data);
//         if (files.length > 0) {
//             data.files = files;
//         }
//         setStep(3);
//     };

//     const handlePaymentSuccess = async (paymentIntent: PaymentIntent | null) => {
//         const attendeeId = generateAttendeeId();
//         const { files, ...regInfo } = eventRegInfo!;
//         const attendeeInfo: attendeeType = {
//             attendee_Id: attendeeId,
//             is_member: !isGuest,
//             member_Id: user?.sub || "",
//             event_Id: props.eventId,
//             ...userInfo,
//             ...regInfo!,
//             email: user?.email ?? userInfo.email!,
//         };
//         const paymentInfo: addTransactionBody = {
//             type: "event",
//             member_id: user?.sub || "",
//             attendee_id: attendeeId,
//             payment: paymentIntent
//                 ? {
//                     id: paymentIntent.id,
//                     amount: paymentIntent.amount,
//                     status: paymentIntent.status,
//                     created: new Timestamp(paymentIntent.created, 0)
//                 }
//                 : {
//                     id: attendeeId,
//                     amount: 0,
//                     status: 'succeeded',
//                     created: new Timestamp(Math.floor(Date.now() / 1000), 0)
//                 }
//         };

//         try {
//             const formData = new FormData();

//             formData.append('attendeeInfo', JSON.stringify(attendeeInfo));
//             formData.append('paymentInfo', JSON.stringify(paymentInfo));

//             if (files) {
//                 files.forEach((file: File) => {
//                     formData.append('files', file);
//                 });
//             }

//             const response = await fetch(
//                 `${import.meta.env.VITE_API_URL}/api/v1/events/${props.eventId}/registered`,
//                 {
//                     method: "POST",
//                     credentials: "include",
//                     body: formData
//                 }
//             );

//             if (!response.ok) {
//                 throw Error("Event registration failed. Contact tech@ubcpmc.com for support");
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     };

//     // what is this for?
//     useEffect(() => {
//         setUserInfo({...userInfo, ...userData});
//     }, [props.isModalOpen]);

//     const stepComponents = [
//         <EventRegistrationSignIn
//             isOpen={props.isModalOpen}
//             onRequestClose={() => props.setIsModalOpen(false)}
//             onSignInOrCreateAccount={() => navigateTo("/")}
//             onContinueAsGuest={handleContinueAsGuest}
//         />,
//         <EventRegistrationGuest onSubmit={handleSubmitGuest}/>,
//         <EventRegistrationForm
//           onSubmit={(data: any, files: File[]) => handleSubmitEventRegInfo(data as EventRegFormSchema, files)}
//           formId={props.formId}
//         />,
//         <EventPayment
//             onPaymentSuccess={handlePaymentSuccess}
//             isGuest={isGuest}
//             eventId={props.eventId}
//             nonMemberPrice={props.nonMemberPrice}
//             memberPrice={props.memberPrice}
//         />,
//     ];

//     function handleClick(event: React.MouseEvent<HTMLDivElement>) {
//         event.stopPropagation();
//     }

//     function handleClose() {
//         if (isGuest) {
//             setIsGuest(false);
//         }
//         setStep(isSignedIn ? 2 : 0);
//         props.setIsModalOpen(false);
//     }

//     return (
//         <Modal
//             isOpen={props.isModalOpen}
//             onRequestClose={handleClose}
//             className="event-registration-modal"
//             overlayClassName="event-registration-modal-overlay"
//         >
//             <div className={"event-registration-modal-content"} onClick={handleClick}>
//                 {stepComponents[step]}
//             </div>
//         </Modal>
//     );
// }
