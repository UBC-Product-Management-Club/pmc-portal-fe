import "./Onboarding.css"
import PMCLogo from "../../assets/pmclogo.svg"
import OnboardingForm from "./OnboardingForm"
import { useEffect, useState } from "react"
import Payment from "../Payment/Payment"
import { OnboardingProvider } from "./Context"
import { auth } from "../../../firebase"
import { User } from "firebase/auth"
import { addTransactionBody, loginBody, onboardingBody, paymentInfo } from "../../types/api"
import { Timestamp } from "firebase/firestore"
import PaymentSuccess from "../Payment/PaymentSuccess"
import { OnboardingFormSchema } from "./types"


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
    const [userInfo, setUserInfo] = useState<OnboardingFormSchema | undefined>(undefined) 
    const [currPage, setCurrPage] = useState<"userInfo" | "payment" | "paymentSuccess">("userInfo")
    const [payment, setPayment]= useState<paymentInfo | undefined>()

    useEffect(() => {
        const addUser = async () => {
            const user: User | null = auth.currentUser 
            if (!user) {
                // If for some reason the user isn't signed-in at this point, throw some error
                return 
            }

            const idToken = await user.getIdToken()
            const creds: loginBody = {
                userUID: user.uid,
                idToken: idToken
            }

            try {
                // Add user to the database
                const onboardBody: onboardingBody = {
                        creds: creds, // Must be user's UID and idToken 
                        userDoc: {
                            ...userInfo!,
                            displayName: user.displayName!,
                            email: user.email!,
                            pfp: user.photoURL!,
                        } 
                }
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

                const transaction: addTransactionBody = {
                    type: "membership",
                    member_id: user.uid,
                    payment: {
                        ... payment!,
                        created: new Timestamp(payment!.created,0)
                    }
                }
                const addTransaction = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/add-transaction`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(transaction)
                })
                if (!addTransaction.ok) {
                    throw Error("Failed adding transaction to database")
                }

                setCurrPage("paymentSuccess")
            } catch (error) {
                console.log(error)
                return
            }
        }
        if (payment) {
            // add user to db
            console.log("Adding user to db")
            console.log(`Welcome to PMC ${userInfo?.first_name}`)
            addUser()
        }
    }, [payment])



    // ADDS USER TO DATABASE (DO THIS AFTER PAYMENT)
    
    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <img className="onboarding-content--logo" src={PMCLogo} />
                { currPage == "paymentSuccess" ? 
                    <h1 className="onboarding-content-header pmc-gradient-text">Welcome to PMC {userInfo?.first_name}! <span style={{fontSize: 'x-large'}}>🥳</span></h1> 
                : 
                    <h1 className="onboarding-content-header pmc-gradient-text">Become a member</h1>}
                {/* Toggle between onboardingform/paymentform */}
                {/* Use Context to keep track of current state */}
                <OnboardingProvider setters={{ setUserInfo, setPayment, setCurrPage }} >
                    {currPage == "payment" ? 
                        <Payment /> 
                    : currPage == "paymentSuccess" ? 
                        // TODO: FINISH PAYMENT SUCCESS PAGE
                        <PaymentSuccess />
                    :
                        <OnboardingForm />
                    }
                </OnboardingProvider>
            </div>
        </div>
    )
}