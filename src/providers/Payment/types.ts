import { PaymentIntent } from "@stripe/stripe-js"

interface PaymentContextType {
    FormOptions: PaymentFormOptions
    SuccessOptions: PaymentSuccessOptions
    paid: boolean
    setPaid: React.Dispatch<React.SetStateAction<boolean>>
}

// Options for the Stripe Payment form
interface PaymentFormOptions {
    prompt: string
    type: "membership" | "event"
    eventId?: string
    amt?: number
    onSuccess: (paymentIntent: PaymentIntent) => void
}

// Options for the Payment success component
interface PaymentSuccessOptions {
    heading: string
    subheading: string
    continueBtnText: string
}

export type { PaymentFormOptions, PaymentSuccessOptions, PaymentContextType }