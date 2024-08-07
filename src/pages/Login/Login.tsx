import "./Login.css"
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup, type User } from 'firebase/auth';
import { auth } from "../../../firebase"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OnboardingForm from '../../components/OnboardingForm/OnboardingForm';
import { loginBody } from '../../types/api';

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
      <h1>Welcome to PMC</h1>
      {onboarding && <OnboardingForm user={user!} creds={loginCreds!} />}
      {!onboarding && <button onClick={googleLogin}>login with Google</button>}
    </>
  )
}