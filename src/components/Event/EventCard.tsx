import "./EventCard.css";
import { User } from "firebase/auth";
import { eventType } from "../../types/api";
import React, { useState } from "react";
import { EventRegistrationModal } from "./EventRegistrationModal";
import { useNavigate } from "react-router-dom";

type EventCardProps = {
  currentUser: User | null;
  event: eventType;
  onClick: () => void;
  showRegister?: boolean;
};

export function EventCard(props: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigateTo = useNavigate()

  return (
    <div>
      <h2>{new Date(props.event.date).toDateString()}</h2>
      <div
        className={`event ${!props.currentUser && !props.event.non_member_price
          ? "disabled-card"
          : ""
          }`}
        onClick={props.onClick}
      >
        <div className={"card-container"}>
          <div className={"event-col"}>
            <p className="event-time-loc">7:00 PM | {props.event.location}</p>
            <p className="event-name">{props.event.name}</p>
            <p className="event-description">{props.event.description}</p>

            {props.showRegister && (
              <button
                className={`event-button ${props.event.maxAttendee !== null &&
                  props.event.attendee_Ids?.length >= props.event.maxAttendee
                  ? "disabled-button"
                  : ""
                  }`}
                onClick={() => {
                  navigateTo(`/events/${props.event.event_Id}`);
                }
                }

              >
                see more
              </button>
            )}

            <EventRegistrationModal
              eventId={props.event?.event_Id}
              memberPrice={props.event?.member_price}
              nonMemberPrice={props.event?.non_member_price}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
            {!props.event.non_member_price && !props.currentUser && (
              <div className="overlay">
                <p className="disabled-comment">
                  Please sign in to your PMC account to view the details for
                  this event.
                </p>
              </div>
            )}
          </div>
          <div className={"event-col"}>
            <img
              src={props.event.media[0]}
              alt="Event"
              className={"event-image"}
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
