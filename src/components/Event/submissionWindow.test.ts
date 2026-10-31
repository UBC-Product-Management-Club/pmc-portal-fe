import { describe, expect, it } from 'vitest';
import { ApiError } from '../../service/RestClient';
import { Phase } from '../../types/EventDay';
import { effectiveDeadline, windowState } from './submissionWindow';
import { normalizeTeamCode, teamErrorMessage } from './teamErrors';

const phase = (fields: Partial<Phase> = {}) =>
    ({
        isEnabled: true,
        startTime: '2026-11-21T18:00:00.000Z',
        deadline: '2026-11-22T20:00:00.000Z',
        extendedUntil: null,
        ...fields,
    }) as Phase;

describe('submission window', () => {
    it('uses the later of the deadline and the team extension', () => {
        expect(effectiveDeadline(phase({ extendedUntil: '2026-11-22T20:30:00.000Z' }))).toBe(
            '2026-11-22T20:30:00.000Z'
        );
        expect(effectiveDeadline(phase({ extendedUntil: '2026-11-22T19:00:00.000Z' }))).toBe(
            '2026-11-22T20:00:00.000Z'
        );
    });

    it('is open until the deadline when there is no start time, like the server', () => {
        const noStart = phase({ startTime: null });
        expect(windowState(noStart, new Date('2026-11-01T00:00:00.000Z'))).toBe('open');
        expect(windowState(noStart, new Date('2026-11-22T20:00:00.000Z'))).toBe('closed');
    });

    it('is half-open: an exact-deadline save is closed', () => {
        expect(windowState(phase(), new Date('2026-11-21T18:00:00.000Z'))).toBe('open');
        expect(windowState(phase(), new Date('2026-11-22T19:59:59.999Z'))).toBe('open');
        expect(windowState(phase(), new Date('2026-11-22T20:00:00.000Z'))).toBe('closed');
        expect(windowState(phase(), new Date('2026-11-21T17:59:59.000Z'))).toBe('not-open');
        expect(windowState(phase({ isEnabled: false }), new Date())).toBe('disabled');
    });
});

describe('team codes', () => {
    it('accepts lowercase and spaces', () => {
        expect(normalizeTeamCode(' r 4827 ')).toBe('R4827');
    });

    it('explains each team error code', () => {
        expect(teamErrorMessage(new ApiError('x', 409, 'ROSTER_LOCKED'))).toMatch(/submitted/);
        expect(teamErrorMessage(new ApiError('x', 429, 'RATE_LIMITED'))).toMatch(/Too many/);
        expect(teamErrorMessage(new Error('network'))).toMatch(/Something went wrong/);
    });
});
