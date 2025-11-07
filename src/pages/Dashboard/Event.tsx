import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventType } from '../../types/api';
import './Event.css';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import moment from 'moment';
import { useUserData } from '../../providers/UserData/UserDataProvider';

const Event: React.FC = () => {
    const { user } = useUserData();
    const [event, setEvent] = useState<eventType | null>(null);
    const { event_id } = useParams<{ event_id: string }>();
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    let isEventFull = false;
    if (event) {
        isEventFull = event.maxAttendee !== -1 && event.attendee_Ids?.length >= event.maxAttendee;
    }

    async function fetchEvent() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/events/${event_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (user) {
                const isRegistered = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/events/${event_id}/attendees/isRegistered`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                        }),
                    }
                );
                const isRegisteredData = await isRegistered.json();
                setIsRegistered(isRegisteredData.isRegistered);
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: eventType = await response.json();
            setEvent({
                ...data,
                date: moment(data.date).toDate(),
            });
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    }

    // time_string = Thh:mm:ss
    // return hh:mm - hh:mm
    function toTimeString(start_time: string, end_time: string): string {
        const time_format: string = 'HH:mm';
        const start = moment(start_time, 'HH:mm:ss').format(time_format);
        const end = moment(end_time, 'HH:mm:ss').format(time_format);
        return start + ' - ' + end;
    }

    useEffect(() => {
        fetchEvent();
    }, [event_id]);

    const getButtonText = () => {
        switch (true) {
            case isEventFull:
                return <span className="signup-button-sorry-text">Sorry, the event is full</span>;
            case isRegistered:
                return <span className="signup-button-text">You've already registered</span>;
            default:
                return <span className="signup-button-text">Sign up</span>;
        }
    };

    if (loading) return <p style={{ color: 'white' }}>Loading...</p>;
    if (!event) return <p style={{ color: 'white' }}>No event details available.</p>;

    return (
        <div className="background-event">
            <div className="event-container">
                <img src={event.media[0]} alt="Event" className="event-photo"></img>
                <div className="event-details-column">
                    <p className="event-title">{event.name}</p>
                    <div className="event-details-container">
                        <div className="event-details">
                            <div className="icon-text">
                                <div className="icon">
                                    <CiCalendar />
                                </div>
                                <div className="text-container">
                                    {/* Will display date as "Sun, December 1" or "Sat, November 30" */}
                                    <h3>{moment(event.date).format('ddd, MMMM D')}</h3>
                                    {/* Displays time in 24 hours as hh:mm - hh:mm*/}
                                    <h4>{toTimeString(event.start_time, event.end_time)}</h4>
                                </div>
                            </div>
                            <div className="icon-text">
                                <div className="icon">
                                    <CiLocationOn />
                                </div>
                                <div className="text-container">
                                    <h3>{event.location}</h3>
                                    <h4>Get directions</h4>
                                </div>
                            </div>
                            {/* <div className="icon-text">
                                <div className="icon"><MdOutlinePeopleAlt/></div>
                                <div className="text-container">
                                    <div>
                                        <h3>
                                            {event.maxAttendee === -1 
                                                ? 'Unlimited spots'
                                                : `${event.maxAttendee - event.attendee_Ids.length}/${event.maxAttendee} spots left`
                                            }
                                        </h3>
                                        {event.attendee_Ids.length > 0 ? (
                                            <h4>Register now!</h4>
                                        ) : (
                                            <h4>Be the first to sign up!</h4>
                                        )}
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="icon-text">
                                <div className="icon"><PiLinkSimpleLight /></div>
                                <div className="text-container">
                                    <h3>{event.name} Page</h3>
                                    <h4>www.{event.name}.com</h4>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="event-details-container">
                        <div className="event-details">
                            <div className="icon-text">
                                <div className="icon">
                                    <FaDollarSign />
                                </div>
                                <div className="text-container" style={{ flexDirection: 'column' }}>
                                    {user ? (
                                        <>
                                            <h3>Event Pricing</h3>
                                            <h4>
                                                Member: $
                                                {event.member_price !== undefined
                                                    ? event.member_price.toFixed(2)
                                                    : 'N/A'}
                                            </h4>
                                        </>
                                    ) : (
                                        <>
                                            <h3>Event Pricing</h3>
                                            <h4>
                                                Member: $
                                                {event.member_price !== undefined
                                                    ? event.member_price.toFixed(2)
                                                    : 'N/A'}
                                                , Non-member: $
                                                {event.non_member_price !== undefined
                                                    ? event.non_member_price.toFixed(2)
                                                    : 'N/A'}
                                            </h4>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="signup-button"
                        disabled={isEventFull || isRegistered}
                        onClick={() => {}}
                        // onClick={() => setIsSignUpFormOpen(true)}
                    >
                        {getButtonText()}
                    </button>
                    {/* <EventRegistrationModal
                        isModalOpen={isSignUpFormOpen}
                        setIsModalOpen={setIsSignUpFormOpen}
                        eventId={event_id ?? ""}
                        memberPrice={event.member_price}
                        nonMemberPrice={event.non_member_price}
                        formId={event.eventFormId}
                    /> */}
                </div>
            </div>
            <div className="event-desc">
                <h3>About the event</h3>
                <p>{event.description}</p>
            </div>
        </div>
    );
};

export default Event;
