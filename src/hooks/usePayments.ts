import { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";

// Needs to be inside <Elements> context
function usePayments() {
    const stripe = useStripe()
    const elements = useElements()
    const [processing, setProcessing] = useState<boolean>(false)

    async function pay(): Promise<PaymentIntent> {
        if (!stripe || !elements) {
            throw Error("An error occurred, please try again. No charges have been made.")
        }
        setProcessing(true)
        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });
        setProcessing(false)
        if (error) {
            throw Error(error.message || "An unexpected error occurred");
        }
        return paymentIntent
    }

    return {
        pay,
        processing,
    }

}

export { usePayments }