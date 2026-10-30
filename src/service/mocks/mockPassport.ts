import { PassportBadge } from '../../types/Passport';

const NAMES = [
    'Product Jackpot',
    'Product Sprint',
    'Product Conference',
    'Product Heist',
    'Product Night',
];

// ?badges=N previews a passport with N sample badges (capped at 30)
export function mockPassportBadges(): PassportBadge[] {
    const count = Math.min(
        Number(new URLSearchParams(window.location.search).get('badges')) || 0,
        30
    );
    return Array.from({ length: count }, (_, i) => ({
        eventId: `sample-${i}`,
        name: NAMES[i % NAMES.length],
        icon: i % NAMES.length === 0 ? '/mock/product-jackpot-icon.png' : null,
        date: new Date(Date.UTC(2026, 10 - (i % 12), 21)).toISOString(),
    }));
}
