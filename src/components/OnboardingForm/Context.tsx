import { SetStateAction } from "react";
import { createContext } from "react";
import { UserSchema } from "./types";


type pages = "userInfo" | "payment" | "paymentSuccess"
type OnboardingData = {
    setCurrPage: React.Dispatch<SetStateAction<pages>>
    setUserInfo: React.Dispatch<SetStateAction<UserSchema| undefined>>
}

interface OnboardingProps {
    setters: { 
        setCurrPage: React.Dispatch<SetStateAction<pages>>, 
        setUserInfo: React.Dispatch<SetStateAction<UserSchema | undefined>>
    }, 
    children: React.ReactNode 
}

const OnboardingContext = createContext<OnboardingData>({
    setCurrPage: () => {},
    setUserInfo: () => {},
})

const OnboardingProvider = ({ setters, children } : OnboardingProps ) => {

    return (
        <OnboardingContext.Provider value={setters} >
            { children }
        </OnboardingContext.Provider>
        
    )
}

export { OnboardingContext, OnboardingProvider }