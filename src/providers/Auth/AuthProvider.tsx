import {useContext, useEffect, useState} from "react";
import {AuthContextType, AuthProviderProps} from "./types";
import {onboardingBody, userDocument} from "../../types/api";
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
    const {user, isAuthenticated, getIdTokenClaims} = useAuth0();
    const [userData, setUserData] = useState<userDocument | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await migrateOldUser();

            const data = await fetchUserData(user!.sub!);
            if (data) {
                setUserData(data);
            }

            if (!FF.stripePayment) {
                setIsSignedIn(!!user && !!data && data.paymentVerified!);
            } else {
                setIsSignedIn(!!user && !!data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated && user) {
            handleLogin();
        } else {
            setUserData(null);
            setIsSignedIn(false);
        }
    }, [isAuthenticated, user])

    const fetchUserData = async (uid: string): Promise<userDocument | undefined> => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/profile/${uid}`,
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
            return data;
        } catch (e) {
            console.error("Failed to fetch user data: ", e);
        }
    };

    const migrateOldUser = async () => {
        try {
            const id = await getIdByEmail(user!.email!);
            // If the ID we get is the authenticated user's ID, this user authenticated
            // with Auth0, and there is no migration to be done
            if (id == user?.sub)
                return;

            const oldProfile = await fetchUserData(id);
            if (!oldProfile)
                throw Error("Failed to fetch old profile for migration");

            await transferProfile(oldProfile);
            await deleteProfile(id);

        } catch (e) {
            console.error("Failed to migrate user: ", e);
        }
    }

    const getIdByEmail = async (email: string) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/profile/email/${email}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw Error("Failed to get ID by email")
        }

        const data = await response.json();
        return data.id;
    }

    const transferProfile = async (profile: userDocument) => {
        const claims = await getIdTokenClaims();
        if (!user || !user.sub || !claims?.__raw) {
            throw new Error("Unable to retrieve user credentials.");
        }

        const idToken = claims.__raw;
        const body: onboardingBody = {
            creds: {
                userUID: user.sub,
                idToken: idToken
            },
            userDoc: {
                ...profile,
                onboarded: true
            }
        }
        const onboardUser = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        if (!onboardUser.ok) {
            throw Error("Failed adding user to database")
        }
    }

    const deleteProfile = async (id: string) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/profile/${id}/delete`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw Error("Failed to delete old profile")
        }
    }

    const value: AuthContextType = {
        userData,
        setUserData,
        isSignedIn,
        handleLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}
