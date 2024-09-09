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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
          domain="dev-u7ugzhfyb6nhuby6.us.auth0.com"
          clientId="qm1BBhb3g1KzdM6JPpHUmXUPkvHtIlDC"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
      >
        <Routes>
          <Route path={"/"} element={<Login/>}/>
            <Route path={"/onboarding"} element={<Onboarding/>}/>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events/:event_id" element={<Event />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Auth0Provider>
    </Router>
  </React.StrictMode>
);
