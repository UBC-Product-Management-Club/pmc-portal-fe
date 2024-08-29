import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login/Login.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
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
    path: "/event/:blob", //passes a params object to element containing :id
    element: <></>
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
