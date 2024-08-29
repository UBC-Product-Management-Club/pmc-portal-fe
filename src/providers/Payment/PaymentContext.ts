import { createContext } from "react"
import { PaymentContextType } from "./types"

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export default PaymentContext