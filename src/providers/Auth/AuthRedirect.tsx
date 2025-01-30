import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./AuthProvider";

export default function AuthRedirect() {
    const { isAuthenticated, isLoading } = useAuth0();
    const { userData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else if (isAuthenticated && (!userData || !userData.onboarded)) {
                navigate("/onboarding");
            } else if (isAuthenticated && userData && userData.onboarded) {
                navigate("/dashboard");
            }
        }
    }, [isLoading, isAuthenticated, userData, navigate]);

    return <><Outlet /></>;
}
