import { RestClient } from './RestClient';

export type PortalSettings = {
    construction_mode_enabled: boolean;
};

class PortalSettingsService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/settings`);
    }

    getSettings(): Promise<PortalSettings> {
        return this.client.get<PortalSettings>('/');
    }
}

export { PortalSettingsService };
