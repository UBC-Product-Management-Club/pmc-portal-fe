import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventType } from "../../types/api";
import "./Event.css";
import "./Dashboard.css";
import PMCLogo from "../../assets/pmclogo.svg";
import { useAuth } from "../../providers/Auth/AuthProvider";
import {EventRegistrationModal} from "../../components/Event/EventRegistrationModal";

const Event: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [event, setEvent] = useState<eventType | null>(null);
  const { event_id } = useParams<{ event_id: string }>();
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);

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

  async function authButtonHandler() {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const displayName = currentUser.displayName;

        await logout();

        if (uid) {
          localStorage.removeItem(uid);
        }
        if (displayName) {
          localStorage.removeItem(displayName);
        }
      }

      navigateTo("/");
    } catch (error) {
      console.error("Error signing out: ", error);
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
      <div className="header">
        <div className="header-icon">
          <a href="/">
            <img src={PMCLogo} className="logo" />
          </a>
        </div>
        <nav className="header-nav">
          <a href="/dashboard" className="header-link">
            Events
          </a>
          <div>
            {currentUser != null ? (
              <a href="/profile" className="header-link">
                Profile
              </a>
            ) : (
              <a href="/" className="header-link">
                Profile
              </a>
            )}
          </div>
          <div className="header-button">
            <div onClick={authButtonHandler}>
              {currentUser ? "Sign out" : "Sign in"}
            </div>
          </div>
        </nav>
      </div>

      <div className="event-container">
        <h2 className="event-title">{event.name}</h2>
        <div className="event-details-container">
          <div className="event-details">
            <div className="icon-text">
              <div className="icon">📅</div>
              <div className="text-container">
                <h3>{event.date.toDateString()}</h3>
                <h4>No time available yet</h4>
              </div>
            </div>
            <div className="icon-text">
              <div className="icon">📍</div>
              <div className="text-container">
                <h3>{event.location}</h3>
                <h4>Get directions</h4>
              </div>
            </div>
            <div className="icon-text">
              <div className="icon">👥</div>
              <div className="text-container">
                {event.attendees ? (
                  <div>
                    <h3>{50 - event.attendees.length}/50 spots left</h3>
                    {event.attendees.length >= 0 ? (
                      <h4>Register now!</h4>
                    ) : (
                      <h4>Be the first to sign up!</h4>
                    )}
                  </div>
                ) : (
                  <h3>Be the first to sign up!</h3>
                )}
              </div>
            </div>
            <div className="icon-text">
              <div className="icon">🔗</div>
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
              <div className="icon">💳</div>
              <div
                className="text-container"
                style={{ flexDirection: "column" }}
              >
                {currentUser != null ? (
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
      </div>

      <button className="signup-button" onClick={() => setIsSignUpFormOpen(true)}>Sign up</button>
      <EventRegistrationModal
          isModalOpen={isSignUpFormOpen}
          setIsModalOpen={setIsSignUpFormOpen}
          eventId={event_id ?? ""}/>
      
      <img src={event.media[0]} alt="Event" className="event-photo"></img>
      <div className="event-desc">
        <h3>About the event</h3>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default Event;
