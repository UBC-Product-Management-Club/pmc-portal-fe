import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { AuthContextType, AuthProviderProps } from "./types";
import { userDocument } from "../../types/api";
import AuthContext from "./AuthContext";
import {useAuth0} from "@auth0/auth0-react";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const UserDataProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<userDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!auth) return;

    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Persistence set to local");
      } catch (error) {
        console.error("Failed to set persistence:", error);
      }
    };

    setAuthPersistence();
  }, [auth]);

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

    if (isAuthenticated && user && !isLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, user])


  const value: AuthContextType = {
    userData,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
