import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { PassportBadge } from '../../types/Passport';

// Stamp width (w-20) and the gap between stamps (gap-4), in px
const STAMP = 80;
const GAP = 16;

function Stamp({ badge }: { badge: PassportBadge }) {
    return (
        <li className="flex w-20 shrink-0 snap-start flex-col items-center gap-1.5 text-center">
            {badge.icon ? (
                <img src={badge.icon} alt="" className="size-16 rounded-full shadow-sm" />
            ) : (
                <span className="portal-accent flex size-16 items-center justify-center rounded-full text-xl font-semibold text-white shadow-sm">
                    {badge.name.charAt(0)}
                </span>
            )}
            <span className="line-clamp-2 text-xs leading-tight font-medium">{badge.name}</span>
            <span className="text-[11px] text-slate-600">
                {moment.utc(badge.date).format('MMM YYYY')}
            </span>
        </li>
    );
}

// One row of stamps, topped up with empty slots to fill the row. Once there are more
// badges than fit, the row swipes and arrow buttons appear; before that it stays still
export function EventPassport({ badges }: { badges: PassportBadge[] }) {
    const row = useRef<HTMLUListElement>(null);
    const [fits, setFits] = useState(4);
    const [edges, setEdges] = useState({ atStart: true, atEnd: false });

    useEffect(() => {
        const el = row.current;
        if (!el) return;
        const measure = () => {
            setFits(Math.max(1, Math.floor((el.clientWidth + GAP) / (STAMP + GAP))));
            setEdges({
                atStart: el.scrollLeft <= 1,
                atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
            });
        };
        measure();
        el.addEventListener('scroll', measure, { passive: true });
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
        observer?.observe(el);
        return () => {
            el.removeEventListener('scroll', measure);
            observer?.disconnect();
        };
    }, [badges.length]);

    const scrollable = badges.length > fits;
    const empty = Math.max(0, fits - badges.length);

    const page = (direction: 1 | -1) =>
        row.current?.scrollBy({
            left: direction * row.current.clientWidth * 0.8,
            behavior: 'smooth',
        });

    return (
        <div className="flex flex-col gap-3">
            <ul
                ref={row}
                className={`flex gap-4 py-1 ${scrollable ? 'snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]' : 'justify-between overflow-hidden'}`}
                aria-label="Event Passport badges"
            >
                {badges.map((badge) => (
                    <Stamp key={badge.eventId} badge={badge} />
                ))}
                {Array.from({ length: empty }, (_, i) => (
                    <li
                        key={`empty-${i}`}
                        className="flex w-20 shrink-0 justify-center"
                        aria-hidden
                    >
                        <span className="size-16 rounded-full border-2 border-dashed border-slate-300 bg-white/40" />
                    </li>
                ))}
            </ul>
            <div className="flex min-h-11 items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                    {badges.length === 0
                        ? 'Attend an event to earn your first badge.'
                        : `${badges.length} ${badges.length === 1 ? 'badge' : 'badges'} collected`}
                </p>
                {scrollable && (
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => page(-1)}
                            disabled={edges.atStart}
                            aria-label="Earlier badges"
                            className="flex size-11 items-center justify-center rounded-full bg-white/70 text-slate-700 shadow-sm hover:bg-white disabled:opacity-40"
                        >
                            <MdChevronLeft className="size-6" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => page(1)}
                            disabled={edges.atEnd}
                            aria-label="More badges"
                            className="flex size-11 items-center justify-center rounded-full bg-white/70 text-slate-700 shadow-sm hover:bg-white disabled:opacity-40"
                        >
                            <MdChevronRight className="size-6" aria-hidden />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
