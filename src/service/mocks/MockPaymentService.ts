import type { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import type { CheckoutSessionResponse, FetchFeeResponse, PaymentService } from '../PaymentService';
import { getMockState, markMockPaid, setMockState } from './MockAttendeeService';
import { delay, mockError } from './mockData';

const session = (url: string): CheckoutSessionResponse => ({
    id: 'cs_mock',
    url,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
});

// Stands in for Stripe until we have access: no network calls, and "checkout" goes straight
// to the success redirect. The checks match the backend's event checkout.
class MockPaymentService implements Pick<PaymentService, keyof PaymentService> {
    getPaymentElementOptions(): StripePaymentElementOptions {
        return { layout: 'tabs', wallets: { applePay: 'never', googlePay: 'never' } };
    }

    async getMembershipFee(): Promise<FetchFeeResponse> {
        await delay();
        return { ubcPrice: 1067, nonUbcPrice: 2067 };
    }

    // The embedded membership form only works with a real Stripe client secret
    async getElementsOptions(): Promise<StripeElementsOptions> {
        await delay();
        throw new Error('The membership payment form needs Stripe access');
    }

    async createStripeSessionUrl(): Promise<CheckoutSessionResponse> {
        await delay();
        return session('/dashboard/success?member=yes');
    }

    async getOrCreateEventCheckoutSession(eventId: string): Promise<CheckoutSessionResponse> {
        await delay();
        const state = getMockState();
        if (state === 'registered') throw mockError(409, 'ALREADY_REGISTERED');
        if (state === 'payment-passed') throw mockError(409, 'HOLD_EXPIRED');
        if (state === 'processing') throw mockError(409, 'PAYMENT_PROCESSING');
        if (state !== 'accepted') throw mockError(409, 'NOT_ACCEPTED');

        markMockPaid();
        return session(`/events/${eventId}?success=true&session_id=cs_mock`);
    }

    // Free events register straight away and return nothing, like the backend
    async getOrCreateRSVPCheckoutSession(): Promise<CheckoutSessionResponse> {
        await delay();
        setMockState('registered');
        return null as unknown as CheckoutSessionResponse;
    }
}

export { MockPaymentService };
