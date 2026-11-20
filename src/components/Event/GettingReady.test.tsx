import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegisteredContentSchema } from '../../types/EventDay';
import { GettingReady } from './GettingReady';

const parse = (pageContent: Record<string, unknown>) =>
    RegisteredContentSchema.parse({ page_content: pageContent, slack_url: null, max_team_size: 4 })
        .pageContent;

const base = {
    mentors: [],
    prep: ['Bring your laptop'],
    faq: [{ q: 'Who can join?', a: 'Everyone.' }],
};

describe('Getting Ready links', () => {
    it('shows each link as a button that opens in a new tab', () => {
        const content = parse({
            ...base,
            links: [{ label: 'Product Jackpot handbook', url: 'https://www.notion.so/guide' }],
        });
        render(<GettingReady eventId="e1" content={content} />);

        const link = screen.getByRole('link', { name: 'Product Jackpot handbook' });
        expect(link.getAttribute('href')).toBe('https://www.notion.so/guide');
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noreferrer');
        expect(screen.getByText('Resources')).toBeTruthy();
    });

    it('works without links, as existing events have none', () => {
        const content = parse(base);
        render(<GettingReady eventId="e1" content={content} />);

        expect(content.links).toEqual([]);
        expect(screen.queryByText('Resources')).toBeNull();
        expect(screen.getByText('Bring your laptop')).toBeTruthy();
    });

    it('drops a bad link but keeps the rest of the section', () => {
        const content = parse({
            ...base,
            links: [
                { label: 'Not https', url: 'http://example.com' },
                { label: 'Not a url', url: 'notion page' },
                { label: '', url: 'https://example.com/empty-label' },
                'just text',
                { label: 'Product Jackpot handbook', url: 'https://www.notion.so/guide' },
            ],
        });
        render(<GettingReady eventId="e1" content={content} />);

        expect(content.links).toEqual([
            { label: 'Product Jackpot handbook', url: 'https://www.notion.so/guide' },
        ]);
        expect(screen.getAllByRole('link')).toHaveLength(1);
        expect(screen.getByText('Who can join?')).toBeTruthy();
    });
});
