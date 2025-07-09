import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from "./pages/Login/Login.tsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import UnderConstruction from './pages/Status/UnderConstruction.tsx';
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Event from "./pages/Dashboard/Event.tsx";
import { Profile } from "./pages/Profile/Profile";
import { Layout } from "./layout";
import Onboarding from "./components/Onboarding/Onboarding.tsx";
import AllUsers from "./pages/Admin/AllUsers/AllUsers.tsx";
import AllEvents from "./pages/Admin/Events/AllEvents.tsx";
import AttendeeList from "./pages/Admin/Events/AttendeeList.tsx";
import MainQRPage from "./pages/Activities/MainQRPage.tsx";
import { ProdRenderer } from './components/EnvironmentWrappers/ProdRenderer.tsx'
import { DevRenderer } from './components/EnvironmentWrappers/DevRenderer.tsx'
import { UserDataProvider } from './providers/UserData/UserDataProvider.tsx';
import AuthorizedRouter from './components/AuthorizedRouter/AuthorizedRouter.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_API_URL}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin + '/authorized',
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <UserDataProvider>

          <ProdRenderer>
            <Routes>
                <Route path={'/'} element={<UnderConstruction />} />
            </ Routes>
          </ProdRenderer>

          <DevRenderer>
            <Routes>
                <Route path={"/"} element={<Login />} />
                <Route path={"/authorized"} element={<AuthorizedRouter />}/>
                <Route path={"/onboarding"} element={<Onboarding />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/events/:event_id" element={<Event />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin/users" element={<AllUsers />} />
                    <Route path="/admin/events" element={<AllEvents />} />
                    <Route path="/admin/events/:event_id/attendees" element={<AttendeeList />} />
                    <Route path="/psprint/raffle-tracker" element={<MainQRPage />} />
                </Route>
            </Routes>
          </DevRenderer>
          
        </UserDataProvider>
      </Auth0Provider>
    </Router>
  </React.StrictMode>
);
