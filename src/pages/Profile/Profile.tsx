import "./Profile.css"
import {useAuth} from "../../providers/Auth/AuthProvider";
import {ChangeEvent, useState} from "react";
import {EventCard} from "../../components/Event/EventCard";
import {eventType} from "../../types/api";
import {useNavigate} from "react-router-dom";
import {FiBook} from "react-icons/fi";
import {MdOutlineEdit} from "react-icons/md";
import {TbSchool} from "react-icons/tb";

function ProfileWhyPM() {
    const {userData, setUserData} = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState("Why are you interested in Product Management…")

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value);
    }

    function handleEditButton() {
        if (isEditing) {
            setUserData({...userData!, why_pm: text});
        }
        setIsEditing(!isEditing);
    }

    return <div>
        <div className={"profile-space-between"}>
            <h3>Why Product Management?</h3>
            <button onClick={handleEditButton} className={"button-dark-purple profile-pill"}>
                <p>{isEditing ? 'Save' : 'Edit'}</p>
                <MdOutlineEdit/>
            </button>
        </div>
        <textarea className={"profile-why-pm"}
            value={text}
            onChange={handleChange}
            readOnly={!isEditing}
            rows={4}
            cols={50}
        />
    </div>;
}

export function Profile() {
    const {currentUser, userData} = useAuth();
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