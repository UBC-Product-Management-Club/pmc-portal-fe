import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ConstructionGate from './ConstructionGate';
import { usePortalSettings } from '../../hooks/usePortalSettings';

vi.mock('../../hooks/usePortalSettings');

describe('ConstructionGate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while settings are fetched', () => {
        vi.mocked(usePortalSettings).mockReturnValue({
            constructionModeEnabled: false,
            loading: true,
        });

        render(
            <ConstructionGate>
                <div>portal content</div>
            </ConstructionGate>
        );

        expect(screen.getByText('loading...')).toBeInTheDocument();
    });

    it('shows construction page when construction mode is enabled', () => {
        vi.mocked(usePortalSettings).mockReturnValue({
            constructionModeEnabled: true,
            loading: false,
        });

        render(
            <ConstructionGate>
                <div>portal content</div>
            </ConstructionGate>
        );

        expect(screen.getByText('construction')).toBeInTheDocument();
        expect(screen.queryByText('portal content')).not.toBeInTheDocument();
    });

    it('renders children when construction mode is disabled', () => {
        vi.mocked(usePortalSettings).mockReturnValue({
            constructionModeEnabled: false,
            loading: false,
        });

        render(
            <ConstructionGate>
                <div>portal content</div>
            </ConstructionGate>
        );

        expect(screen.getByText('portal content')).toBeInTheDocument();
    });
});
