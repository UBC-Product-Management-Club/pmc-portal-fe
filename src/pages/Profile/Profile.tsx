import "./Profile.css"
import {FiBook} from "react-icons/fi";
import {TbSchool} from "react-icons/tb";
import {ProfileWhyPM} from "../../components/Profile/ProfileWhyPM";
import ProfileEvents from "../../components/Profile/ProfileEvents";
import {useAuth0} from "@auth0/auth0-react";

export function Profile() {
    const {user} = useAuth0();

    return (
        <div className={"profile"}>
            <div className={"profile-space-around"}>
                <div className={"profile-picture-wrapper w-50"}>
                    <img className={"profile-picture"}
                         src={user?.picture}
                         alt={"Profile Picture"}/>
                </div>
                <div className={"w-50"}>
                    <div className={"profile-name-pronouns"}>
                        <h2>{user?.name}</h2>
                        <p>{user?.user_metadata.pronouns}</p>
                    </div>
                    {user?.user_metadata.university &&
                        <div>
                            <div className={"profile-pill"}>
                                <TbSchool/>
                                <p>{user?.user_metadata.university}</p>
                            </div>
                            <div className={"profile-pill"}>
                                <FiBook/>
                                <p>Year {user?.user_metadata.year}, {user?.user_metadata.faculty}, {user?.user_metadata.major}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <ProfileWhyPM/>
            <ProfileEvents/>
        </div>
    )
}