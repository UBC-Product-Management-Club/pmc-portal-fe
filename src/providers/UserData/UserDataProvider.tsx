import { ActionDispatch, createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { UserDataFromAuth, UserDocument, UserFromDatabase } from '../../types/User';
import { useLocation } from 'react-router-dom';
import { useUserService } from '../../hooks/useUserService';

type UpdateUserFunction = ActionDispatch<[Action]>;

interface UserDataContextType {
    user?: Partial<UserDocument> | UserFromDatabase;
    update: UpdateUserFunction;
    isMember: boolean;
}

enum ActionTypes {
    'UPDATE',
    'LOAD',
    'CREATE',
}

type Action =
    | { type: ActionTypes.UPDATE; payload: Partial<UserDocument> }
    | { type: ActionTypes.LOAD; payload: UserFromDatabase }
    | { type: ActionTypes.CREATE; payload: UserDataFromAuth };

const UserDataContext = createContext<UserDataContextType>({
    user: undefined,
    update: () => undefined,
    isMember: false,
});

function useUserData() {
    return useContext(UserDataContext);
}

function UserDataProvider({ children }: { children: ReactNode }) {
    const [user, update] = useReducer<
        Partial<UserDocument> | UserFromDatabase | undefined,
        [Action]
    >(reducer, undefined);
    const userService = useUserService();
    const location = useLocation();

    useEffect(() => {
        // change this to hit /me endpoint when its implemented (tobs)
        console.log(location.pathname);
        if (location.pathname.includes('dashboard')) {
            if (user && user.userId) {
                userService
                    .get(user.userId!)
                    .then((user) => update({ type: ActionTypes.LOAD, payload: user }));
            }
        }
    }, [location.pathname]);

    function reducer(
        prevState: Partial<UserDocument> | UserFromDatabase | undefined,
        action: Action
    ): Partial<UserDocument> | UserFromDatabase | undefined {
        switch (action.type) {
            case ActionTypes.UPDATE:
                if (prevState) {
                    return { ...prevState, ...action.payload };
                }
                // when beginning onboarding, user is undefined!
                console.warn('Attempting to update an undefined user! Returning undefined');
                return prevState;
            case ActionTypes.LOAD:
            case ActionTypes.CREATE:
                return action.payload;
        }
    }

    return (
        <UserDataContext.Provider
            value={{ user, update, isMember: !!(user && user.isPaymentVerified) }}
        >
            {children}
        </UserDataContext.Provider>
    );
}

export { UserDataProvider, useUserData, ActionTypes };
export type { UserDataContextType, UpdateUserFunction };
