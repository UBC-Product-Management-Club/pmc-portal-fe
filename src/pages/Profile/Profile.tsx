import "./Profile.css"
import {useAuth} from "../../providers/Auth/AuthProvider";
import {FiBook} from "react-icons/fi";
import {TbSchool} from "react-icons/tb";
import {ProfileWhyPM} from "../../components/Profile/ProfileWhyPM";
import ProfileEvents from "../../components/Profile/ProfileEvents";

export function Profile() {
    const {userData} = useAuth();

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
                        <div>
                            <div className={"profile-pill"}>
                                <TbSchool/>
                                <p>{userData?.university}</p>
                            </div>
                            <div className={"profile-pill"}>
                                <FiBook/>
                                <p>Year {userData?.year}, {userData?.faculty}, {userData?.major}</p>
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