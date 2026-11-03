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
        'pmc-btn-gradient mt-4 ml-auto flex min-h-12 cursor-pointer items-center rounded-full px-7 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
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
                fontFamily: 'Poppins, system-ui, sans-serif',
                fontWeightNormal: '500',
                colorPrimary: '#5a54c9',
                colorText: '#1d1838',
                colorTextSecondary: '#6b6584',
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
                    backgroundColor: '#5a54c9',
                    color: '#fff',
                },
                '.Input': {
                    color: '#1d1838',
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
            <Elements
                stripe={stripe_key}
                options={{
                    appearance,
                    fonts: [
                        {
                            cssSrc: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
                        },
                    ],
                    ...elementsOptions,
                }}
            >
                <PaymentComponent onPayment={onPayment} onError={onError} />
            </Elements>
        );
    } else {
        return <h1>Loading...</h1>;
    }
}

export { Payment };
export type { PaymentProps };
