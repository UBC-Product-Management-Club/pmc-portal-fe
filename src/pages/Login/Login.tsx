import "./Login.css"
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup, type User } from 'firebase/auth';
import { auth } from "../../../firebase"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OnboardingForm from '../../components/OnboardingForm/OnboardingForm';
import { loginBody } from '../../types/api';
import GoogleLogo from "../../assets/google.svg"

export default function Login() {
  const [onboarding, setOnboarding] = useState<boolean>(false)
  const [user, setUser] = useState<User | undefined>()
  const [loginCreds, setLoginCreds] = useState<loginBody | undefined>()
  const navigateTo = useNavigate()

  async function googleLogin() {
    try {
        setPersistence(auth,inMemoryPersistence)
        const authProvider = new GoogleAuthProvider()
        const signInResult = await signInWithPopup(auth, authProvider)
        const user: User  = signInResult.user;
        const idToken = await user.getIdToken()

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
          navigateTo("/dashboard")
        } else {
          // Currently logged in user that needs to be onboarded
          setUser(user)
          setLoginCreds({ userUID: user.uid, idToken: idToken })
          setOnboarding(true) 
        }
    } catch (error) {
      // Show some sort of error component
      console.log(error);
    }
  }

  return (
    <>
      {onboarding ? 
        <OnboardingForm user={user!} creds={loginCreds!}/> :
          <div className="login-container">
            <div className="login-content">
              <h1 className="login-header">PMC Membership Portal</h1> 
              <div className="login-button-container">
                  <button className="login-googlesso" onClick={googleLogin}><img src={GoogleLogo} className="googleLogo" width={14} height={14}/>Continue with Google</button>
                  <button className="login-continue" onClick={() => console.log("continue as non-member")}>Continue as a non-member</button>
              </div>
            </div>
          </div>}
    </>
  )
}