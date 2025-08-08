import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import moment from 'moment';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { type Event } from '../../types/Event';
import { useEvents } from '../../hooks/useEvents';
import { styled } from 'styled-components';
import { MdOutlinePeopleAlt } from 'react-icons/md';

const EventHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 1rem;
    @media screen and (max-width: 1350px) {
        flex-direction: column;
    }
`;

const DetailsContainer = styled.div`
    width: 50%;
    @media screen and (max-width: 1350px) {
        width: 100%;
    }
`;

const Thumbnail = styled.img`
    border-radius: 8px;
    max-width: 50%;
    padding: 1rem;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    margin: auto;
`;

const Title = styled.h1`
    color: #ffffff;
    font-size: xx-large;
    font-weight: bold;
`;

const Details = styled.div`
    display: flex;
    padding: 1.5rem;
    border: 1px solid #a9a9a9;
    border-radius: 12px;
    text-align: left;
    align-items: flex-start;
    flex-wrap: wrap;
    color: white;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: space-between;
`;

const DetailRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

const DetailText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    h4,
    p {
        margin: 0;
    }
`;

const RegisterButton = styled.button`
    width: 100%;
    color: #1c1c1c;
    border-radius: 20px;
    font-weight: 500;
    font-family: inherit;
    background: #f0f0f0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    margin-top: 1rem;
    transition: border-color 0.2s;
    &:hover {
        border-color: black;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    }
    &:disabled {
        background: gray;
        cursor: not-allowed;
        color: LightGray;
    }
`;

const Description = styled.div`
    padding: 1rem;
    text-align: left;
    & > h1 {
        color: #ffffff;
        font-size: x-large;
        font-weight: bold;
    }

    & > p {
        color: var(--pmc-midnight-grey);
    }
`;

interface DetailRow {
    icon: ReactNode;
    text: string;
    subtext?: string | ReactNode;
}

function Detail(props: DetailRow) {
    return (
        <DetailRow>
            {props.icon}
            <DetailText>
                <h4>{props.text}</h4>
                {props.subtext && <p>{props.subtext}</p>}
            </DetailText>
        </DetailRow>
    );
}

interface EventProps {
    eventInfo?: ReactNode;
}

export default function Event(props: EventProps) {
    const { user } = useUserData();
    const eventService = useEvents();
    const [event, setEvent] = useState<Event | undefined>();
    const { event_id } = useParams<{ event_id: string }>();
    const mapRef = useRef<HTMLIFrameElement | null>(null);
    const scrollToMap = () => mapRef!.current!.scrollIntoView({ behavior: 'smooth' });

    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState<{ message: string }>();

    const getButtonText = useCallback(() => {
        if (event) {
            if (event.registered === event.maxAttendees) {
                return 'Sorry! This event is full';
            } else if (isRegistered) {
                return "You're already registered.";
            } else {
                return 'Register now!';
            }
        }
    }, [event, isRegistered]);

    useEffect(() => {
        console.log(event_id);
        if (event_id) {
            eventService
                .getById(event_id, user ? user.userId! : '')
                .then((response) => {
                    console.log(response);
                    setEvent(response.event);
                    setIsRegistered(response.registered);
                })
                .catch((e: { message: string }) => {
                    setError(e);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) return <p style={{ color: 'white' }}>Loading...</p>;
    if (error) return <p>an error occurred fetching event details... try refreshing.</p>;
    if (!event) return <p style={{ color: 'white' }}>No event details available.</p>;

    return (
        <>
            <EventHeader>
                <Thumbnail src={event.thumbnail} alt="Event" />
                <DetailsContainer>
                    <Title>{event.name}</Title>
                    <Details>
                        <Detail
                            icon={<CiCalendar size={30} />}
                            text={moment(event.startTime).format('dddd, Do MMMM yyyy')}
                            subtext={`${moment(event.startTime).format('h:ma')} - ${moment(event.endTime).format('h:ma')}`}
                        />
                        <Detail
                            icon={<CiLocationOn size={30} />}
                            text={event.location}
                            subtext={
                                <span style={{ cursor: 'pointer' }} onClick={scrollToMap}>
                                    Get directions
                                </span>
                            }
                        />
                        <Detail
                            icon={<MdOutlinePeopleAlt size={30} />}
                            text={`${event.maxAttendees - event.registered}/${event.maxAttendees} spots left!`}
                            subtext={'Register now!'}
                        />
                        <Detail
                            icon={<FaDollarSign size={30} />}
                            text={`Member price: ${event.memberPrice}$`}
                            subtext={`Non-member price: ${event.nonMemberPrice}$`}
                        />
                    </Details>
                    <RegisterButton
                        disabled={event.registered === event.maxAttendees || isRegistered}
                        onClick={() => {}}
                    >
                        {getButtonText()}
                    </RegisterButton>
                </DetailsContainer>
            </EventHeader>
            <Description>
                <h1>About the event</h1>
                {props.eventInfo ? props.eventInfo : <p>{event.description}</p>}
                <h1>Location</h1>
                <iframe
                    ref={mapRef}
                    width="100%"
                    height="250"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${event.location}`}
                />
            </Description>
        </>
    );
}

// <EventDetails>
//     <div className="event-details-container">
//         <div className="event-details">
//             <div className="icon-text">
//                 <div className="icon">
//                     <CiCalendar />
//                 </div>
//                 <div className="text-container">
//                     {/* Will display date as "Sun, December 1" or "Sat, November 30" */}
//                     <h3>{moment(event.date).format('ddd, MMMM D')}</h3>
//                     {/* Displays time in 24 hours as hh:mm - hh:mm*/}
//                     <h4>{toTimeString(event.start_time, event.end_time)}</h4>
//                 </div>
//             </div>
//             <div className="icon-text">
//                 <div className="icon">
//                     <CiLocationOn />
//                 </div>
//                 <div className="text-container">
//                     <h3>{event.location}</h3>
//                     <h4>Get directions</h4>
//                 </div>
//             </div>
//             {/* <div className="icon-text">
//                 <div className="icon"><MdOutlinePeopleAlt/></div>
//                 <div className="text-container">
//                     <div>
//                         <h3>
//                             {event.maxAttendee === -1
//                                 ? 'Unlimited spots'
//                                 : `${event.maxAttendee - event.attendee_Ids.length}/${event.maxAttendee} spots left`
//                             }
//                         </h3>
//                         {event.attendee_Ids.length > 0 ? (
//                             <h4>Register now!</h4>
//                         ) : (
//                             <h4>Be the first to sign up!</h4>
//                         )}
//                     </div>
//                 </div>
//             </div> */}
//             {/* <div className="icon-text">
//                 <div className="icon"><PiLinkSimpleLight /></div>
//                 <div className="text-container">
//                     <h3>{event.name} Page</h3>
//                     <h4>www.{event.name}.com</h4>
//                 </div>
//             </div> */}
//         </div>
//     </div>
//     <div className="event-details-container">
//         <div className="event-details">
//             <div className="icon-text">
//                 <div className="icon">
//                     <FaDollarSign />
//                 </div>
//                 <div className="text-container" style={{ flexDirection: 'column' }}>
//                     {user ? (
//                         <>
//                             <h3>Event Pricing</h3>
//                             <h4>
//                                 Member: $
//                                 {event.member_price !== undefined
//                                     ? event.member_price.toFixed(2)
//                                     : 'N/A'}
//                             </h4>
//                         </>
//                     ) : (
//                         <>
//                             <h3>Event Pricing</h3>
//                             <h4>
//                                 Member: $
//                                 {event.member_price !== undefined
//                                     ? event.member_price.toFixed(2)
//                                     : 'N/A'}
//                                 , Non-member: $
//                                 {event.non_member_price !== undefined
//                                     ? event.non_member_price.toFixed(2)
//                                     : 'N/A'}
//                             </h4>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
//     <button
//         className="signup-button"
//         disabled={isEventFull || isRegistered}
//         onClick={() => {}}
//         // onClick={() => setIsSignUpFormOpen(true)}
//     >
//         {getButtonText()}
//     </button>
//     {/* <EventRegistrationModal
//         isModalOpen={isSignUpFormOpen}
//         setIsModalOpen={setIsSignUpFormOpen}
//         eventId={event_id ?? ""}
//         memberPrice={event.member_price}
//         nonMemberPrice={event.non_member_price}
//         formId={event.eventFormId}
//     /> */}
// </EventDetails>
