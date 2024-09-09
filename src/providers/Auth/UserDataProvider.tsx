import { useContext, useEffect, useState } from "react";
import {UserDataContextType, UserDataProviderProps} from "./types";
import { userDocument } from "../../types/api";
import UserDataContext from "./UserDataContext";
import {useAuth0} from "@auth0/auth0-react";

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function UserDataProvider({children}: UserDataProviderProps) {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<userDocument | null>(null);
  const [isGuest, setIsGuest] = useState(false);
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
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [isAuthenticated, user])

  const value: UserDataContextType = {
    userData,
    setUserData,
    isGuest,
    setIsGuest
  };

  return (
    <UserDataContext.Provider value={value}>
      {!isLoading && children}
    </UserDataContext.Provider>
  );
}
