import { useMemo } from 'react';
import { createPaymentService } from '../service/services';

export function usePaymentService() {
    return useMemo(() => createPaymentService(), []);
}
