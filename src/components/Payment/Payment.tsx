import { Appearance, loadStripe, PaymentIntent, StripeElementsOptions } from "@stripe/stripe-js"
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { usePayments } from "../../hooks/usePayments";
import { getElementOptionsOptions } from "../../service/PaymentService";
import { styled } from "styled-components";
import { usePaymentService } from "../../hooks/usePaymentService";

const stripe_key = loadStripe(import.meta.env.VITE_STRIPE_KEY)

interface PaymentProps {
    onPayment: (paymentIntent: PaymentIntent) => void,
    onError: (e: Error) => void,
    options: getElementOptionsOptions
}

type PaymentComponentProps = Omit<PaymentProps, "type" | "options">

const Submit = styled.button`
    cursor: pointer;
    display: block;
    font-family: poppins;
    font-weight: 600;
    margin-top: 0.5rem;
    margin-left: auto;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    color: var(--pmc-midnight-blue);
`

function PaymentComponent({ onPayment, onError } : PaymentComponentProps) {
    const { pay, processing } = usePayments()
    return (
        <>
            {processing && <p>processing</p>}
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
                    pay().then(onPayment).catch((e: Error) => onError(e))
                }}>
                <PaymentElement />
                <Submit type="submit">Continue</Submit>
            </form>
        </>
    )
}

function Payment({ onPayment, onError, options } : PaymentProps) {
    const paymentService = usePaymentService() 
    const [elementsOptions, setElementOptions] = useState<StripeElementsOptions>()

    useEffect(() => {
        paymentService.getElementsOptions(options)
        .then(setElementOptions)
        .catch(() => console.error("couldn't fetch client secret"))
    },[])

    const appearance : Appearance = useMemo(() => ({
        theme: 'stripe',
        labels: 'floating',
        variables: {
            fontWeightNormal: '500',
          },
          rules: {
            '.Tab, .Input, .Block, .CheckboxInput, .CodeInput': {
              borderRadius: '0.5rem',
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
    }),[])

   
    if (elementsOptions) {
        return (
            <Elements stripe={stripe_key} options={{appearance, ...elementsOptions}}>
                <PaymentComponent
                    onPayment={onPayment}
                    onError={onError}
                />
            </Elements>
        )
    } else {
        return <h1>Loading...</h1>
    }
}

export { Payment }
export type { PaymentProps }
