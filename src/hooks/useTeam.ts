import { useCallback, useMemo } from 'react';
import { TeamService } from '../service/TeamService';
import { TeamResponseSchema } from '../types/Team';

function useTeam() {
    const teamService = useMemo(() => new TeamService(), []);

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

    const leaveTeam = useCallback(
        async (eventId: string) => {
            return await teamService.leaveTeam(eventId);
        },
        [teamService]
    );

    const submitDeliverable = useCallback(
        async (eventId: string, deliverableData: FormData) => {
            return await teamService.submitDeliverable(eventId, deliverableData);
        },
        [teamService]
    );

    const getDeliverable = useCallback(
        async (eventId: string) => {
            return await teamService.getDeliverable(eventId);
        },
        [teamService]
    );

    return { getTeam, createTeam, joinTeam, leaveTeam, submitDeliverable, getDeliverable };
}

export { useTeam };
