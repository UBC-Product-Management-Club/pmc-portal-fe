import {useContext, useEffect, useState} from "react";
import {AuthContextType, AuthProviderProps} from "./types";
import {userDocument} from "../../types/api";
import AuthContext from "./AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import FF from "../../../feature-flag.json";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export function AuthProvider({children}: AuthProviderProps) {
    const {user, isAuthenticated} = useAuth0();
    const [userData, setUserData] = useState<userDocument | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/${user?.sub}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data: userDocument = await response.json();
                setUserData(data);
            } catch (e) {
                console.error("Failed to fetch user data: ", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchUserData().then(() => {
                if (!FF.stripePayment) {
                    setIsSignedIn(!!user && !!userData && userData.paymentVerified!);
                } else {
                    setIsSignedIn(!!user && !!userData);
                }
            });
        } else {
            setUserData(null);
            setIsSignedIn(false);
        }
    }, [isAuthenticated, user])

    const value: AuthContextType = {
        userData,
        setUserData,
        isSignedIn
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}
