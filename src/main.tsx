import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/Login.tsx';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './providers/Auth/AuthProvider';
import UnderConstruction from './pages/Status/UnderConstruction.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_API_URL}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <AuthProvider>
          <Routes>
            <Route path={'/'} element={<UnderConstruction />} />
            {/* <Route element={<AuthRedirect />}>
                            <Route path={"/"} />
                            <Route path={"/login"} element={<Login />} />
                            <Route path={"/onboarding"} element={<Onboarding />} />
                        </Route>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/events/:event_id" element={<Event />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin/users" element={<AllUsers />} />
                            <Route path="/admin/events" element={<AllEvents />} />
                            <Route path="/admin/events/:event_id/attendees" element={<AttendeeList />} />
                            <Route path="/psprint/raffle-tracker" element={<MainQRPage />} />
                        </Route> */}
          </Routes>
        </AuthProvider>
      </Auth0Provider>
    </Router>
  </React.StrictMode>
);
