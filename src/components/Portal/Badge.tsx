import { ReactNode } from 'react';
import { BadgeTone } from '../Event/eventStatus';

const TONES: Record<BadgeTone, string> = {
    neutral: 'bg-portal-badge text-black',
    warn: 'bg-amber-100 text-amber-800',
    info: 'bg-violet-100 text-violet-700',
    good: 'bg-green-100 text-green-700',
    bad: 'bg-red-100 text-red-700',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
    return (
        <span
            className={`inline-flex items-center rounded-[10px] px-2 py-1 text-base leading-6 whitespace-nowrap ${TONES[tone]}`}
        >
            {children}
        </span>
    );
}
