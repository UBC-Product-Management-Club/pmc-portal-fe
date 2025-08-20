import { describe, it, expect } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ActionTypes, UserDataProvider, useUserData } from './UserDataProvider';
import { userEvent } from '@testing-library/user-event';
import { UserFromDatabase } from '../../types/User';
import { BrowserRouter } from 'react-router-dom';

describe('useUserData', () => {
    const mockUser: UserFromDatabase = {
        userId: 'user123',
        email: 'geary@ubcpmc.com',
        university: 'University of British Columbia',
        displayName: 'geary',
        firstName: 'geary',
        lastName: 'abc',
        pfp: 'https://url.com',
        pronouns: '',
        whyPm: 'abc',
        isPaymentVerified: true,
        faculty: 'faculty',
        major: 'major',
        studentId: '12345678',
        year: '3',
    };

    function renderComponent() {
        const TestComponent = () => {
            const { user, update, isMember } = useUserData();

            return (
                <div>
                    {user ? (
                        <>
                            <h1>{user?.displayName}</h1>
                            <h1>{user?.email}</h1>
                        </>
                    ) : (
                        <h1>user is undefined!</h1>
                    )}
                    <p>isMember: {String(isMember)}</p>
                    <button
                        onClick={() =>
                            update({
                                type: ActionTypes.CREATE,
                                payload: {
                                    userId: 'userId',
                                    displayName: 'geary',
                                    pfp: 'newpfp',
                                    email: 'geary@ubcpmc.com',
                                },
                            })
                        }
                    >
                        Create user
                    </button>
                    <button onClick={() => update({ type: ActionTypes.LOAD, payload: mockUser })}>
                        Load user
                    </button>
                    <button
                        onClick={() =>
                            update({
                                type: ActionTypes.UPDATE,
                                payload: { displayName: 'geary is da goat' },
                            })
                        }
                    >
                        Update user
                    </button>
                </div>
            );
        };
        return render(
            <BrowserRouter>
                <UserDataProvider>
                    <TestComponent />
                </UserDataProvider>
            </BrowserRouter>
        );
    }

    it('user is initially undefined', () => {
        renderComponent();

        expect(screen.getByText('user is undefined!')).toBeInTheDocument();
    });

    it('returns undefined when updating an undefined user', async () => {
        const user = userEvent.setup();
        renderComponent();

        await act(() => user.click(screen.getByRole('button', { name: 'Update user' })));

        expect(screen.getByText('user is undefined!')).toBeInTheDocument();
    });

    it('loads an existing user', async () => {
        const user = userEvent.setup();
        renderComponent();

        await act(() => user.click(screen.getByRole('button', { name: 'Load user' })));

        expect(screen.getByText('geary')).toBeInTheDocument();
        expect(screen.getByText('geary@ubcpmc.com')).toBeInTheDocument();
    });

    it('updates user info', async () => {
        const user = userEvent.setup();
        renderComponent();

        await act(() => user.click(screen.getByRole('button', { name: 'Load user' })));

        expect(screen.getByText('geary')).toBeInTheDocument();

        await act(() => user.click(screen.getByRole('button', { name: 'Update user' })));

        expect(screen.getByText('geary is da goat')).toBeInTheDocument();
        expect(screen.getByText('geary@ubcpmc.com')).toBeInTheDocument();
    });

    it('creates a new user', async () => {
        const user = userEvent.setup();
        renderComponent();

        await act(() => user.click(screen.getByRole('button', { name: 'Create user' })));

        expect(screen.getByText('geary')).toBeInTheDocument();
        expect(screen.getByText('geary@ubcpmc.com')).toBeInTheDocument();
    });

    it('correctly sets isMember after loading user', async () => {
        const user = userEvent.setup();
        renderComponent();

        expect(screen.getByText('isMember: false')).toBeInTheDocument();

        await act(() => user.click(screen.getByRole('button', { name: 'Load user' })));

        expect(screen.getByText('isMember: true')).toBeInTheDocument();
    });
});
