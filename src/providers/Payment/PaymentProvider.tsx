import { useContext, useState } from "react";
import { PaymentFormOptions, PaymentSuccessOptions } from "./types";
import PaymentContext from "./PaymentContext";

interface PaymentProviderProps {
    FormOptions: PaymentFormOptions
    SuccessOptions: PaymentSuccessOptions
    children: React.ReactNode
}

const usePayment = () => {
    const context = useContext(PaymentContext)
    if (!context) {
        throw new Error("usePayment must be used within a PaymentProvider");
    }
    return context;
}
/*
    FormOptions: Options for Stripe Payment Form
    SuccessOptions: Options for Payment success component
*/
const PaymentProvider = ({ FormOptions, SuccessOptions, children } : PaymentProviderProps): React.ReactNode => {
    const [paid, setPaid] = useState<boolean>(false)
    
    return (
        <PaymentContext.Provider value={{FormOptions, SuccessOptions, paid, setPaid}}>
            { children }
        </PaymentContext.Provider>
    )
}

export { usePayment, PaymentProvider }