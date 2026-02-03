import { Appearance, loadStripe, PaymentIntent, StripeElementsOptions } from '@stripe/stripe-js';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { usePayments } from '../../hooks/usePayments';
import { getElementOptionsOptions } from '../../service/PaymentService';
import { usePaymentService } from '../../hooks/usePaymentService';

const stripe_key = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface PaymentProps {
    onPayment: (paymentIntent: PaymentIntent) => void;
    onError: (e: Error) => void;
    options: getElementOptionsOptions;
}

type PaymentComponentProps = Omit<PaymentProps, 'type' | 'options'>;

function PaymentComponent({ onPayment, onError }: PaymentComponentProps) {
    const { pay, processing } = usePayments();
    const submitClass =
        'ml-auto mt-2 block rounded-lg bg-white px-8 py-2 font-semibold text-pmc-midnight-blue';
    return (
        <>
            {processing && <p>processing</p>}
            <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    pay()
                        .then(onPayment)
                        .catch((e: Error) => onError(e));
                }}
            >
                <PaymentElement />
                <button className={submitClass} type="submit">
                    Continue
                </button>
            </form>
        </>
    );
}

function Payment({ onPayment, onError, options }: PaymentProps) {
    const paymentService = usePaymentService();
    const [elementsOptions, setElementOptions] = useState<StripeElementsOptions>();

    useEffect(() => {
        paymentService
            .getElementsOptions(options)
            .then(setElementOptions)
            .catch(() => console.error("couldn't fetch client secret"));
    }, [paymentService, options]);

    const appearance: Appearance = useMemo(
        () => ({
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
                    borderColor: 'transparent',
                },
                '.BlockDivider': {
                    backgroundColor: '#ebebeb',
                },
                '.Tab, .Tab:hover, .Tab:focus': {
                    border: '0',
                },
                '.Tab--selected, .Tab--selected:hover': {
                    backgroundColor: '#f360a6',
                    color: '#fff',
                },
                '.Input': {
                    color: 'black',
                },
                '.Error': {
                    fontSize: 'small',
                },
            },
        }),
        []
    );

    if (elementsOptions) {
        return (
            <Elements stripe={stripe_key} options={{ appearance, ...elementsOptions }}>
                <PaymentComponent onPayment={onPayment} onError={onError} />
            </Elements>
        );
    } else {
        return <h1>Loading...</h1>;
    }
}

export { Payment };
export type { PaymentProps };
