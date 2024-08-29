import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
