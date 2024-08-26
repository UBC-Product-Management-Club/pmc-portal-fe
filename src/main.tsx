import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login/Login.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import EventPage from "./pages/Event/EventPage";
// import Onboarding from './pages/Onboarding.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path:"/dashboard",
    element: <Dashboard /> 
  },
  {
    path: "/events",
    element: <h1>Events go here</h1>
  },
  {
    path: "/event/:eventId", //passes a params object to element containing :id
    element: <EventPage />
  },
  {
    path: "/profile/:profileId",
    element: <></>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
