import "./Login.css";
import { useNavigate } from "react-router-dom";
import PMCLogo from "../../assets/pmclogo.svg";
import {useAuth0} from "@auth0/auth0-react";
import Footer from "../../components/Footer/Footer";

export default function Login() {
  const {loginWithRedirect} = useAuth0();
  const navigateTo = useNavigate();

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
      <div className="login-footer--container">
        <Footer />
      </div>
    </div>
  );
}
