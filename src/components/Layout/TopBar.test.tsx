import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { TopBar } from './TopBar';

vi.mock('../../providers/UserData/UserDataProvider', () => ({
    useUserData: vi.fn(),
}));

const renderBar = () =>
    render(
        <MemoryRouter>
            <TopBar onOpenMenu={() => {}} />
        </MemoryRouter>
    );

const offer = () => screen.queryByRole('link', { name: 'Become a PMC Member' });

describe('TopBar', () => {
    beforeEach(() => sessionStorage.clear());

    it('offers membership to a non-member', () => {
        (useUserData as Mock).mockReturnValue({ isMember: false });
        renderBar();
        expect(offer()).toBeInTheDocument();
    });

    it('never offers membership to a member', () => {
        (useUserData as Mock).mockReturnValue({ isMember: true });
        renderBar();
        expect(offer()).not.toBeInTheDocument();
    });

    it('stays closed for the session once a non-member closes it', async () => {
        (useUserData as Mock).mockReturnValue({ isMember: false });
        const { unmount } = renderBar();
        screen.getByRole('button', { name: 'Close membership offer' }).click();
        await waitFor(() => expect(offer()).not.toBeInTheDocument());
        unmount();
        renderBar();
        expect(offer()).not.toBeInTheDocument();
    });
});
