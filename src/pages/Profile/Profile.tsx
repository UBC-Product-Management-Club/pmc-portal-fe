import "./Profile.css"
import {useAuth} from "../../providers/Auth/AuthProvider";
import {useState} from "react";
import {EventCard} from "../../components/Event/EventCard";
import {eventType} from "../../types/api";
import {useNavigate} from "react-router-dom";
import {FiBook} from "react-icons/fi";
import {MdOutlineEdit} from "react-icons/md";
import {TbSchool} from "react-icons/tb";

export function Profile() {
    const {currentUser} = useAuth();
    const navigateTo = useNavigate();
    const [events] = useState<eventType[]>([]);

    return (
        <div className={"profile"}>
            <div className={"profile-space-around"}>
                <div className={"profile-picture-wrapper w-50"}>
                <img className={"profile-picture"}
                    src={"https://i.natgeofe.com/n/23a85f5b-32be-4bc1-af13-3e1a403b8557/mountain-gorilla_thumb_square.jpg"}
                    alt={"Profile Picture"}/>
                </div>
                <div className={"w-50"}>
                    <div className={"profile-name-pronouns"}>
                        <h2>Name</h2>
                        <p>(pronouns)</p>
                    </div>
                    <div className={"profile-pill"}>
                        <TbSchool/>
                        <p>University</p>
                    </div>
                    <div className={"profile-pill"}>
                        <FiBook/>
                        <p>Year, Faculty, Major</p>
                    </div>
                </div>
            </div>

            <div className={"profile-space-between"}>
                <h3>Why Product Management?</h3>
                <div className={"profile-pill"}>
                    <p>Edit</p>
                    <MdOutlineEdit/>
                </div>
            </div>
            <p className={"profile-why-pm"}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>

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