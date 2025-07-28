import { ChangeEvent, useEffect, useState } from 'react';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { styled } from 'styled-components';

// import {MdOutlineEdit} from "react-icons/md";

const ProfileSpaceBetween = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ProfileWhyPmTextArea = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #333d6c;
    border-radius: 0.5rem;
    padding: 1.5rem;
    background-color: transparent;
    color: white;
    resize: none;
    font-family: inherit;
`;

export function ProfileWhyPM() {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUserData();
    const [isEditing] = useState(false);
    const [text, setText] = useState('Why are you interested in Product Management…');

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
        if (user && user.whyPm) {
            setText(user.whyPm);
            setIsLoading(false);
        }
    }, [user, isLoading]);

    return (
        <div>
            <ProfileSpaceBetween>
                <h3>Why Product Management?</h3>
                {/*TODO: re-add button once we get backend update endpoint working*/}
                {/*<button onClick={handleEditButton} className={"button-dark-purple profile-pill"}>*/}
                {/*    <p>{isEditing ? 'Save' : 'Edit'}</p>*/}
                {/*    <MdOutlineEdit/>*/}
                {/*</button>*/}
            </ProfileSpaceBetween>
            <ProfileWhyPmTextArea
                value={text}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={4}
                cols={50}
            />
        </div>
    );
}
