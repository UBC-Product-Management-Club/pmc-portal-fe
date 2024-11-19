import "./Payment.css"
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useEffect, useState } from "react";
import { paymentIntentResponse } from "../../types/api";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { usePayment } from "../../providers/Payment/PaymentProvider";
import PaymentSuccess from "./PaymentSuccess";
import {useAuth0} from "@auth0/auth0-react";
import {useAuth} from "../../providers/Auth/AuthProvider";

// console.log("stripe key " + import.meta.env.VITE_STRIPE_KEY)
const stripe_key = loadStripe(import.meta.env.VITE_STRIPE_KEY)

/*
  MUST BE USED INSIDE A PAYMENTCONTEXT
*/
export default function Payment() {
    // TODO:
    // - Needs a "back" button?
    const { user } = useAuth0()
    const { isSignedIn } = useAuth()
    const { paid, FormOptions } = usePayment()
    const { type, prompt, eventId, amt } = FormOptions
    const [paymentSecret, setPaymentSecret] = useState<string>("")

    useEffect(() => {
        if (amt === 0) {
            setPaymentSecret("free");
            return;
        }

        // Create PaymentIntent as soon as the page loads
        const fetchPaymentIntent = async () => {
            try {
                // console.log("fetching payment intent")
                let paymentIntent
                if (type === "membership") {
                  paymentIntent = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/membership`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amt
                    })
                  })
                } else {
                    paymentIntent = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/event/${eventId}`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            uid: isSignedIn ? user!.sub : null
                        })
                    })
                }
                const res: paymentIntentResponse = await paymentIntent.json();
                // console.log("secret: " + res.payment_secret);
                setPaymentSecret(res.payment_secret)
            } catch (error) {
                console.log("Error creating payment intent.")
            }
        }
        fetchPaymentIntent()
    }, [amt]);

    const appearance : Appearance = {
        theme: 'stripe',
        variables: {
            fontWeightNormal: '500',
            colorPrimary: '#AF71AA',
            colorText: '#DEDFE2',
            tabIconSelectedColor: '#fff',
            gridRowSpacing: '16px'
          },
          rules: {
            '.Tab, .Input, .Block, .CheckboxInput, .CodeInput': {
              boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)',
              borderRadius: '99rem'
            },
            '.Block': {
              borderColor: 'transparent'
            },
            '.BlockDivider': {
              backgroundColor: '#ebebeb'
            },
            '.Tab, .Tab:hover, .Tab:focus': {
              border: '0'
            },
            '.Tab--selected, .Tab--selected:hover': {
              backgroundColor: '#f360a6',
              color: '#fff'
            },
            '.Input': {
                color: 'black'
            },
            '.Error': {
              fontSize: 'small'
            }
          }
      };

    const options: StripeElementsOptions = {
        clientSecret: paymentSecret,
        appearance
    };
    
    return (
      <>
        {paid ? 
          <PaymentSuccess /> 
        : 
          <div className="Payment-container">
              <span className="Payment-text ">{prompt}</span>
              {paymentSecret && 
                  <Elements options={options} stripe={stripe_key}>
                      <PaymentForm />
                  </Elements>
              }
          </div> 
        }
      </>
    )
}