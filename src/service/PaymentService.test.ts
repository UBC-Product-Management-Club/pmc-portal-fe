import { describe, it, expect, vi } from 'vitest';
import { PaymentService, PaymentType } from './PaymentService';
import type { RestClient } from './RestClient';
import { Universities } from '../types/User';

describe('PaymentService', () => {
    const mockClient = {
        get: vi.fn(),
    };

    const service = new PaymentService(mockClient as unknown as RestClient);

    it('fetches membership fee correctly', async () => {
        const mockResponse = { ubcPrice: 10, nonUbcPrice: 20 };
        mockClient.get.mockResolvedValueOnce(mockResponse);

        const result = await service.getMembershipFee();

        expect(mockClient.get).toHaveBeenCalledWith('/membership');
        expect(result).toEqual(mockResponse);
    });

    it('fetches event fee correctly', async () => {
        // TODO
    });

    it('fetches payment element options', () => {
        expect(service.getPaymentElementOptions()).toEqual({
            layout: 'tabs',
            wallets: {
                applePay: 'never',
                googlePay: 'never',
            },
        });
    });

    describe('fetches element options for', () => {
        it('membership fee for ubc student', async () => {
            mockClient.get.mockResolvedValueOnce({
                clientSecret: 'client_secret',
            });

            const result = await service.getElementsOptions({
                type: PaymentType.MEMBERSHIP,
                university: Universities[0],
            });

            expect(mockClient.get).toHaveBeenCalledWith('/create/membership?ubc=true');
            expect(result).toEqual({
                clientSecret: 'client_secret',
            });
        });

        it('membership fee for non-ubc student', async () => {
            mockClient.get.mockResolvedValueOnce({
                clientSecret: 'client_secret',
            });

            const result = await service.getElementsOptions({
                type: PaymentType.MEMBERSHIP,
                university: Universities[1],
            });

            expect(mockClient.get).toHaveBeenCalledWith('/create/membership?ubc=false');
            expect(result).toEqual({
                clientSecret: 'client_secret',
            });
        });

        it('event fee', async () => {
            mockClient.get.mockResolvedValueOnce({
                clientSecret: 'client_secret',
            });

            const result = await service.getElementsOptions({
                type: PaymentType.EVENT,
                eventId: 'eventId',
            });

            expect(mockClient.get).toHaveBeenCalledWith('/create/event/eventId');
            expect(result).toEqual({
                clientSecret: 'client_secret',
            });
        });
    });
});
