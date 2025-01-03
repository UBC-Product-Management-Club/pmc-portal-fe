import "./EventCard.css";
import {eventType} from "../../types/api";
import moment from "moment";

type EventCardProps = {
    isSignedIn: boolean;
    event: eventType;
    showRegister?: boolean;
    handleClick: () => void;
};

export function EventCard(props: EventCardProps) {
    return (
        <div>
            <h2>{moment(props.event.date).format('MMMM D, YYYY')}</h2>
            <div
                className={`event ${
                    !props.isSignedIn && props.event.non_member_price === undefined
                        ? "disabled-card"
                        : ""
                }`}
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
                                onClick={props.handleClick}

                            >
                                See more
                            </button>
                        )}
                        {props.event.non_member_price === undefined && !props.isSignedIn && (
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
