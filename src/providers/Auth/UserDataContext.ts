import { AuthContextType } from "./types";
import { createContext } from "react";

const UserDataContext = createContext<AuthContextType | undefined>(undefined);

export default UserDataContext;
