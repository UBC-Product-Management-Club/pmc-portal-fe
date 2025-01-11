import {useContext, useEffect, useState} from "react";
import {AuthContextType, AuthProviderProps} from "./types";
import {onboardingBody, userDocument} from "../../types/api";
import AuthContext from "./AuthContext";
import {useAuth0} from "@auth0/auth0-react";
// import FF from "../../../feature-flag.json";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export function AuthProvider({children}: AuthProviderProps) {
    const {user, isAuthenticated, getIdTokenClaims, isLoading: auth0Loading} = useAuth0();
    const [userData, setUserData] = useState<userDocument | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = async () => {
        try {
            await migrateOldUser();
            const data = await fetchUserData(user!.sub!);
            
            if (data) {
                setUserData(data);
                // Store minimal session data in localStorage
                localStorage.setItem('lastSession', JSON.stringify({
                    userId: user!.sub,
                    timestamp: new Date().getTime()
                }));
            }

            setIsSignedIn(!!user && !!data);
        } catch (e) {
            console.error('Login error:', e);
            setIsSignedIn(false);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle initial load and auth state changes
    useEffect(() => {
        const initializeAuth = async () => {
            if (!auth0Loading) {
                if (isAuthenticated && user) {
                    await handleLogin();
                } else {
                    // Check for existing session
                    const lastSession = localStorage.getItem('lastSession');
                    if (lastSession) {
                        const { timestamp } = JSON.parse(lastSession);
                        const sessionAge = new Date().getTime() - timestamp;
                        // If session is less than 24 hours old, try to restore it
                        if (sessionAge < 24 * 60 * 60 * 1000) {
                            await getIdTokenClaims(); // This will trigger a token refresh if needed
                        } else {
                            localStorage.removeItem('lastSession');
                            setIsSignedIn(false);
                            setUserData(null);
                        }
                    }
                    setIsLoading(false);
                }
            }
        };

        initializeAuth();
    }, [auth0Loading, isAuthenticated, user]);

    // Clear session on unmount if needed
    useEffect(() => {
        return () => {
            if (!isAuthenticated) {
                localStorage.removeItem('lastSession');
            }
        };
    }, [isAuthenticated]);

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
            return await response.json();
        } catch (e) {
            console.error("Failed to fetch user data: ", e);
        }
    };

    const migrateOldUser = async () => {
        try {
            const id = await getIdByEmail(user!.email!);
            // If the ID we get is the authenticated user's ID, this user authenticated
            // with Auth0, and there is no migration to be done
            if (id == user?.sub || id == null)
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
        if (response.status === 404) {
            // The user never had an old profile that needed migration
            return null;
        } else if (!response.ok) {
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
        const onboardUser = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboard`, {
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

    return (
        <AuthContext.Provider value={{userData, setUserData, isSignedIn, setIsSignedIn}}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}
