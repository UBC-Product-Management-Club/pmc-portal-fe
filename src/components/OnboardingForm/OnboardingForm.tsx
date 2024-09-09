import "./OnboardingForm.css";
import { useContext } from "react";
import { UserSchema } from "./types";
import { OnboardingContext } from "./Context";
import { UserDataForm } from "../UserDataForm/UserDataForm";
import FF from "../../../feature-flag.json";

interface OnboardingFormProps {
    addUser: (userInfo: (UserSchema | undefined)) => Promise<void>
}

export default function OnboardingForm(props: OnboardingFormProps) {
    const { setUserInfo, setCurrPage } = useContext(OnboardingContext)
    const submit = async (data: UserSchema) => {
        // update parent state to save user input
        if (data.ubc_student == "yes")
            data.university = "University of British Columbia";
        setUserInfo(data)
        if (!FF.stripePayment) {
          await props.addUser(data)
          window.open("https://ubc-pmc.square.site", "_blank")
        }
        setCurrPage("payment")
  };

  return (
    <div className={"form-multi-cols"}>
      <UserDataForm onSubmit={submit} hasWaiver />
    </div>
  );
}
