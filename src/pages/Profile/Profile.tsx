import "./Profile.css"
import {useAuth} from "../../providers/Auth/AuthProvider";
import {useState} from "react";
import {EventCard} from "../../components/Event/EventCard";
import {eventType} from "../../types/api";
import {useNavigate} from "react-router-dom";
import {FiBook} from "react-icons/fi";
import {TbSchool} from "react-icons/tb";
import {ProfileWhyPM} from "../../components/Profile/ProfileWhyPM";

export function Profile() {
    const {currentUser, userData} = useAuth();
    const navigateTo = useNavigate();
    const [events] = useState<eventType[]>([]);

    return (
        <div className={"profile"}>
            <div className={"profile-space-around"}>
                <div className={"profile-picture-wrapper w-50"}>
                    <img className={"profile-picture"}
                         src={userData?.pfp}
                         alt={"Profile Picture"}/>
                </div>
                <div className={"w-50"}>
                    <div className={"profile-name-pronouns"}>
                        <h2>{userData?.first_name} {userData?.last_name}</h2>
                        <p>{userData?.pronouns}</p>
                    </div>
                    {userData?.university &&
                        <div className={"profile-pill"}>
                            <TbSchool/>
                            <p>{userData?.university}</p>
                        </div>
                    }
                    <div className={"profile-pill"}>
                        <FiBook/>
                        <p>Year {userData?.year}, {userData?.faculty}, {userData?.major}</p>
                    </div>
                </div>
            </div>

            <ProfileWhyPM/>

            <div>
                <h3>Events Registered</h3>
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.event_Id}
                            currentUser={currentUser}
                            event={event}
                            onClick={() => {
                                navigateTo(`/events/${event.event_Id}`);
                            }}
                            onRegister={(e) => e.stopPropagation()}
                        />
                    ))
                ) : (
                    <p style={{color: "white"}}>No events found.</p>
                )}
            </div>
        </div>
    )
}