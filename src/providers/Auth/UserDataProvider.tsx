import {ActionDispatch, createContext, ReactNode, useReducer, useState } from "react";
import { UserDocument } from "../../types/api";
import {useAuth0 } from "@auth0/auth0-react";
import Login from "../../pages/Login/Login";

type UpdateUserFunction = ActionDispatch<[Action]>

interface UserDataContextType {
    user: UserDocument | undefined;
    isMember: boolean;
    update: UpdateUserFunction;
}

enum ActionTypes {
    "UPDATE", "LOAD"
}

type Action = 
    | { type: ActionTypes.UPDATE; payload: Partial<UserDocument>}
    | { type: ActionTypes.LOAD; payload: UserDocument }


const emptyUser: UserDocument = {
    firstName: "",
    lastName: "",
    pronouns: "",
    email: "",
    pfp: "",
    displayName: "",
    onboarded: false,
    whyPm: "",
    returningMember: undefined,
    paymentVerified: false
}

const UserDataContext = createContext<UserDataContextType>({
    user: emptyUser,
    isMember: false,
    update: () => undefined
});

function UserDataProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth0();
    const [user, update] = useReducer<UserDocument | undefined, [Action]>(reducer, undefined)

    function reducer(prevState: UserDocument | undefined , action: Action): UserDocument | undefined {
        if (prevState) {
            switch (action.type) {
                case ActionTypes.UPDATE:
                    return {...prevState, ...action.payload}
                case ActionTypes.LOAD:
                    return action.payload
            }
        }
        return undefined;
    }


    return (
        <UserDataContext.Provider value={{ user, isMember: !!user?.paymentVerified, update }}>
            {isAuthenticated ? children : <Login /> }
        </UserDataContext.Provider>
    );
}

export { UserDataProvider, UserDataContext, ActionTypes }
export type { UserDataContextType, UpdateUserFunction }