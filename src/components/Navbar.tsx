import "./Navbar.css"
import PMCLogo from "../assets/pmclogo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UserDataContext } from "../providers/UserData/UserDataProvider";
import { useContext } from "react";

export function Navbar() {
    const { isMember } = useContext(UserDataContext);
    const { user, isAuthenticated, logout } = useAuth0();
    const navigateTo = useNavigate();

    async function authButtonHandler() {
        try {
            if (isAuthenticated) {
                const uid = user?.sub;
                const displayName = user?.displayName;

                await logout({
                    logoutParams: {
                        returnTo: window.location.origin,
                    },
                });

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
            <img src={PMCLogo} className="logo" alt={"PMC Logo"} />
        </a>
        <nav className="navbar-nav">
            <a href="/psprint/raffle-tracker" className="navbar-link">
                Raffle Tracker
            </a>
            <a href="/dashboard" className="navbar-link">
                Events
            </a>
            <div>
                {isMember && (
                    <a href="/profile" className="navbar-link">
                        Profile
                    </a>
                )}
            </div>
            <div className="navbar-button">
                <div onClick={authButtonHandler}>
                    {isAuthenticated ? "Sign out" : "Sign in"}
                </div>
            </div>
        </nav>
    </div>;
}