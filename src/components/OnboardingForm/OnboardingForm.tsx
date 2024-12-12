import "./OnboardingForm.css";
import { useContext } from "react";
import { UserSchema } from "./types";
import { OnboardingContext } from "./Context";
import { UserDataForm } from "../UserDataForm/UserDataForm";

export default function OnboardingForm() {
    const { setUserInfo, setCurrPage } = useContext(OnboardingContext)
    const submit = async (data: UserSchema) => {
        // update parent state to save user input
        if (data.ubc_student == "yes")
            data.university = "University of British Columbia";
        setUserInfo(data)
        setCurrPage("payment")
  };

  return (
    <div className={"form-multi-cols"}>
      <UserDataForm onSubmit={submit} hasWaiver />
    </div>
  );
}
