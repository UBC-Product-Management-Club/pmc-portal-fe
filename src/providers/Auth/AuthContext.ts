import { AuthContextType } from "./types";
import { createContext } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
