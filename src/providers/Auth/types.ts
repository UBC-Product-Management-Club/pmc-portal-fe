import { User } from "firebase/auth";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {userDocument} from "../../types/api";

export interface AuthContextType {
  currentUser: User | null;
  userData: userDocument | null;
  setUserData: Dispatch<SetStateAction<userDocument | null>>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
