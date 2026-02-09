import { useMemo } from 'react';
import { PaymentService } from '../service/PaymentService';

export function usePaymentService() {
    return useMemo(() => new PaymentService(), []);
}
