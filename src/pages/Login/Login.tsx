import "./Login.css";
import { useNavigate } from "react-router-dom";
import PMCLogo from "../../assets/pmclogo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../../components/Footer/Footer";

// Helper function to detect in-app browsers
const isInAppBrowser = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  return (
    ua.includes('wv') || // Android WebView
    (isIOS && !ua.includes('safari')) || // iOS WebView
    ua.includes('fbav') || // Facebook
    ua.includes('instagram') || // Instagram
    ua.includes('twitter') || // X (formerly Twitter)
    ua.includes('x-client') || // X's new client identifier
    ua.includes('linkedin') // LinkedIn
  );
};

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  const navigateTo = useNavigate();

  const handleLogin = () => {
    if (isInAppBrowser()) {
      window.location.href = `googlechrome://${window.location.host}${window.location.pathname}`;
      const message = "For security reasons, please open this page in Safari to log in. In-app browsers are not supported for secure login.";
      
      setTimeout(() => {
        window.alert(message);
      }, 100);
    } else {
      loginWithRedirect();
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img className="login-content--logo" src={PMCLogo} />
        <h1 className="login-content--header">PMC Membership Portal</h1>
        <div className="login-content--button-container">
          <button className="login-googlesso" onClick={handleLogin}>
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
