import "./Profile.css"
import {FiBook} from "react-icons/fi";
import {TbSchool} from "react-icons/tb";
import {ProfileWhyPM} from "../../components/Profile/ProfileWhyPM";
import ProfileEvents from "../../components/Profile/ProfileEvents";
import { useContext } from "react";
import { UserDataContext } from "../../providers/UserData/UserDataProvider";

export function Profile() {
    const { user } = useContext(UserDataContext);

    return (user &&
        <div className={"profile"}>
            <div className={"profile-space-around"}>
                <div className={"profile-picture-wrapper w-50"}>
                    <img className={"profile-picture"}
                         src={user.pfp}
                         alt={"Profile Picture"}/>
                </div>
                <div className={"w-50"}>
                    <div className={"profile-name-pronouns"}>
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>{user.pronouns}</p>
                    </div>
                    {user.university &&
                        <div>
                            <div className={"profile-pill"}>
                                <TbSchool/>
                                <p>{user.university}</p>
                            </div>
                            <div className={"profile-pill"}>
                                <FiBook/>
                                <p>Year {user.year}, {user.faculty}, {user.major}</p>
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