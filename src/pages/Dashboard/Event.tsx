import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { eventType } from "../../types/api";
import "./Event.css";
import { useAuth } from "../../providers/Auth/AuthProvider";
import { EventRegistrationModal } from "../../components/Event/EventRegistrationModal";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { PiLinkSimpleLight } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa6";

const Event: React.FC = () => {
    const { isSignedIn } = useAuth();
    const [event, setEvent] = useState<eventType | null>(null);
    const { event_id } = useParams<{ event_id: string }>();
    const [loading, setLoading] = useState(true);
    const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);
    let isEventFull = false;
    if (event) {
        isEventFull = event.maxAttendee !== null && event.attendee_Ids?.length >= event.maxAttendee;
    }



  async function fetchEvent() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/events/${event_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: eventType = await response.json();
      setEvent({
        ...data,
        date: new Date(data.date),
      });
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvent();
  }, [event_id]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (!event)
    return <p style={{ color: "white" }}>No event details available.</p>;

    return (
        <div className="background-event">
            <div className="event-container">
                <img src={event.media[0]} alt="Event" className="event-photo"></img>
                <div className="event-details-column">
                    <p className="event-title">{event.name}</p>
                    <div className="event-details-container">
                        <div className="event-details">
                            <div className="icon-text">
                                <div className="icon"><CiCalendar /></div>
                                <div className="text-container">
                                    <h3>{event.date.toDateString()}</h3>
                                    <h4>No time available yet</h4>
                                </div>
                            </div>
                            <div className="icon-text">
                                <div className="icon"><CiLocationOn /></div>
                                <div className="text-container">
                                    <h3>{event.location}</h3>
                                    <h4>Get directions</h4>
                                </div>
                            </div>
                            <div className="icon-text">
                                <div className="icon"><MdOutlinePeopleAlt /></div>
                                <div className="text-container">
                                    <div>
                                        <h3>{event.maxAttendee - event.attendee_Ids.length}/{event.maxAttendee} spots left</h3>
                                        {event.attendee_Ids.length >= 0 ? (
                                            <h4>Register now!</h4>
                                        ) : (
                                            <h4>Be the first to sign up!</h4>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="icon-text">
                                <div className="icon"><PiLinkSimpleLight /></div>
                                <div className="text-container">
                                    <h3>{event.name} Page</h3>
                                    <h4>www.{event.name}.com</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="event-details-container">
                        <div className="event-details">
                            <div className="icon-text">
                                <div className="icon"><FaDollarSign /></div>
                                <div
                                    className="text-container"
                                    style={{ flexDirection: "column" }}
                                >
                                    {isSignedIn ? (
                                        <>
                                            <h3>Event Pricing</h3>
                                            <h4>
                                                Member: $
                                                {event.member_price !== undefined
                                                    ? event.member_price.toFixed(2)
                                                    : "N/A"}
                                            </h4>
                                        </>
                                    ) : (
                                        <>
                                            <h3>Event Pricing</h3>
                                            <h4>
                                                Member: $
                                                {event.member_price !== undefined
                                                    ? event.member_price.toFixed(2)
                                                    : "N/A"}
                                                , Non-member: $
                                                {event.non_member_price !== undefined
                                                    ? event.non_member_price.toFixed(2)
                                                    : "N/A"}
                                            </h4>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="signup-button" disabled={isEventFull} onClick={() => setIsSignUpFormOpen(true)}>
                        {isEventFull ? <span className="signup-button-sorry-text">Sorry, the event is full</span> : <span className="signup-button-text">Sign up</span>}
                    </button>
                    <EventRegistrationModal
                        isModalOpen={isSignUpFormOpen}
                        setIsModalOpen={setIsSignUpFormOpen}
                        eventId={event_id ?? ""}
                        memberPrice={event.member_price}
                        nonMemberPrice={event.non_member_price}
                    />
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
