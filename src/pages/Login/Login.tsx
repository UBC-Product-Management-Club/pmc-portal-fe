import "./Login.css";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import PMCLogo from "../../assets/pmclogo.svg";
import {useAuth0} from "@auth0/auth0-react";

export default function Login() {
  const {user, isAuthenticated, loginWithRedirect} = useAuth0();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const onboarded = user?.app_metadata?.onboarded; // Assuming `isNewUser` is tracked in metadata

      if (!onboarded) {
        navigateTo("/onboarding"); // Redirect to onboarding form
      } else {
        navigateTo("/dashboard"); // Redirect to dashboard
      }
    }
  }, [isAuthenticated, user, navigateTo]);

  return (
    <div className="login-container">
      <div className="login-content">
        <img className="login-content--logo" src={PMCLogo} />
        <h1 className="login-content--header">PMC Membership Portal</h1>
        <div className="login-content--button-container">
          <button className="login-googlesso" onClick={() => loginWithRedirect()}>
            Log in / sign up
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
  );
}
