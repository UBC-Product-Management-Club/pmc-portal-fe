import React, { useEffect, useState } from "react";
import EnterEmail, { localEmail } from "./EnterEmail";
import './MainQrPage.css';


export default function MainQRPage() {
    // const { isSignedIn } = useAuth();
    const [error, setError] = useState(false);
    useEffect(() => {
        if (localEmail != null) {
            const fetchEmail = async () => {
                try {
                    await EnterEmail();  // ✅ Try executing the function
                } catch (err) {
                    console.error("Error in enterEmail:", err);
                    setError(true);  // ✅ If an error occurs, update the state
                }
            };

            fetchEmail();
        }
    }, []);

    // otherwise, it just continues to the checked page
    return (
        <div className={"card-container"}>
            <div className={"raffle-card"}>
                {error ? (
                    <>
                        <div className="error-x-container">
                            <div className="error-x-circle">
                                <div className="error-x"></div>
                            </div>
                        </div>

                        <p className={"raffle-name"}> Oooops... something went wrong! </p>
                        <h3 className={"raffle-subtext"}> You have XX raffle tickets. </h3>
                    </>
                ) : (
                    <>
                        <div className="checkmark-container">
                            <div className="checkmark-circle">
                                <div className="checkmark-stroke"></div>
                            </div>
                        </div>


                        <p className={"raffle-name"}> 🎉 CONGRATULATIONS! 🎉 </p>
                        <h3 className={"raffle-subtext"}> You have XX raffle tickets. </h3>
                    </>
                )}
            </div>


            <button onClick={() => setError(!error)} className="test-error-button">
                {error ? "Reset" : "Trigger Error"}
            </button>
        </div>
    )

}

