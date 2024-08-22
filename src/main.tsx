import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login/Login.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import Event from './pages/Dashboard/Event.tsx'
// import Onboarding from './pages/Onboarding.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/events/:event_id",
    element: <Event />
  },
  // {
  //   path: "/events/:event_id", //passes a params object to element containing :id
  //   element: <EventDetails />
  // },
  {
    path: "/profile/:profileId",
    element: <></>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
