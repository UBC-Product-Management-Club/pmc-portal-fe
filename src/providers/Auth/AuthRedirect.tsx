import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./AuthProvider";

export default function AuthRedirect() {
    const { isAuthenticated, isLoading } = useAuth0();
    const { userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else if (isAuthenticated && (!userData || !userData.onboarded)) {
                navigate("/onboarding");
            } else if (isAuthenticated && userData && userData.onboarded) {
                navigate("/dashboard");
            } else if (!isAuthenticated && location.pathname === "/pconf/raffle-tracker/email-pop-up") {
                navigate("/pconf/raffle-tracker/email-pop-up");
            }
        }
    }, [isLoading, isAuthenticated, userData, navigate, location]);

    return <><Outlet /></>;
}
