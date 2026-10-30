import { describe, expect, it } from 'vitest';
import { EventSchema } from './Event';

const time = '2026-11-21T18:00:00+00:00';

const row = {
    event_id: '28ee870f-b0e1-45a8-a49d-d137a2700166',
    name: 'Product Jackpot',
    date: '2026-11-21',
    registration_opens: time,
    registration_closes: time,
    start_time: time,
    end_time: time,
    location: 'Nest',
    blurb: 'blurb',
    description: 'description',
    member_price: 9,
    non_member_price: 15,
    max_attendees: 52,
    event_form_questions: [],
    registered: 0,
    needs_review: true,
};

describe('EventSchema', () => {
    it('accepts the empty media and is_disabled the database allows', () => {
        const event = EventSchema.parse({ ...row, media: null, is_disabled: null });

        expect(event.media).toEqual([]);
        expect(event.isDisabled).toBe(false);
    });

    it('keeps real values', () => {
        const event = EventSchema.parse({
            ...row,
            media: ['https://example.com/a.png'],
            is_disabled: true,
        });

        expect(event.media).toEqual(['https://example.com/a.png']);
        expect(event.isDisabled).toBe(true);
    });
});
