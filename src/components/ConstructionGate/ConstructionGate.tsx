import { ReactNode } from 'react';
import { usePortalSettings } from '../../hooks/usePortalSettings';
import UnderConstruction from '../../pages/Status/UnderConstruction';

type ConstructionGateProps = {
    children: ReactNode;
};

export default function ConstructionGate({ children }: ConstructionGateProps) {
    const { constructionModeEnabled, loading } = usePortalSettings();

    if (loading) {
        return <h1 style={{ color: 'white' }}>loading...</h1>;
    }

    if (constructionModeEnabled) {
        return <UnderConstruction />;
    }

    return children;
}
