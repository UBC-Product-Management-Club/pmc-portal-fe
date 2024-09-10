import { Dispatch, ReactNode, SetStateAction } from "react";
import { userDocument } from "../../types/api";

export interface AuthContextType {
  userData: userDocument | null;
  setUserData: Dispatch<SetStateAction<userDocument | null>>;
  isSignedIn: boolean;
  setIsSignedIn: Dispatch<SetStateAction<boolean>>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
