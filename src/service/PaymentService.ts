import { StripeElementsOptions, StripePaymentElementOptions } from "@stripe/stripe-js";
import { RestClient } from "./RestClient";
import { Universities } from "../types/User";

enum PaymentType {
    MEMBERSHIP = "membership",
    EVENT = "event"
}

interface CreatePaymentIntentResponse {
    clientSecret: string
}

interface FetchFeeResponse {
    ubcPrice: number;
    nonUbcPrice: number;
}

type getElementOptionsOptions = { type: PaymentType.MEMBERSHIP, university: string } 
| { type: PaymentType.EVENT, eventId: string }

class PaymentService {
    private client: RestClient

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v1/payments`);
    }

    getPaymentElementOptions() : StripePaymentElementOptions {
        return {
            layout: "tabs",
            wallets: {
                applePay: "never",
                googlePay: "never"
            }
        }
    }

    async getMembershipFee(): Promise<FetchFeeResponse> {
        return (await this.client.get<FetchFeeResponse>(`/membership`))
    }

    async getEventRegistrationFee(eventId: string): Promise<number> {
        if (!eventId) {
            throw new Error("Invalid event Id!")
        }
        return new Promise(() => {0})
    }

    async getElementsOptions(options: getElementOptionsOptions): Promise<StripeElementsOptions> {
        switch (options.type) {
            case PaymentType.MEMBERSHIP:
                return this.getMembershipFeeElementsOptions(options.university === Universities[0])
            case PaymentType.EVENT:
                return this.getEventRegFeeElementsOptions(options.eventId)
            default:
                throw new Error("invalid payment type")
        }
    }

    private async getMembershipFeeElementsOptions(ubc: boolean): Promise<StripeElementsOptions> {
        return {
            clientSecret: (await this.client.get<CreatePaymentIntentResponse>(`/create/membership?ubc=${ubc}`)).clientSecret
        }
    }

    private async getEventRegFeeElementsOptions(eventId: string): Promise<StripeElementsOptions> {
        if (!eventId) {
            throw new Error("Missing event Id")
        }
        return {
            clientSecret: (await this.client.get<CreatePaymentIntentResponse>(`/create/event/${eventId}`)).clientSecret
        }
    }


}

export { PaymentService, PaymentType }
export type {FetchFeeResponse, getElementOptionsOptions }