import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserService } from '../../hooks/useUserService';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';
import { UserFromDatabase } from '../../types/User';

export default function AuthorizedRouter() {
    const navigateTo = useNavigate();
    const { update } = useUserData();
    const { user: auth0User, getAccessTokenSilently } = useAuth0();
    const userService = useUserService();

    useEffect(() => {
        if (auth0User && auth0User.sub) {
            getAccessTokenSilently()
                .then((token) => localStorage.setItem('id_token', token))
                .then(() => {
                    userService
                        .me()
                        .then((user: UserFromDatabase) => {
                            update({ type: ActionTypes.LOAD, payload: user });
                            navigateTo('/dashboard');
                        })
                        .catch((err) => {
                            console.error(err);
                            update({
                                type: ActionTypes.CREATE,
                                payload: {
                                    userId: auth0User.sub!,
                                    email: auth0User.email!,
                                    pfp: auth0User.picture!,
                                    displayName: auth0User.name!,
                                },
                            });
                            navigateTo('/onboarding');
                        });
                });
        }
    }, [auth0User]);

    // TODO: Design a loading page
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100dvh', // full viewport height
                width: '100dvw',
            }}
        >
            <h1 style={{ color: 'white' }}>Loading...</h1>;
        </div>
    );
}
