import "./OnboardingForm.css"
import { useContext } from "react"
import { UserSchema } from "./types"
import { OnboardingContext } from "./Context"
import {UserDataForm} from "../UserDataForm/UserDataForm";

export default function OnboardingForm() {
    const { setUserInfo, setCurrPage } = useContext(OnboardingContext)
    const submit = async (data: UserSchema) => {
        // update parent state to save user input
        console.log()
        setUserInfo(data)
        setCurrPage("payment")
        // fetch onboarding endpoint
        // save state of current user info
        // const onboarding = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: {
        //         'Content-type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         creds: creds,
        //         userDoc: {
        //             displayName: user.displayName,
        //             email: user.email,
        //             pfp: user.photoURL,
        //             ...data
        //         }
        //     })
        // })


        // if (onboarding.ok) {
        //     // continue to payment
        //     // navigateTo("/dashboard")
        //     console.log("Go to PaymentForm")
        // } else {
        //     // show error component
        //     const jsonresp = await onboarding.json()
        //     console.log(jsonresp)

        // }
    }

    return (
        <div className={"form-multi-cols"}>
            <UserDataForm onSubmit={submit}/>
        </div>
    )
}