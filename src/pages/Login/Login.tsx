import "./Login.css";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleLogo from "../../assets/google.svg";
import PMCLogo from "../../assets/pmclogo.svg";
import Onboarding from "../../components/OnboardingForm/Onboarding";

export default function Login() {
  const [onboarding, setOnboarding] = useState<boolean>(false);
  const navigateTo = useNavigate();

  async function googleLogin() {
    try {
      setPersistence(auth, browserLocalPersistence);
      const authProvider = new GoogleAuthProvider();
      const signInResult = await signInWithPopup(auth, authProvider);
      const user: User = signInResult.user;
      const idToken = await user.getIdToken();

      // fetch login endpoint
      const login = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userUID: user.uid,
            idToken: idToken,
          }),
        }
      );

      if (login.ok) {
        navigateTo("/dashboard");
      } else if (login.status === 302) {
        setOnboarding(true);
      } else {
        throw Error("An error occurred logging in");
      }
    } catch (error) {
      // Show some sort of error component
      console.log(error);
    }
  }

  return (
    <>
      {onboarding ? (
        <Onboarding />
      ) : (
        <div className="login-container">
          <div className="login-content">
            <img className="login-content--logo" src={PMCLogo} />
            <h1 className="login-content--header">PMC Membership Portal</h1>
            <div className="login-content--button-container">
              <button className="login-googlesso" onClick={googleLogin}>
                <img
                  src={GoogleLogo}
                  className="googleLogo"
                  width={14}
                  height={14}
                />
                Continue with Google
              </button>
              <button
                className="login-continue"
                onClick={() => navigateTo("/dashboard")}
              >
                Continue as a non-member
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
