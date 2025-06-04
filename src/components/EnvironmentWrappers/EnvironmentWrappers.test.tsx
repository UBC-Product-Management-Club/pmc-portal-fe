import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import {DevRenderer} from "./DevRenderer";
import {ProdRenderer} from "./ProdRenderer";
import { useEnvironment } from '../../hooks/useEnvironment';

vi.mock('../../hooks/useEnvironment', () => ({
  useEnvironment: vi.fn(),
}));

describe('environmentRenderers', () => {
    const mockUseEnvironment = vi.mocked(useEnvironment)

    beforeEach(() => {
        vi.clearAllMocks();
    });

    function renderComponent() {
        render(
            <>
                <DevRenderer>
                    <h1>DevPaths</h1>
                </DevRenderer>
                <ProdRenderer>
                    <h1>ProdPaths</h1>
                </ProdRenderer>
                <h1>UnwrappedComponent</h1>
            </>
        )
    }

    it('render components in DevRenderer component and not in ProdRenderer component', () => {
        mockUseEnvironment.mockReturnValue({ 
            isProd: false, 
        });

        renderComponent();
        
        expect(mockUseEnvironment).toHaveBeenCalled();
        expect(screen.getByText('UnwrappedComponent')).toBeInTheDocument();
        expect(screen.getByText('DevPaths')).toBeInTheDocument();
        expect(screen.queryByText('ProdPaths')).not.toBeInTheDocument();
        
    })

    it('render components in ProdRenderer component and not in DevRenderer component', () => {
        mockUseEnvironment.mockReturnValue({ 
            isProd: true, 
        });
        
        renderComponent();

        expect(mockUseEnvironment).toHaveBeenCalled();
        expect(screen.getByText('ProdPaths')).toBeInTheDocument();
        expect(screen.getByText('UnwrappedComponent')).toBeInTheDocument();
        expect(screen.queryByText('DevPaths')).not.toBeInTheDocument();

    })
    
})