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

const dashboardPath = /\/dashboard/;
const eventsPagePath =
    /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\/|$)/;
const eventRegistrationPath =
    /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/register\/?$/;
const requiresFreshData = [dashboardPath, eventsPagePath, eventRegistrationPath];

function UserDataProvider({ children }: { children: ReactNode }) {
    const [user, update] = useReducer<
        Partial<UserDocument> | UserFromDatabase | undefined,
        [Action]
    >(reducer, undefined);
    const userService = useUserService();
    const { logout } = useAuth0();
    const location = useLocation();

    useEffect(() => {
        if (!requiresFreshData.some((pattern) => location.pathname.match(pattern))) return;

        let cancelled = false;
        userService
            .me()
            .then((user) => {
                if (!cancelled) {
                    update({ type: ActionTypes.LOAD, payload: user });
                }
            })
            .catch(async (error) => {
                console.error(error);
                if (cancelled) return;
                // event registration page should
                // be accessible when unauthenticated
                if (!location.pathname.match(eventRegistrationPath)) {
                    await logout({
                        logoutParams: {
                            returnTo: window.origin,
                        },
                    });
                }
            });
        return () => {
            cancelled = true;
        };
        // react-hooks/exhaustive-deps
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
