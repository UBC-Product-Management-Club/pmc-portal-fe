import { describe, expect, it } from 'vitest';
import { Attendee } from '../../types/Attendee';
import { Event } from '../../types/Event';
import { formatPacific, getEventStatus } from './eventStatus';

const day = 24 * 60 * 60 * 1000;
const iso = (offset: number) => new Date(Date.now() + offset).toISOString();

const event = {
    registrationOpens: iso(-day),
    registrationCloses: iso(day),
    registered: 10,
    maxAttendees: 52,
} as Event;

const attendee = (fields: Partial<Attendee>) => fields as Attendee;
const status = (a: Attendee | null, extra: Partial<Parameters<typeof getEventStatus>[0]> = {}) =>
    getEventStatus({ event, attendee: a, hasDraft: false, isSignedIn: true, ...extra });

describe('getEventStatus', () => {
    it('uses the server workflow_state when present', () => {
        expect(status(attendee({ status: 'ACCEPTED', workflowState: 'PAYMENT_PROCESSING' }))).toBe(
            'PAYMENT_PROCESSING'
        );
    });

    it('works out each attendee status', () => {
        expect(status(attendee({ status: 'APPLIED' }))).toBe('UNDER_REVIEW');
        expect(status(attendee({ status: 'REGISTERED' }))).toBe('REGISTERED');
        expect(status(attendee({ status: 'REJECTED' }))).toBe('NOT_SELECTED');
        expect(status(attendee({ status: 'ACCEPTED', paymentDueAt: iso(day) }))).toBe(
            'PAYMENT_WINDOW_OPEN'
        );
        expect(status(attendee({ status: 'ACCEPTED', paymentDueAt: iso(-day) }))).toBe(
            'PAYMENT_WINDOW_PASSED'
        );
    });

    it('shows Draft only before applying', () => {
        expect(status(null, { hasDraft: true })).toBe('DRAFT');
        expect(status(null)).toBe('NOT_APPLIED');
        expect(status(attendee({ status: 'APPLIED' }), { hasDraft: true })).toBe('UNDER_REVIEW');
    });

    it('handles the registration window and cap', () => {
        expect(status(null, { isSignedIn: false })).toBe('SIGNED_OUT');
        expect(status(null, { event: { ...event, registrationOpens: iso(day) } })).toBe(
            'NOT_OPEN_YET'
        );
        expect(status(null, { event: { ...event, registrationCloses: iso(-day) } })).toBe('CLOSED');
        expect(status(null, { event: { ...event, registered: 52 } })).toBe('FULL');
    });
});

describe('formatPacific', () => {
    it('writes the deadline in Pacific time', () => {
        expect(formatPacific('2026-11-22T20:00:00.000Z')).toBe('Sun Nov 22, 12:00 PM PT');
    });
});
