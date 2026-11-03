import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getMockState, setMockState } from './MockAttendeeService';
import { MockPaymentService } from './MockPaymentService';

describe('MockPaymentService', () => {
    const service = new MockPaymentService();

    beforeEach(() => {
        sessionStorage.clear();
        vi.useRealTimers();
    });

    it('goes from accepted to the success redirect, then registers', async () => {
        setMockState('accepted');

        const { url } = await service.getOrCreateEventCheckoutSession('e1');

        expect(url).toBe('/events/e1?success=true&session_id=cs_mock');
        expect(getMockState()).toBe('processing');

        vi.useFakeTimers({ now: Date.now() + 4000 });
        expect(getMockState()).toBe('registered');
    });

    it.each([
        ['registered', 'ALREADY_REGISTERED'],
        ['payment-passed', 'HOLD_EXPIRED'],
        ['processing', 'PAYMENT_PROCESSING'],
        ['applied', 'NOT_ACCEPTED'],
    ] as const)('refuses checkout when %s', async (state, code) => {
        setMockState(state);

        await expect(service.getOrCreateEventCheckoutSession('e1')).rejects.toMatchObject({ code });
    });

    it('registers free events without a session', async () => {
        await expect(service.getOrCreateRSVPCheckoutSession()).resolves.toBeNull();
        expect(getMockState()).toBe('registered');
    });
});
