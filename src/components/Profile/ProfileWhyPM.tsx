import {useAuth} from "../../providers/Auth/AuthProvider";
import {ChangeEvent, useEffect, useState} from "react";
// import {MdOutlineEdit} from "react-icons/md";

export function ProfileWhyPM() {
    const [isLoading, setIsLoading] = useState(true);
    // const {userData, setUserData} = useAuth();
    // const [isEditing, setIsEditing] = useState(false);

    const {userData} = useAuth();
    const [isEditing] = useState(false);
    const [text, setText] = useState("Why are you interested in Product Management…")

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value);
    }

    // function handleEditButton() {
    //     if (isEditing) {
    //         setUserData({...userData!, why_pm: text});
    //     }
    //     setIsEditing(!isEditing);
    // }

    useEffect(() => {
        if (!isLoading) return;
        if (userData && userData.why_pm) {
            setText(userData.why_pm);
            setIsLoading(false);
        }
    }, [userData, isLoading])

    return <div>
        <div className={"profile-space-between"}>
            <h3>Why Product Management?</h3>
            {/*TODO: re-add button once we get backend update endpoint working*/}
            {/*<button onClick={handleEditButton} className={"button-dark-purple profile-pill"}>*/}
            {/*    <p>{isEditing ? 'Save' : 'Edit'}</p>*/}
            {/*    <MdOutlineEdit/>*/}
            {/*</button>*/}
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