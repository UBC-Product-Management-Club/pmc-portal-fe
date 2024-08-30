import {useAuth} from "../../providers/Auth/AuthProvider";
import {useState} from "react";
import {EventCard} from "../../components/Event/EventCard";
import {eventType} from "../../types/api";
import {useNavigate} from "react-router-dom";

export function Profile() {
    const {currentUser} = useAuth();
    const navigateTo = useNavigate();
    const [events] = useState<eventType[]>([]);

    return (
        <div>
            <div className={"profile-row"}>
                <img/>
                <h2>Name</h2>
                <div className={"profile-pill"}>
                    <img/>
                    <p>University</p>
                </div>
                <div className={"profile-pill"}>
                    <img/>
                    <p>Year, Faculty, Major</p>
                </div>
            </div>

            <div className={"profile-row"}>
                <h3>Why Product Management?</h3>
                <div className={"profile-pill-sm"}>
                    <p>Edit</p>
                    <img/>
                </div>
                <p className={"profile-why-pm"}></p>
            </div>

            <div>
                <h3>Events Registered</h3>
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.event_Id}
                            currentUser={currentUser}
                            event={event}
                            onClick={() => {navigateTo(`/events/${event.event_Id}`);}}
                            onRegister={(e) => e.stopPropagation()}
                        />
                    ))
                ) : (
                    <p style={{ color: "white" }}>No events found.</p>
                )}
            </div>
        </div>
    )
}