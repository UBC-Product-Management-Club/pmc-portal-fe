import "./Navbar.css"
import {useAuth} from "../providers/Auth/AuthProvider";
import PMCLogo from "../assets/pmclogo.svg";
import {useNavigate} from "react-router-dom";

export function Navbar() {
    const {currentUser, logout, isSignedIn} = useAuth();
    const navigateTo = useNavigate();

    async function authButtonHandler() {
        try {
            if (isSignedIn) {
                const uid = currentUser!.uid;
                const displayName = currentUser!.displayName;

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
        <a href="/" className="navbar-icon">
            <img src={PMCLogo} className="logo" alt={"PMC Logo"}/>
        </a>
        <nav className="navbar-nav">
            <a href="/dashboard" className="navbar-link">
                Events
            </a>
            <div>
                {isSignedIn ? (
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
                    {isSignedIn ? "Sign out" : "Sign in"}
                </div>
            </div>
        </nav>
    </div>;
}