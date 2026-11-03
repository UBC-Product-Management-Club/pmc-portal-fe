import { DeliverableVersion, TeamResponse } from '../../types/Team';
import type { TeamService } from '../TeamService';
import { delay, mockError, mockTeam } from './mockData';

// Join with the code R4827 to get the sample team back after leaving it.
// ?finalist=yes|no plays results being published; without it is_finalist is left out.
const withFinalist = (current: TeamResponse): TeamResponse => {
    const finalist = new URLSearchParams(window.location.search).get('finalist');
    if (finalist !== 'yes' && finalist !== 'no') return current;
    return { ...current, Team: { ...current.Team, is_finalist: finalist === 'yes' } };
};

let team: TeamResponse | null = mockTeam();

class MockTeamService implements Pick<TeamService, keyof TeamService> {
    async getTeam(): Promise<TeamResponse> {
        await delay();
        if (!team) throw mockError(404, 'NOT_ON_TEAM');
        return withFinalist(team);
    }

    async createTeam(_eventId: string, teamName: string): Promise<TeamResponse> {
        await delay();
        if (team) throw mockError(409, 'ALREADY_ON_TEAM');
        const sample = mockTeam();
        team = {
            ...sample,
            Team: {
                ...sample.Team,
                team_name: teamName,
                team_code: 'K1093',
                Team_Member: [sample.Team.Team_Member[0]],
            },
        };
        return team;
    }

    async joinTeam(_eventId: string, teamCode: string): Promise<TeamResponse> {
        await delay();
        if (team) throw mockError(409, 'ALREADY_ON_TEAM');
        if (teamCode.replace(/\s/g, '').toUpperCase() !== 'R4827')
            throw mockError(404, 'NOT_FOUND');
        team = mockTeam();
        return team;
    }

    async renameTeam(_eventId: string, teamName: string): Promise<TeamResponse> {
        await delay();
        if (!team) throw mockError(404, 'NOT_ON_TEAM');
        const name = teamName.trim();
        if (name.length < 1 || name.length > 80) throw mockError(400, 'VALIDATION_ERROR');
        team = { ...team, Team: { ...team.Team, team_name: name } };
        return team;
    }

    async leaveTeam(): Promise<{ message: string }> {
        await delay();
        team = null;
        return { message: 'Left team' };
    }

    // Older deliverable calls; the new form uses MockSubmissionService
    async submitDeliverable(): Promise<{ message: string }> {
        await delay();
        return { message: 'Submitted' };
    }

    async getDeliverable(): Promise<DeliverableVersion | null> {
        await delay();
        return null;
    }
}

export { MockTeamService };
