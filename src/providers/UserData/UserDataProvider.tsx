import { ActionDispatch, createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { UserDataFromAuth, UserDocument, UserFromDatabase } from '../../types/User';
import { useLocation } from 'react-router-dom';
import { useUserService } from '../../hooks/useUserService';
import { useAuth0 } from '@auth0/auth0-react';

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

const requiresFreshData = [
    /\/dashboard/,
    /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?$/,
];

function UserDataProvider({ children }: { children: ReactNode }) {
    const [user, update] = useReducer<
        Partial<UserDocument> | UserFromDatabase | undefined,
        [Action]
    >(reducer, undefined);
    const auth0 = useAuth0();
    const userService = useUserService();
    const location = useLocation();

    useEffect(() => {
        if (requiresFreshData.some((pattern) => location.pathname.match(pattern))) {
            userService
                .me()
                .then((user) => update({ type: ActionTypes.LOAD, payload: user }))
                .catch(() => {
                    console.log('your session has expired!');
                    auth0.logout({
                        logoutParams: {
                            returnTo: window.location.origin,
                        },
                    });
                });
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
