import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { User, browserSessionPersistence, setPersistence } from "firebase/auth";
import { AuthContextType, AuthProviderProps } from "./types";
import { userDocument } from "../../types/api";
import AuthContext from "./AuthContext";
import FF from "../../../feature-flag.json";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<userDocument | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        console.log("Persistence set to local");
      } catch (error) {
        console.error("Failed to set persistence:", error);
      }
    };

    setAuthPersistence();

    const fetchUserData = async (user: User) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/${user.uid}`,
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
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        try {
          fetchUserData(user);
        } catch (e) {
          console.error("Failed to fetch user data: ", e);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!FF.stripePayment) {
      setIsSignedIn(!!currentUser && !!userData && userData.paymentVerified!);
    } else {
      setIsSignedIn(!!currentUser && !!userData);
    }
  }, [currentUser, userData]);

  const logout = () => {
    setIsSignedIn(false);
    return auth.signOut();
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    setUserData,
    logout,
    isSignedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
