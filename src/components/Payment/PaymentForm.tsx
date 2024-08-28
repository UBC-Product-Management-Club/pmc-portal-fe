import "./PaymentForm.css"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Layout, LayoutObject } from "@stripe/stripe-js"
import { useContext, useEffect, useState } from "react"
import { OnboardingContext } from "../OnboardingForm/Context"

export default function PaymentForm() {
    const stripe = useStripe()
    const elements = useElements()
    
    const [paymentError, setPaymentError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { setPayment, setCurrPage } = useContext(OnboardingContext)

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
      
        if (!clientSecret) {
            return;
        }

        // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        //     switch (paymentIntent!.status) {
        //       case "succeeded":
        //         // setMessage("Payment succeeded!");
        //         break;
        //       case "processing":
        //         // setMessage("Your payment is processing.");
        //         break;
        //       case "requires_payment_method":
        //         // setMessage("Your payment was not successful, please try again.");
        //         break;
        //       default:
        //         // setMessage("Something went wrong.");
        //         break;
        //     }
        // });
    }, [stripe])
      
    const paymentElementOptions: {
        layout: Layout | LayoutObject | undefined
    } = {
        layout: "tabs"
    }

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
    
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: "if_required"
        });
    
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
          setPaymentError(error.message || "An unexpected error occurred");
        } else if (paymentIntent && paymentIntent.status === "succeeded" ) {
          // set payment details
            setPayment({
              id: paymentIntent.id,
              amount: paymentIntent.amount,
              created: paymentIntent.created,
              status: paymentIntent.status
            })
            setCurrPage("paymentSuccess")
        }
    
        setIsLoading(false);
      };
    return (
        <form className="PaymentForm-content" onSubmit={handleSubmit}>
            <PaymentElement className="PaymentForm-content--PaymentElement" options={paymentElementOptions} />
            <button disabled={isLoading} className="PaymentForm-content--submit ">Pay now</button>
            {paymentError && <span className="PaymentForm-content--error">{paymentError}</span>}
        </form>
    )
}