import "./EventCard.css";
import {User} from "firebase/auth";
import {eventType} from "../../types/api";
import {MouseEventHandler} from "react";

type EventCardProps = {
    currentUser: User | null,
    event: eventType,
    onClick: () => void,
    onRegister?: MouseEventHandler<HTMLButtonElement>
}

export function EventCard(props: EventCardProps) {
    return (
        <div>
            <h2>{new Date(props.event.date).toDateString()}</h2>
            <div className={`event ${
                !props.currentUser && !props.event.non_member_price ? "disabled-card" : ""
            }`}
                 onClick={props.onClick}
            >
                <div className={"card-container"}>
                    <div className={"event-col"}>
                        <p className="event-time-loc">7:00 PM | {props.event.location}</p>
                        <h2>{props.event.name}</h2>
                        <p className="event-description">{props.event.description}</p>
                        {props.onRegister &&
                            <button
                                className="event-button"
                                onClick={props.onRegister}
                            >
                                Register
                            </button>}
                        {!props.event.non_member_price && !props.currentUser && (
                            <div className="overlay">
                                <p className="disabled-comment">
                                    Please sign in to your PMC account to view the details
                                    for this event.
                                </p>
                            </div>
                        )}
                        {/*</div>*/}
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