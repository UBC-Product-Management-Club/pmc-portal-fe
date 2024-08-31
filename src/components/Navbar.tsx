import "./component-theme.css"
import {useAuth} from "../providers/Auth/AuthProvider";
import PMCLogo from "../assets/pmclogo.svg";
import {useNavigate} from "react-router-dom";

export function Navbar() {
    const {currentUser, logout} = useAuth();
    const navigateTo = useNavigate();

    async function authButtonHandler() {
        try {
            if (currentUser) {
                const uid = currentUser.uid;
                const displayName = currentUser.displayName;

                await logout();

                if (uid) {
                    localStorage.removeItem(uid);
                }
                if (displayName) {
                    localStorage.removeItem(displayName);
                }
            }
            navigateTo("/");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    return <div className="navbar">
        <div className="navbar-icon">
            <a href="/">
                <img src={PMCLogo} className="logo"/>
            </a>
        </div>
        <nav className="navbar-nav">
            <a href="/Dashboard/Dashboard" className="navbar-link">
                Events
            </a>
            <div>
                {currentUser != null ? (
                    <a href="/profile" className="navbar-link">
                        Profile
                    </a>
                ) : (
                    <a href="/" className="navbar-link">
                        Profile
                    </a>
                )}
            </div>
            <div className="navbar-button">
                <div onClick={authButtonHandler}>
                    {currentUser ? "Sign out" : "Sign in"}
                </div>
            </div>
        </nav>
    </div>;
}