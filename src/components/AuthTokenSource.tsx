import { useAuth0 } from '@auth0/auth0-react';
import { setTokenSource } from '../service/RestClient';

// Lets every API call ask Auth0 for a current token. Set while rendering, not in an
// effect, so it's in place before UserDataProvider's first request on a page load.
export function AuthTokenSource() {
    const { getAccessTokenSilently } = useAuth0();
    setTokenSource(() => getAccessTokenSilently());
    return null;
}
