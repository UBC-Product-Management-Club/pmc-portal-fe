import { Dispatch, ReactNode, SetStateAction } from "react";
import { userDocument } from "../../types/api";

export interface UserDataContextType {
  userData: userDocument | null;
  setUserData: Dispatch<SetStateAction<userDocument | null>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
}

export interface UserDataProviderProps {
  children: ReactNode;
}
