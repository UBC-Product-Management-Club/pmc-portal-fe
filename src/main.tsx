import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login/Login.tsx";
import "./index.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Event from "./pages/Dashboard/Event.tsx";
import { AuthProvider } from "./providers/Auth/AuthProvider.tsx";
import {Profile} from "./pages/Profile/Profile";
import {Navbar} from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path={"/"} element={<Login/>}/>
          <Route path={"/dashboard"} element={<Dashboard/>}/>
          <Route path={"/events/:event_id"} element={<Event/>}/>
          <Route path={"/profile"} element={<Profile/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
