import "./Payment.css"
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useContext, useEffect, useState } from "react";
import { paymentIntentResponse } from "../../types/api";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { OnboardingContext } from "../OnboardingForm/Context";

// console.log("stripe key " + import.meta.env.VITE_STRIPE_KEY)
const stripe_key = loadStripe(import.meta.env.VITE_STRIPE_KEY)

export default function Payment() {
    // TODO:
    // - Needs a "back" butjon
    
    const [paymentSecret, setPaymentSecret] = useState<string>("")
    // const { setCurrPage } = useContext(OnboardingContext)

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        const fetchPaymentIntent = async () => {
            try {
                // console.log("fetching payment intent")
                const paymentIntent = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/membership`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                })
                const res: paymentIntentResponse = await paymentIntent.json();
                // console.log("secret: " + res.payment_secret);
                setPaymentSecret(res.payment_secret)
            } catch (error) {
                console.log("Error creating payment intent.")
            }
        }
        fetchPaymentIntent()
      }, []);

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

    // Might need this in the future but it resets the form.
    // function goBack() {
    //   // goes back to userInfo page
    //   setCurrPage("userInfo")
      
    // }
    

    return (
        <div className="Payment-container">
            <span className="Payment-text ">To become a PMC member for the 2024/2025 academic year, a $10 membership fee is required.</span>
            {paymentSecret && 
                <Elements options={options} stripe={stripe_key}>
                    <PaymentForm />
                </Elements>
            }
            {/* <button onClick={goBack}>Back</button> */}
        </div>
    )
}