import { UserDataContextType } from "./types";
import { createContext } from "react";

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export default UserDataContext;
