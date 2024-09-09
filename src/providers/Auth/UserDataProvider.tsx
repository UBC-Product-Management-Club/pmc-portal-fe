import { useContext, useEffect, useState } from "react";
import { AuthContextType } from "./types";
import { userDocument } from "../../types/api";
import AuthContext from "./AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {Outlet} from "react-router-dom";

export const useUserData = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function UserDataProvider() {
  const [userData, setUserData] = useState<userDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth0();

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
      fetchUserData();
    }
  }, [isAuthenticated, user])


  const value: AuthContextType = {
    userData,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && <Outlet/>}
    </AuthContext.Provider>
  );
}
