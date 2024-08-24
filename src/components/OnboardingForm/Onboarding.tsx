import "./Onboarding.css"
import PMCLogo from "../../assets/pmclogo.svg"
import OnboardingForm from "./OnboardingForm"
import { UserSchema } from "./types"
import { useEffect, useState } from "react"
import PaymentForm from "../Payment/Payment"
import { Elements } from "@stripe/react-stripe-js"
import Payment from "../Payment/Payment"


/**
 * 
 * @param user
 * The currently logged in user via Google SSO that needs to be onboarded 
 * 
 * @param creds
 * Login credentials such as userUID and idToken needed to exchange for session cookie. 
 * These credentials are needed as the login method is called after onboarding. 
 * This will log the user in after onboarding.
 * 
 */
export default function Onboarding() {
    const [userInfo, setUserInfo] = useState<UserSchema | undefined>(undefined)
    const [paid, setPaid] = useState<boolean>(false)
    const [isPaying, setIsPaying] = useState<boolean>(false) // user needs to input their data first then pay.

    useEffect(() => {
        // When user navigates back and userInfo is defined
        // Restart -> setUserInfo(undefined) so they can submit again
        if (!paid && userInfo) {
            setUserInfo(undefined)
        }
    }, [paid])

    useEffect(() => {
        if (userInfo) {
            console.log("user info set")
            setIsPaying(true)
            // user has filled in information, show payment form
        } 
        console.log(userInfo)

    },[userInfo])


    // ADDS USER TO DATABASE (DO THIS AFTER PAYMENT)
    // const onboarding = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
    //     method: "POST",
    //     credentials: "include",
    //     headers: {
    //         'Content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         creds: creds, userID and idToken both accessible from user object...
    //         userDoc: {
    //             displayName: user.displayName,
    //             email: user.email,
    //             pfp: user.photoURL,
    //             ...data
    //         }
    //     })
    // })
    
    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <img className="onboarding-content--logo" src={PMCLogo} />
                <h1 className="onboarding-content-header pmc-gradient-text">Become a member</h1>
                {/* Toggle between onboardingform/paymentform */}
                {isPaying ? 
                    <Payment /> 
                : 
                    <OnboardingForm setUserInfo={setUserInfo}/>
                }
            </div>
        </div>
    )
}