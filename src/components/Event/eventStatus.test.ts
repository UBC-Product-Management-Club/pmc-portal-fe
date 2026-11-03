import { describe, expect, it } from 'vitest';
import { Attendee } from '../../types/Attendee';
import { Event } from '../../types/Event';
import {
    displayBadge,
    eventTiming,
    formatPacific,
    getEventStatus,
    homeStatus,
} from './eventStatus';

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

describe('homeStatus', () => {
    const row = (
        status: Attendee['status'] | null,
        hasDraft = false,
        paymentDueAt: string | null = null
    ) => ({
        status,
        hasDraft,
        paymentDueAt,
    });

    it('maps each status to the event page label', () => {
        expect(homeStatus(undefined)).toBeNull();
        expect(homeStatus(row(null, true))).toBe('DRAFT');
        expect(homeStatus(row('APPLIED'))).toBe('UNDER_REVIEW');
        expect(homeStatus(row('ACCEPTED', false, iso(day)))).toBe('PAYMENT_WINDOW_OPEN');
        expect(homeStatus(row('ACCEPTED', false, iso(-day)))).toBe('PAYMENT_WINDOW_PASSED');
        expect(homeStatus(row('PROCESSING'))).toBe('PAYMENT_PROCESSING');
        expect(homeStatus(row('REGISTERED'))).toBe('REGISTERED');
        expect(homeStatus(row('REJECTED'))).toBe('NOT_SELECTED');
    });

    it('lets an attendee row win over a stale draft', () => {
        expect(homeStatus(row('APPLIED', true))).toBe('UNDER_REVIEW');
    });
});

describe('eventTiming and displayBadge', () => {
    const times = (start: number, end: number) => ({ startTime: iso(start), endTime: iso(end) });

    it('works out upcoming, live and ended', () => {
        expect(eventTiming(times(day, 2 * day))).toBe('upcoming');
        expect(eventTiming(times(-day, day))).toBe('live');
        expect(eventTiming(times(-2 * day, -day))).toBe('ended');
    });

    it('shows Ended to everyone once the event is over', () => {
        expect(displayBadge('REGISTERED', 'ended')?.label).toBe('Ended');
        expect(displayBadge(null, 'ended')?.label).toBe('Ended');
    });

    it('shows Happening now to registered students during the event', () => {
        expect(displayBadge('REGISTERED', 'live')?.label).toBe('Happening now');
        expect(displayBadge('UNDER_REVIEW', 'live')?.label).toBe('Under review');
        expect(displayBadge('REGISTERED', 'upcoming')?.label).toBe('Registered');
        expect(displayBadge(null, 'upcoming')).toBeUndefined();
    });
});
