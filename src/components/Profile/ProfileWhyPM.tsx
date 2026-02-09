import { ChangeEvent, useEffect, useState } from 'react';
import { useUserData } from '../../providers/UserData/UserDataProvider';

// import {MdOutlineEdit} from "react-icons/md";

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
    const headerRowClass = 'flex flex-row items-center justify-between';
    const textAreaClass =
        'w-full resize-none rounded-2xl border border-white/10 bg-[var(--pmc-midnight-blue)]/30 p-6 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pmc-blue/60';

    return (
        <div className="flex flex-col gap-4">
            <div className={headerRowClass}>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        About you
                    </p>
                    <h3 className="text-lg font-semibold sm:text-xl">Why Product Management?</h3>
                </div>
                {/*TODO: re-add button once we get backend update endpoint working*/}
                {/*<button onClick={handleEditButton} className={"button-dark-purple profile-pill"}>*/}
                {/*    <p>{isEditing ? 'Save' : 'Edit'}</p>*/}
                {/*    <MdOutlineEdit/>*/}
                {/*</button>*/}
            </div>
            <textarea
                className={textAreaClass}
                value={text}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={4}
                cols={50}
            />
        </div>
    );
}
