import { PaymentIntent } from "@stripe/stripe-js"

interface PaymentContextType {
    FormOptions: PaymentFormOptions
    SuccessOptions: PaymentSuccessOptions
    paid: boolean
    setPaid: React.Dispatch<React.SetStateAction<boolean>>
}

interface PaymentFormOptions {
    prompt: string
    type: "membership" | "event"
    eventId?: string
    amt: number
    onSuccess: (paymentIntent: PaymentIntent) => void
}

interface PaymentSuccessOptions {
    subheading: string
    continueBtnText: string
}

export type { PaymentFormOptions, PaymentSuccessOptions, PaymentContextType }