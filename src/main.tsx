import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import Login from './pages/Login/Login.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Event from './pages/Event/Event.tsx';
import { Profile } from './pages/Profile/Profile';
import { Layout } from './layout';
import Onboarding from './components/Onboarding/Onboarding.tsx';
import { UserDataProvider } from './providers/UserData/UserDataProvider.tsx';
import AuthorizedRouter from './components/AuthorizedRouter/AuthorizedRouter.tsx';
import PaymentSuccess from './components/Payment/PaymentSuccess.tsx';
import PaymentCanceled from './components/Payment/PaymentCanceled.tsx';
import UnderConstruction from './pages/Status/UnderConstruction.tsx';

Modal.setAppElement('#root');
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Auth0Provider
                domain={import.meta.env.VITE_AUTH0_API_URL}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin + '/authorized',
                    audience: import.meta.env.VITE_API_URL,
                }}
                useRefreshTokens={true}
                cacheLocation="localstorage"
            >
                <UserDataProvider>
                    <Routes>
                        <Route path={'/'} element={<Login />} />
                        <Route path={'/authorized'} element={<AuthorizedRouter />} />
                        <Route path={'/onboarding'} element={<Onboarding />} />
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/events/:event_id/register" element={<Event />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/events/3f8b1a2e-7d9c-4f5e-8a2b-9c7e4d123f45"
                                element={<UnderConstruction />}
                            />
                            <Route path="/dashboard/success" element={<PaymentSuccess />}></Route>
                            <Route path="/dashboard/canceled" element={<PaymentCanceled />}></Route>
                        </Route>
                    </Routes>
                </UserDataProvider>
            </Auth0Provider>
        </Router>
    </React.StrictMode>
);
