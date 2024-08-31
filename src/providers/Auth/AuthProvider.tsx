import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { User, browserLocalPersistence, setPersistence } from "firebase/auth";
import { AuthContextType, AuthProviderProps } from "./types";
import { userDocument } from "../../types/api";
import AuthContext from "./AuthContext";

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
  const [isLoading, setIsLoading] = useState(true);

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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    return auth.signOut();
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    setUserData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
