import "./Login.css"
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup, type User } from 'firebase/auth';
import { auth } from "../../../firebase"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OnboardingForm from '../../components/OnboardingForm/OnboardingForm';
import { loginBody } from '../../types/api';
import GoogleLogo from "../../assets/google.svg"
import PMCLogo from "../../assets/pmclogo.svg"

export default function Login() {
  const [onboarding, setOnboarding] = useState<boolean>(false)
  const [user, setUser] = useState<User | undefined>()
  const [loginCreds, setLoginCreds] = useState<loginBody | undefined>()
  const navigateTo = useNavigate()

  async function googleLogin() {
    try {
      setPersistence(auth, inMemoryPersistence)
      const authProvider = new GoogleAuthProvider()
      const signInResult = await signInWithPopup(auth, authProvider)
      const user: User = signInResult.user;
      const idToken = await user.getIdToken()

      const displayName = user.displayName ?? "User";

      // fetch login endpoint
      const login = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          userUID: user.uid,
          idToken: idToken
        })
      })
      if (login.ok) {
        // User exists so go to /dashboard
        localStorage.setItem('member_id', user.uid);
        localStorage.setItem('member_name', displayName || "guest");
        navigateTo("/dashboard")
      } else {
        // Currently logged in user that needs to be onboarded
        setUser(user)
        setLoginCreds({ userUID: user.uid, idToken: idToken })
        setOnboarding(true)
        localStorage.setItem('member_id', user.uid);
        localStorage.setItem('member_name', displayName || "guest");
      }
    } catch (error) {
      // Show some sort of error component
      console.log(error);
    }
  }

  return (
    <>
      {onboarding ?
        <OnboardingForm user={user!} creds={loginCreds!} /> :
        <div className="login-container">
          <div className="login-content">
            <img className="login-content--logo" src={PMCLogo} />
            <h1 className="login-content--header">PMC Membership Portal</h1>
            <div className="login-content--button-container">
              <button className="login-googlesso" onClick={googleLogin}><img src={GoogleLogo} className="googleLogo" width={14} height={14} />Continue with Google</button>
              <button className="login-continue" onClick={() => navigateTo("/dashboard")}>Continue as a non-member</button>
            </div>
          </div>
        </div>}
    </>
  )
}