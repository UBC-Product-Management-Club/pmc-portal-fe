import { useCallback, useMemo } from 'react';
import { createTeamService } from '../service/services';
import { TeamResponseSchema } from '../types/Team';

function useTeam() {
    const teamService = useMemo(() => createTeamService(), []);

    const getTeam = useCallback(
        async (eventId: string) => {
            const team = await teamService.getTeam(eventId);
            return TeamResponseSchema.parse(team);
        },
        [teamService]
    );

    const createTeam = useCallback(
        async (eventId: string, teamName: string) => {
            const team = await teamService.createTeam(eventId, teamName);
            return TeamResponseSchema.parse(team);
        },
        [teamService]
    );

    const joinTeam = useCallback(
        async (eventId: string, teamCode: string) => {
            const team = await teamService.joinTeam(eventId, teamCode);
            return TeamResponseSchema.parse(team);
        },
        [teamService]
    );

    const renameTeam = useCallback(
        async (eventId: string, teamName: string) => {
            const team = await teamService.renameTeam(eventId, teamName);
            return TeamResponseSchema.parse(team);
        },
        [teamService]
    );

    const leaveTeam = useCallback(
        async (eventId: string) => {
            return await teamService.leaveTeam(eventId);
        },
        [teamService]
    );

    const submitDeliverable = useCallback(
        async (eventId: string, phaseId: string, deliverableData: FormData) => {
            return await teamService.submitDeliverable(eventId, phaseId, deliverableData);
        },
        [teamService]
    );

    const getDeliverable = useCallback(
        async (eventId: string, phaseId: string) => {
            return await teamService.getDeliverable(eventId, phaseId);
        },
        [teamService]
    );

    return {
        getTeam,
        createTeam,
        joinTeam,
        renameTeam,
        leaveTeam,
        submitDeliverable,
        getDeliverable,
    };
}

export { useTeam };
