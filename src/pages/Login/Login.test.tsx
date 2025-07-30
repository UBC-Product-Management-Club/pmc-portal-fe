import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useAuth0 } from '@auth0/auth0-react';

vi.mock('react-router-dom');
vi.mock('@auth0/auth0-react');

describe('login', () => {
    let mockUseNavigate: Mock;
    let mockLogin: Mock;

    beforeEach(() => {
        mockUseNavigate = vi.fn();
        mockLogin = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockUseNavigate);
        vi.mocked(useAuth0, { partial: true }).mockReturnValue({
            loginWithRedirect: mockLogin,
        });
    });

    function renderComponent() {
        render(<Login />);
    }

    it('shows text, logo, and buttons', () => {
        renderComponent();

        expect(screen.getByText('PMC Membership Portal')).toBeInTheDocument();
        expect(screen.getByTestId('logo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log in / sign up' }));
    });

    it('can login', async () => {
        const user = userEvent.setup();
        renderComponent();

        await act(() => user.click(screen.getByRole('button', { name: 'Log in / sign up' })));
        expect(mockLogin).toHaveBeenCalled();
    });
});
