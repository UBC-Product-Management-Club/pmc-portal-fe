import { ActionDispatch, createContext, ReactNode, useContext, useReducer } from "react";
import { UserDataFromAuth, UserDocument } from "../../types/User";

type UpdateUserFunction = ActionDispatch<[Action]>

interface UserDataContextType {
    user?: Partial<UserDocument>;
    update: UpdateUserFunction;
}

enum ActionTypes {
    "UPDATE", "LOAD", "CREATE"
}

type Action =
    | { type: ActionTypes.UPDATE; payload: Partial<UserDocument> }
    | { type: ActionTypes.LOAD; payload: UserDocument }
    | { type: ActionTypes.CREATE; payload: UserDataFromAuth }

const UserDataContext = createContext<UserDataContextType>({
    user: undefined,
    update: () => undefined
});

function useUserData() {
    return useContext(UserDataContext)
}

function UserDataProvider({ children }: { children: ReactNode }) {
    const [user, update] = useReducer<Partial<UserDocument> | undefined , [Action]>(reducer, undefined)

    function reducer(prevState: Partial<UserDocument> | undefined, action: Action): Partial<UserDocument> | undefined {
        switch (action.type) {
            case ActionTypes.UPDATE:
                if (prevState) {
                    return { ...prevState, ...action.payload }
                }
                // when beginning onboarding, user is undefined!
                console.warn("Attempting to update an undefined user! Returning undefined")
                return prevState
            case ActionTypes.LOAD:
            case ActionTypes.CREATE:
                return action.payload
        }
    }

    return (
        <UserDataContext.Provider value={{ user, update }}>
            {children}
        </UserDataContext.Provider>
    );
}

export { UserDataProvider, useUserData, ActionTypes }
export type { UserDataContextType, UpdateUserFunction }