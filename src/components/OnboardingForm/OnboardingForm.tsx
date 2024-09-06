import "./OnboardingForm.css";
import { useContext } from "react";
import { UserSchema } from "./types";
import { OnboardingContext } from "./Context";
import { UserDataForm } from "../UserDataForm/UserDataForm";
import { useAuth } from "../../providers/Auth/AuthProvider";
import FF from "../../../feature-flag.json";
import { addUser } from "./Onboarding";


export default function OnboardingForm() {
    const { currentUser, userData, setUserData } = useAuth();
    const { setUserInfo, setCurrPage } = useContext(OnboardingContext)
    const submit = async (data: UserSchema) => {
        // update parent state to save user input
        if (data.ubc_student == "yes")
            data.university = "University of British Columbia";
        setUserInfo(data)
        setUserData({ ...userData!, ...data })
        if (!FF.stripePayment) {
          addUser(currentUser, data)
          window.open("https://ubc-pmc.square.site", "_blank")
        }
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
  };

  return (
    <div className={"form-multi-cols"}>
      <UserDataForm onSubmit={submit} hasWaiver />
    </div>
  );
}
