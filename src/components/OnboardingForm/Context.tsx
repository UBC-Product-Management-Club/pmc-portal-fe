import { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";
import { UserSchema } from "./types";


type pages = "userInfo" | "payment" | "paymentSuccess"
type OnboardingData = {
    // userInfo: UserSchema | undefined
    // currPage : pages
    setCurrPage: React.Dispatch<SetStateAction<pages>>
    setUserInfo: React.Dispatch<SetStateAction<UserSchema | undefined>>
}

type OnboardingProps = {
    setters: { 
        setCurrPage: React.Dispatch<SetStateAction<pages>>, 
        setUserInfo: React.Dispatch<SetStateAction<UserSchema | undefined>>
    }, 
    children: React.ReactNode 
}

const OnboardingContext = createContext<OnboardingData>({
    // userInfo: undefined,
    // currPage: "userInfo",
    setCurrPage: () => {},
    setUserInfo: () => {}
})

const OnboardingProvider = ({ setters, children } : OnboardingProps ) => {
    // const [userInfo, setUserInfo] = useState<UserSchema | undefined>(undefined)
    // const [currPage, setCurrPage] = useState<pages>("userInfo")

    return (
        <OnboardingContext.Provider value={setters} >
            { children }
        </OnboardingContext.Provider>
        
    )
}

export { OnboardingContext, OnboardingProvider }