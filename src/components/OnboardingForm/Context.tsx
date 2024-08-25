import { SetStateAction } from "react";
import { createContext } from "react";
import { OnboardingFormSchema } from "./types";
import { paymentInfo } from "../../types/api";


type pages = "userInfo" | "payment" | "paymentSuccess"
type OnboardingData = {
    // userInfo: UserSchema | undefined
    // currPage : pages
    setCurrPage: React.Dispatch<SetStateAction<pages>>
    setUserInfo: React.Dispatch<SetStateAction<OnboardingFormSchema| undefined>>
    setPayment: React.Dispatch<SetStateAction<paymentInfo | undefined>>
}

type OnboardingProps = {
    setters: { 
        setCurrPage: React.Dispatch<SetStateAction<pages>>, 
        setUserInfo: React.Dispatch<SetStateAction<OnboardingFormSchema | undefined>>
        setPayment: React.Dispatch<SetStateAction<paymentInfo | undefined>>
    }, 
    children: React.ReactNode 
}

const OnboardingContext = createContext<OnboardingData>({
    setCurrPage: () => {},
    setUserInfo: () => {},
    setPayment: () => {}
})

const OnboardingProvider = ({ setters, children } : OnboardingProps ) => {

    return (
        <OnboardingContext.Provider value={setters} >
            { children }
        </OnboardingContext.Provider>
        
    )
}

export { OnboardingContext, OnboardingProvider }