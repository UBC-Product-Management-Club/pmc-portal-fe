import "./Onboarding.css"
import PMCLogo from "../../assets/pmclogo.svg"
import OnboardingForm from "./OnboardingForm"
import {useContext, useState} from "react"
import Payment from "../Payment/Payment"
import {OnboardingProvider} from "./Context"
import {addTransactionBody, loginBody, onboardingBody, } from "../../types/api"
import {UserSchema} from "./types"
import {PaymentProvider} from "../../providers/Payment/PaymentProvider"
import {useAuth0} from "@auth0/auth0-react";
import {IoArrowBack} from "react-icons/io5";
import { PaymentIntent } from "@stripe/stripe-js"
import { Timestamp } from "firebase/firestore"
import { ActionTypes, UserDataContext } from "../../providers/UserData/UserDataProvider"

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
    const { user: auth0User, logout, getIdTokenClaims} = useAuth0()
    const { user, update } = useContext(UserDataContext)

    const handleBackToLogin = async () => {
        await logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }

    async function onboardUser(userInfo: UserSchema | undefined, paymentInfo: addTransactionBody) {
        const onboardRequestBody = await buildOnboardingRequest(userInfo);
        await addUserInDatabase(onboardRequestBody, paymentInfo);
        if (userInfo) {
            update({ type: ActionTypes.UPDATE, payload: userInfo })
        }
        // setUserData({...userData!, ...userInfo});
    }

    async function buildOnboardingRequest(userInfo: UserSchema | undefined) {
        const claims = await getIdTokenClaims();
        if (!auth0User|| !auth0User.sub || !claims?.__raw) {
            throw new Error("Unable to retrieve user credentials.");
        }

        const idToken = claims.__raw;
        const creds: loginBody = {
            userUID: auth0User.sub,
            idToken: idToken
        }
        const onboardBody: onboardingBody = {
            creds: creds, // Must be user's UID and idToken
            userDoc: {
                ...userInfo!,
                displayName: user?.displayName,
                email: user?.email,
                pfp: user?.pfp,
                onboarded: true,
            }
        }
        return onboardBody;
    }

    async function addUserInDatabase(onboardBody: onboardingBody, paymentInfo: addTransactionBody) {
        try {
            const onboardUser = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboard`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    onboardingInfo: onboardBody,
                    paymentInfo: paymentInfo
                })
            })
            if (!onboardUser.ok) {
                throw Error("Failed adding user to database")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onPaymentSuccess = (paymentIntent: PaymentIntent | null) => {
        const paymentInfo: addTransactionBody = {
            type: "membership",
            member_id: auth0User?.sub || "",
            payment: {
                id: paymentIntent!.id,
                amount: paymentIntent!.amount,
                status: paymentIntent!.status,
                created: new Timestamp(paymentIntent!.created,0)
            }
        }

        try {
            onboardUser(userInfo, paymentInfo)
            setPaid(true)
        } catch (error) {
            console.error(error)
        }
    }

    if (user) {
        return (
            <div className="onboarding-container">
                <div className="onboarding-content">
                    <div className={"onboarding-row"} onClick={handleBackToLogin}>
                        <IoArrowBack/>
                        <p>Back</p>
                    </div>
                    <img className="onboarding-content--logo" src={PMCLogo}/>
                    {paid
                        ? <h1 className="onboarding-content-header">Welcome to PMC {user.firstName}! <span
                            style={{fontSize: 'x-large'}}>🥳</span></h1>
                        : <h1 className="onboarding-content-header">Let's get you signed up, {user.displayName}</h1>}
                    {/* Toggle between onboardingform/paymentform */}
                    {/* Use Context to keep track of current state */}
                    <OnboardingProvider setters={{setUserInfo, setCurrPage}}>
                        {currPage == "payment" ?
                            <PaymentProvider
                                FormOptions={{
                                    prompt: `To become a PMC member for the 2024/2025 academic year, a $${userInfo?.university === "University of British Columbia" ? 10.61 : 15.76} membership fee is required.`,
                                    type: "membership",
                                    amt: userInfo?.university === "University of British Columbia" ? 10.61 : 15.76,
                                    onSuccess: onPaymentSuccess,
                                    footer: `Disclaimer: \n
                                            While membership grants you access to our exclusive resources, please note that it does not automatically secure a spot at our events. Due to limited availability, we encourage you to sign up early to secure your participation.`
                                }}
                                SuccessOptions={{
                                    heading: "Payment successful",
                                    subheading: "We've processed your charge.",
                                    continueBtnText: "Continue to dashboard"
                                }}
                            >
                                <Payment />
                            </PaymentProvider>
                            :
                            <OnboardingForm />
                        }
                    </OnboardingProvider>
                </div>
            </div>
        )
    }

    return <></>
}