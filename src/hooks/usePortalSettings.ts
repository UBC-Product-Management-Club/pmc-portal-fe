import { useEffect, useState } from 'react';
import { PortalSettingsService } from '../service/PortalSettingsService';

function usePortalSettings() {
    const [constructionModeEnabled, setConstructionModeEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const service = new PortalSettingsService();

        service
            .getSettings()
            .then((settings) => setConstructionModeEnabled(settings.construction_mode_enabled))
            .catch((error) => {
                console.error('Failed to fetch portal settings:', error);
                setConstructionModeEnabled(true);
            })
            .finally(() => setLoading(false));
    }, []);

    return { constructionModeEnabled, loading };
}

export { usePortalSettings };
