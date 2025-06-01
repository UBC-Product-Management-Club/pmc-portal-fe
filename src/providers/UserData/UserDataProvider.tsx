import {ActionDispatch, createContext, ReactNode, useReducer } from "react";
import { UserDocument } from "../../types/api";

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


const UserDataContext = createContext<UserDataContextType>({
    user: undefined,
    isMember: false,
    update: () => undefined
});

function UserDataProvider({ children }: { children: ReactNode }) {
    const [user, update] = useReducer<UserDocument | undefined, [Action]>(reducer, undefined)
    const isMember = !!user?.paymentVerified

    function reducer(prevState: UserDocument | undefined, action: Action): UserDocument | undefined {
        switch (action.type) {
            case ActionTypes.UPDATE:
                if (prevState) {
                    return {...prevState, ...action.payload}
                }
                console.warn("Attempting to update an undefined user! Returning undefined")
                return prevState
            case ActionTypes.LOAD:
                return action.payload
        }
    }

    return (
        <UserDataContext.Provider value={{ user, isMember, update }}>
            { children }
        </UserDataContext.Provider>
    );
}

export { UserDataProvider, UserDataContext, ActionTypes }
export type { UserDataContextType, UpdateUserFunction }