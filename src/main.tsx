import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login/Login.tsx";
import "./index.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Event from "./pages/Dashboard/Event.tsx";
import {Profile} from "./pages/Profile/Profile";
import {Layout} from "./layout";
import {Auth0Provider} from "@auth0/auth0-react";
import Onboarding from "./components/OnboardingForm/Onboarding";
import {UserDataProvider} from "./providers/Auth/UserDataProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_API_URL}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
      >
          <UserDataProvider>
            <Routes>
              <Route path={"/"} element={<Login/>}/>
                <Route path={"/onboarding"} element={<Onboarding/>}/>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/events/:event_id" element={<Event />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
            </Routes>
          </UserDataProvider>
      </Auth0Provider>
    </Router>
  </React.StrictMode>
);
