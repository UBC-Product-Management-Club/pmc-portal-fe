import "./Profile.css"
import {useAuth} from "../../providers/Auth/AuthProvider";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {EventCard} from "../../components/Event/EventCard";
import {eventType} from "../../types/api";
import {useNavigate} from "react-router-dom";
import {FiBook} from "react-icons/fi";
import {MdOutlineEdit} from "react-icons/md";
import {TbSchool} from "react-icons/tb";

function ProfileWhyPM(props: { text: string, setText: Dispatch<SetStateAction<string>> }) {
    const [isEditing, setIsEditing] = useState(false);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        props.setText(event.target.value);
    }

    return <div>
        <div className={"profile-space-between"}>
            <h3>Why Product Management?</h3>
            <button onClick={() => setIsEditing(!isEditing)} className={"profile-pill"}>
                <p>{isEditing ? 'Save' : 'Edit'}</p>
                <MdOutlineEdit/>
            </button>
        </div>
        <textarea className={"profile-why-pm"}
            value={props.text}
            onChange={handleChange}
            readOnly={!isEditing}
            rows={4}
            cols={50}
        />
    </div>;
}

export function Profile() {
    const {currentUser} = useAuth();
    const navigateTo = useNavigate();
    const [events] = useState<eventType[]>([]);
    const [whyPM, setWhyPM] = useState("Why are you interested in Product Management…");

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

            <ProfileWhyPM text={whyPM} setText={setWhyPM}/>

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