import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { UserFromDatabase } from '../../types/User';
import AuthorizedRouter from './AuthorizedRouter';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserService } from '../../hooks/useUserService';
import { useNavigate } from 'react-router-dom';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';

vi.mock('@auth0/auth0-react');
vi.mock('react-router-dom');
vi.mock('../../hooks/useUserService');
vi.mock('../../providers/UserData/UserDataProvider');

describe('AuthorizedRouter', () => {
    let mockUpdateFn: Mock;
    let navigateTo: Mock<() => void>;
    let mockGetUser: Mock<() => Promise<UserFromDatabase>>;

    const mockUser: UserFromDatabase = {
        userId: 'user123',
        email: 'test@example.com',
        university: 'University of British Columbia',
        displayName: 'geary',
        firstName: 'geary',
        lastName: 'abc',
        pfp: 'https://url.com',
        pronouns: '',
        whyPm: 'abc',
        isPaymentVerified: false,
        faculty: 'faculty',
        major: 'major',
        studentId: '12345678',
        year: '3',
    };

    async function renderComponent() {
        render(<AuthorizedRouter />);
    }

    beforeEach(() => {
        mockUpdateFn = vi.fn();
        mockGetUser = vi.fn();
        navigateTo = vi.fn();
        vi.mocked(useAuth0, { partial: true }).mockReturnValue({
            user: {
                name: 'geary',
                sub: 'userId',
                email: 'geary@ubcpmc.com',
                picture: 'link_to_pfp',
            },
            getAccessTokenSilently: vi.fn().mockResolvedValue('jwt'),
        });
        vi.mocked(useUserService, { partial: true }).mockReturnValue({
            me: mockGetUser,
        });
        vi.mocked(useNavigate).mockReturnValue(navigateTo);
        vi.mocked(useUserData, { partial: true }).mockReturnValue({
            update: mockUpdateFn,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('goes to onboarding if new user logs in', async () => {
        mockGetUser.mockRejectedValueOnce(new Error("user doesn't exist!"));

        await act(() => renderComponent());

        expect(mockUpdateFn).toHaveBeenCalledWith({
            type: ActionTypes.CREATE,
            payload: {
                userId: 'userId',
                email: 'geary@ubcpmc.com',
                pfp: 'link_to_pfp',
                displayName: 'geary',
            },
        });
        expect(navigateTo).toHaveBeenCalledWith('/onboarding');
        expect(localStorage.setItem).toHaveBeenCalledWith('id_token', 'jwt');
    });

    it('goes to dashboard when existing user logs in', async () => {
        mockGetUser.mockResolvedValueOnce(mockUser);

        await act(() => renderComponent());

        expect(mockUpdateFn).toHaveBeenCalledWith({
            type: ActionTypes.LOAD,
            payload: mockUser,
        });
        expect(navigateTo).toHaveBeenCalledWith('/dashboard');
        expect(localStorage.setItem).toHaveBeenCalledWith('id_token', 'jwt');
    });

    it('is loading when auth0User hasnt loaded', async () => {
        vi.mocked(useAuth0, { partial: true }).mockReturnValue({
            user: undefined,
        });

        await act(() => renderComponent());

        expect(screen.getByText('loading...')).toBeInTheDocument();
    });
});
