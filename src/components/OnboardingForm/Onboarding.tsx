import "./Onboarding.css"
import PMCLogo from "../../assets/pmclogo.svg"
import OnboardingForm from "./OnboardingForm"
import {useState} from "react"
import Payment from "../Payment/Payment"
import {OnboardingProvider} from "./Context"
import {loginBody, onboardingBody} from "../../types/api"
import {UserSchema} from "./types"
import {PaymentProvider} from "../../providers/Payment/PaymentProvider"
import FF from "../../../feature-flag.json"
import PaymentSuccess from "../Payment/PaymentSuccess"
import {useAuth0} from "@auth0/auth0-react";
import {useAuth} from "../../providers/Auth/AuthProvider";

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
    // a lot of type duplication for userInfo. Improve this in the future
    const [userInfo, setUserInfo] = useState<UserSchema | undefined>(undefined)
    const [currPage, setCurrPage] = useState<"userInfo" | "payment" | "paymentSuccess">("userInfo")
    const [paid, setPaid] = useState<boolean>(false)
    const {user, getIdTokenClaims} = useAuth0()
    const {userData, setUserData} = useAuth()

    async function addUser(userInfo: UserSchema | undefined) {
        const onboardRequestBody = await buildOnboardingRequest(userInfo);
        await addUserInDatabase(onboardRequestBody);
        setUserData({...userData!, ...userInfo});
    }

    async function buildOnboardingRequest(userInfo: UserSchema | undefined) {
        const claims = await getIdTokenClaims();
        if (!user || !user.sub || !claims?.__raw) {
            throw new Error("Unable to retrieve user credentials.");
        }

        const idToken = claims.__raw;
        const creds: loginBody = {
            userUID: user.sub,
            idToken: idToken
        }
        const onboardBody: onboardingBody = {
            creds: creds, // Must be user's UID and idToken
            userDoc: {
                ...userInfo!,
                displayName: user.name!,
                email: user.email!,
                pfp: user.picture!,
                onboarded: true,
            }
        }
        if (!FF.stripePayment) {
            onboardBody.userDoc.paymentVerified = false;
        }
        return onboardBody;
    }

    async function addUserInDatabase(onboardBody: onboardingBody) {
        try {
            const onboardUser = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(onboardBody)
            })
            if (!onboardUser.ok) {
                throw Error("Failed adding user to database")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onPaymentSuccess = () => {
        addUser(userInfo)
        setPaid(true)
    }

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <img className="onboarding-content--logo" src={PMCLogo}/>
                {paid
                    ? <h1 className="onboarding-content-header">Welcome to PMC {userInfo?.first_name}! <span style={{fontSize: 'x-large'}}>🥳</span></h1>
                    : <h1 className="onboarding-content-header">Become a member</h1>}
                {/* Toggle between onboardingform/paymentform */}
                {/* Use Context to keep track of current state */}
                <OnboardingProvider setters={{setUserInfo, setCurrPage}}>
                    {currPage == "payment" ?
                        <PaymentProvider
                            FormOptions={{
                                prompt: "To become a PMC member for the 2024/2025 academic year, a $10 membership fee is required.",
                                type: "membership",
                                amt: 1000,
                                onSuccess: onPaymentSuccess
                            }} SuccessOptions={{
                            heading: `${!FF.stripePayment ? "Information recorded" : "Payment successful"}`,
                            subheading: `${!FF.stripePayment ? "We've recorded your information. We will email you once we've verified your payment." : "We've processed your $10 charge."}`,
                            continueBtnText: `${!FF.stripePayment ? "Continue to dashboard as a guest" : "Continue to dashboard"}`
                        }}
                        >
                            {!FF.stripePayment ? <PaymentSuccess/> : <Payment/>}
                        </PaymentProvider>
                        :
                        <OnboardingForm addUser={addUser}/>
                    }
                </OnboardingProvider>
            </div>
        </div>
    )
}