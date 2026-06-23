import { describe, expect, it, vi } from 'vitest';
import { RestClient } from './RestClient';
import { PortalSettingsService } from './PortalSettingsService';

describe('PortalSettingsService', () => {
    const mockClient = {
        get: vi.fn(),
    };

    const service = new PortalSettingsService(mockClient as unknown as RestClient);

    it('fetches portal settings', async () => {
        mockClient.get.mockResolvedValueOnce({ construction_mode_enabled: true });

        const settings = await service.getSettings();

        expect(settings).toEqual({ construction_mode_enabled: true });
        expect(mockClient.get).toHaveBeenCalledWith('/');
    });
});
