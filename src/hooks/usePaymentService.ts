import { PaymentService } from "../service/PaymentService";

export function usePaymentService() {
    return new PaymentService()
}