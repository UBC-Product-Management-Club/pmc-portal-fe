import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdCloseFullscreen, MdOpenInFull } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { EventCard } from '../../types/Event';
import { renderDate } from '../../utils';
import { Button } from './Button';

type BadgeProps = {
    userId: string;
    name: string;
    pronouns?: string;
    event: Pick<EventCard, 'name' | 'startTime' | 'endTime'>;
};

// Figma "QR BADGE" frame: the card is 531x858, so every size below is its px / 531 in cqw and
// the badge scales with whatever width it's given. The clear sleeve (556x898) sits 12px left
// and 20px above the card, white at 10% with the lanyard slot cut out, and the shine is three stripes
// clipped to the sleeve. Text, QR and sticker stay above the sleeve so they read crisply
const SLEEVE =
    'M524.357 0C541.698 0 555.755 14.0576 555.755 31.3986V866.601C555.755 883.942 541.698 898 524.357 898H31.3986C14.0576 898 0 883.942 0 866.601V31.3986C1.61841e-06 14.0576 14.0576 3.16076e-08 31.3986 0H524.357ZM236.99 46.589C229.54 46.589 223.5 53.6206 223.5 62.2945C223.5 70.9684 229.54 78 236.99 78H319.01C326.46 78 332.5 70.9684 332.5 62.2945C332.5 53.6206 326.46 46.589 319.01 46.589H236.99Z';
const SHINE = [
    { x: 766.235, y: 609.537, width: 34.2711 },
    { x: 748.01, y: 584, width: 14.4057 },
    { x: 761.952, y: 676.361, width: 14.4057 },
];

function Sleeve() {
    const id = useId();

    return (
        <svg
            viewBox="0 0 556 898"
            className="pointer-events-none absolute top-[-3.77cqw] left-[-2.26cqw] h-[169.11cqw] w-[104.66cqw] drop-shadow-[0_4px_12px_rgb(49_59_105/0.18)]"
            aria-hidden
        >
            <defs>
                <mask
                    id={`${id}-sleeve`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="556"
                    height="898"
                >
                    <path d={SLEEVE} fillRule="evenodd" fill="white" fillOpacity="0.4" />
                </mask>
                <linearGradient id={`${id}-stripe`} x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="0.5" stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={SLEEVE} fillRule="evenodd" fill="white" fillOpacity="0.1" />
            <g mask={`url(#${id}-sleeve)`}>
                {SHINE.map(({ x, y, width }) => (
                    <rect
                        key={y}
                        x={x}
                        y={y}
                        width={width}
                        height="759.715"
                        transform={`rotate(60.315 ${x} ${y})`}
                        fill={`url(#${id}-stripe)`}
                        fillOpacity="0.4"
                    />
                ))}
            </g>
        </svg>
    );
}

// A gear with `teeth` flat-topped teeth, centred on 60,60: tooth tips at `tip`, gaps at `root`
function gearPath(teeth: number, tip: number, root: number) {
    const point = (deg: number, r: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return `${(60 + r * Math.cos(rad)).toFixed(2)} ${(60 + r * Math.sin(rad)).toFixed(2)}`;
    };
    const step = 360 / teeth;
    const parts = Array.from({ length: teeth }, (_, i) => {
        const a = i * step;
        return [
            `${i === 0 ? 'M' : 'L'}${point(a - step * 0.36, root)}`,
            `L${point(a - step * 0.26, tip)}`,
            `A${tip} ${tip} 0 0 1 ${point(a + step * 0.26, tip)}`,
            `L${point(a + step * 0.36, root)}`,
            `A${root} ${root} 0 0 1 ${point(a + step * 0.64, root)}`,
        ].join(' ');
    });
    return `${parts.join(' ')} Z`;
}

// The tips run past the chip's edge and get clipped round, like Figma's mask group
const OUTER_GEAR = gearPath(8, 66, 48.5);
const INNER_GEAR = gearPath(8, 29, 23.5);

// Figma "chip-2d-ver1" at 120x120: a #D50000 gear masked to the circle, a white ring 83px
// across, and a 58px #A30000 gear in the middle
function GearSticker() {
    const id = useId();

    return (
        <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
            <clipPath id={`${id}-chip`}>
                <circle cx="60" cy="60" r="60" />
            </clipPath>
            <path d={OUTER_GEAR} fill="#D50000" clipPath={`url(#${id}-chip)`} />
            <circle cx="60" cy="60" r="41" fill="none" stroke="white" strokeWidth="1.4" />
            <path d={INNER_GEAR} fill="#A30000" />
        </svg>
    );
}

function LanyardBadge({
    userId,
    name,
    pronouns,
    event,
    expanded,
    onToggle,
}: BadgeProps & { expanded: boolean; onToggle: () => void }) {
    const Icon = expanded ? MdCloseFullscreen : MdOpenInFull;

    return (
        <div className="@container relative aspect-[531/858] w-full [font-family:Geist,var(--font-pmc)] text-black">
            <div className="absolute inset-0 rounded-[4.7cqw] bg-[linear-gradient(158.97deg,#FFFFFF_0.14%,#E33148_99.86%)]" />
            {/* Figma "event sticker": the chip on a 131px white disc, under the sleeve so the shine crosses it */}
            <div className="absolute top-[133.15cqw] left-[70.24cqw] size-[24.67cqw] rounded-full bg-white p-[1cqw] drop-shadow-[2px_2px_10px_rgb(0_0_0/0.25)]">
                <GearSticker />
            </div>
            <Sleeve />
            {/* The lanyard hole, where the sleeve's slot is cut (109x31 at 211,27): dark like the
                strap looping behind it, so the front strap reads as threaded through */}
            <div className="absolute top-[5cqw] left-[39.83cqw] h-[5.91cqw] w-[20.53cqw] rounded-full bg-[#2B3361] shadow-[inset_0_0.6cqw_1cqw_rgb(0_0_0/0.45)] ring-1 ring-white/50" />
            <button
                type="button"
                onClick={onToggle}
                aria-label={expanded ? 'Close full screen badge' : 'Show badge full screen'}
                className="absolute top-[4.9cqw] left-[84cqw] grid size-[11.49cqw] place-items-center rounded-[2cqw] text-[#919191] transition-colors hover:bg-white/40 hover:text-pmc-ink"
            >
                <Icon className="size-full" aria-hidden />
            </button>
            <div className="absolute top-[24.29cqw] left-[7.34cqw] flex max-w-[70cqw] flex-col gap-[1.5cqw]">
                <p className="truncate text-[9.04cqw] leading-none font-semibold">{name}</p>
                {pronouns && (
                    <p className="text-[5.65cqw] leading-[5.27cqw] font-medium">{pronouns}</p>
                )}
            </div>
            {/* Dark on white with a quiet zone, so scanners read it at any size */}
            <div className="absolute top-[43.88cqw] left-[7.34cqw] size-[85.31cqw] bg-white p-[3cqw]">
                <QRCodeSVG
                    value={userId}
                    size={256}
                    marginSize={0}
                    level="M"
                    title="Your check-in QR code"
                    className="size-full"
                />
            </div>
            <div className="absolute top-[134.84cqw] left-[7.34cqw] flex max-w-[60cqw] flex-col gap-[1.5cqw]">
                <p className="truncate text-[5.65cqw] leading-[5.27cqw] font-semibold">
                    {event.name}
                </p>
                <p className="text-[4.9cqw] leading-[5.27cqw] font-medium">
                    {renderDate(event.startTime, event.endTime)}
                </p>
            </div>
        </div>
    );
}

// The straps, in the badge's 531-wide units and `height` tall down to the slot's centre.
// The right one tucks behind the card's top edge; the left one comes in front and ends in
// the slot, so the back strap renders before the badge and the front one after it
function Strap({ height, side }: { height: number; side: 'back' | 'front' }) {
    const id = useId();
    const d =
        side === 'front'
            ? `M35 -60 C -45 ${height * 0.45}, 235 ${height * 0.6}, 268 ${height + 4}`
            : `M482 -60 C 600 ${height * 0.45}, 300 ${height * 0.66}, 296 ${height + 40}`;

    return (
        <svg
            viewBox={`0 0 531 ${height}`}
            className="pointer-events-none absolute top-0 left-0 w-full overflow-visible"
            aria-hidden
        >
            {/* Cut off at the top so the straps run off the page instead of ending in a cap, and
                the front one at the hole's centre so it disappears into the slot */}
            <clipPath id={`${id}-top`}>
                <rect
                    x="-200"
                    y="0"
                    width="931"
                    height={side === 'front' ? height : height + 200}
                />
            </clipPath>
            <path
                d={d}
                clipPath={`url(#${id}-top)`}
                fill="none"
                stroke={side === 'front' ? '#445088' : '#313B69'}
                strokeWidth="76"
                strokeLinecap="round"
            />
        </svg>
    );
}

// The badge as big as the screen allows, for holding up to the scanner
function useFullscreenBadge(props: BadgeProps) {
    const [expanded, setExpanded] = useState(false);

    // While it's up: Escape closes it, the page behind doesn't scroll under a swipe, and the
    // screen stays awake so the phone doesn't dim in the check-in line (where supported)
    useEffect(() => {
        if (!expanded) return;
        const close = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false);
        window.addEventListener('keydown', close);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const wakeLock = navigator.wakeLock?.request('screen').catch(() => undefined);
        return () => {
            window.removeEventListener('keydown', close);
            document.body.style.overflow = overflow;
            wakeLock?.then((lock) => lock?.release());
        };
    }, [expanded]);

    const overlay =
        expanded &&
        createPortal(
            <div
                className="fixed inset-0 z-50 grid place-items-center bg-pmc-ink/80 p-6 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label="Your check-in badge"
                onClick={() => setExpanded(false)}
            >
                {/* As big as fits: 531x858 plus the sleeve, inside the padded viewport */}
                <div
                    className="w-[min(100%,calc((100dvh-4rem)*531/898))]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <LanyardBadge {...props} expanded onToggle={() => setExpanded(false)} />
                </div>
            </div>,
            document.body
        );

    return { open: () => setExpanded(true), overlay };
}

// The member's code for checking in at any PMC event, worn as a lanyard badge for the
// next event they have a seat at. It encodes User.user_id, which the check-in app
// (qr-check-in) looks up against the event's attendee list, so the same code works for
// every event the member is registered for.
//
// From lg it hangs in the dashboard's side column, straps running off the top of the
// page; it pulls up by main's md:py-12 so they meet the top bar
export function HangingCheckInBadge(props: BadgeProps) {
    const { open, overlay } = useFullscreenBadge(props);

    return (
        <aside
            aria-label="Your check-in badge"
            className="hidden w-[260px] shrink-0 lg:block lg:-mt-12"
        >
            {/* At 260px wide the 420-tall straps are 206px and end 21px into the badge, at its slot */}
            <div className="relative pt-[185px]">
                <Strap height={420} side="back" />
                <LanyardBadge {...props} expanded={false} onToggle={open} />
                <Strap height={420} side="front" />
            </div>
            <p className="mt-6 text-center text-sm leading-snug text-pmc-mute">
                Show your badge to a UBC PMC organizer to check into {props.event.name}
            </p>
            {overlay}
        </aside>
    );
}

// Below lg there's no room for the badge beside the page, so a slim row opens it full screen
export function CheckInCode(props: BadgeProps) {
    const { open, overlay } = useFullscreenBadge(props);

    return (
        <section className="flex flex-col gap-2 lg:hidden">
            <h2 className="text-xl leading-7 font-medium">Your check-in code</h2>
            <div className="glass glass-soft flex flex-wrap items-center gap-4 p-4">
                <div className="shrink-0 rounded-[8px] bg-white p-1.5">
                    <QRCodeSVG
                        value={props.userId}
                        size={64}
                        marginSize={0}
                        level="M"
                        title="Your check-in QR code"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                        Show your badge to a UBC PMC organizer to check into {props.event.name}
                    </p>
                    <p className="text-sm text-pmc-mute">
                        {renderDate(props.event.startTime, props.event.endTime)}
                    </p>
                </div>
                <Button variant="primary" onClick={open} className="w-full sm:w-auto">
                    Show badge
                </Button>
            </div>
            {overlay}
        </section>
    );
}
