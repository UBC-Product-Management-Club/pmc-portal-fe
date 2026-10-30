import { ApiError } from '../../service/RestClient';

const MESSAGES: Record<string, string> = {
    NOT_FOUND: "We couldn't find a team with that code. Check it with your teammate.",
    TEAM_FULL: 'That team is already full.',
    ALREADY_ON_TEAM: "You're already on a team.",
    TEAM_NAME_TAKEN: 'Another team already has that name.',
    NOT_ON_TEAM: "You're not on a team for this event.",
    ROSTER_LOCKED: "This team has already submitted, so its members can't change.",
    RATE_LIMITED: 'Too many tries. Wait a minute, then try again.',
    NOT_REGISTERED: 'Only registered students can join teams.',
    VALIDATION_ERROR: 'Team names must be 1 to 80 characters.',
    CLOSED: 'The deadline has passed, so teams can no longer change.',
};

export function teamErrorMessage(error: unknown) {
    const code = error instanceof ApiError ? error.code : undefined;
    return (code && MESSAGES[code]) ?? 'Something went wrong. Please try again.';
}

// Codes are one letter and four digits; lowercase and spaces are fine
export const normalizeTeamCode = (code: string) => code.replace(/\s/g, '').toUpperCase();
