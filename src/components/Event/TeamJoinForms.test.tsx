import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useTeam } from '../../hooks/useTeam';
import { ApiError } from '../../service/RestClient';
import { TeamJoinForms } from './TeamJoinForms';

vi.mock('../../hooks/useTeam');

describe('TeamJoinForms', () => {
    let createTeam: Mock;
    let joinTeam: Mock;

    const submitName = (name: string) => {
        fireEvent.click(screen.getByRole('button', { name: 'Create a team' }));
        fireEvent.change(screen.getByLabelText('Team name'), { target: { value: name } });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    };

    beforeEach(() => {
        createTeam = vi.fn();
        joinTeam = vi.fn();
        (useTeam as Mock).mockReturnValue({ createTeam, joinTeam });
        render(
            <MemoryRouter>
                <TeamJoinForms eventId="e1" />
            </MemoryRouter>
        );
    });

    it('says what teammates will see before creating or joining', () => {
        expect(
            screen.getByText('Your teammates will see your name and the email you applied with.')
        ).toBeTruthy();
    });

    it('explains a team name that is already taken', async () => {
        createTeam.mockRejectedValue(new ApiError('error', 409, 'TEAM_NAME_TAKEN'));

        submitName('Royal Flush');

        expect(await screen.findByText('Another team already has that name.')).toBeTruthy();
    });

    it('normalizes the team code before joining', async () => {
        joinTeam.mockRejectedValue(new ApiError('error', 404, 'NOT_FOUND'));

        fireEvent.click(screen.getByRole('button', { name: 'Join with a code' }));
        fireEvent.change(screen.getByLabelText('Team code'), { target: { value: ' r 4827 ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Join' }));

        expect(await screen.findByText(/couldn't find a team/)).toBeTruthy();
        expect(joinTeam).toHaveBeenCalledWith('e1', 'R4827');
    });
});
