import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdCloseFullscreen, MdOpenInFull } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { EventCard } from '../../types/Event';
import { renderDate } from '../../utils';

type BadgeProps = {
    userId: string;
    name: string;
    pronouns?: string;
    event: Pick<EventCard, 'name' | 'startTime' | 'endTime' | 'icon'>;
};

// Figma "QR BADGE" frame is 531x858, so every size below is its px / 531 in cqw and the
// badge scales with whatever width it's given
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
        <div className="@container relative aspect-[531/858] w-full">
            {/* Clear plastic sleeve, 12-20px proud of the card, with the shine across its corner */}
            <div className="absolute -top-[3.77cqw] -right-[2.4cqw] -bottom-[3.77cqw] -left-[2.26cqw] overflow-hidden rounded-[6cqw] border border-white/60 bg-white/30 shadow-lg backdrop-blur-[2px]">
                <div className="absolute inset-0 bg-[linear-gradient(121deg,transparent_80%,rgb(255_255_255/0.35)_80%_82%,transparent_82%_85%,rgb(255_255_255/0.25)_85%_89%,transparent_89%)]" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-[4.1cqw] bg-[linear-gradient(158.97deg,#FFFFFF_0.14%,#E33148_99.86%)] text-pmc-ink">
                {/* Slot the lanyard clips through */}
                <div className="absolute top-[4.9cqw] left-1/2 h-[6.2cqw] w-[20.7cqw] -translate-x-1/2 rounded-full bg-[#313B69]/80 ring-1 ring-white/50" />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={expanded ? 'Close full screen badge' : 'Show badge full screen'}
                    className="absolute top-[4.9cqw] left-[84cqw] grid size-[11.49cqw] place-items-center rounded-[2cqw] text-pmc-ink/50 transition-colors hover:bg-white/40 hover:text-pmc-ink"
                >
                    <Icon className="size-[7cqw]" aria-hidden />
                </button>
                <div className="absolute top-[24.29cqw] left-[7.34cqw] flex max-w-[70cqw] flex-col gap-[1.5cqw]">
                    <p className="truncate text-[8.3cqw] leading-none font-semibold">{name}</p>
                    {pronouns && <p className="text-[4.9cqw] leading-none">{pronouns}</p>}
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
                    <p className="truncate text-[5.3cqw] leading-none font-semibold">
                        {event.name}
                    </p>
                    <p className="text-[4.5cqw] leading-none">
                        {renderDate(event.startTime, event.endTime)}
                    </p>
                </div>
                <div className="absolute top-[133.15cqw] left-[70.24cqw] grid size-[24.67cqw] place-items-center overflow-hidden rounded-full bg-white drop-shadow-[2px_2px_10px_rgb(0_0_0/0.25)]">
                    {event.icon ? (
                        <img src={event.icon} alt="" className="size-full object-cover" />
                    ) : (
                        <span className="text-[10cqw] font-semibold text-[#E33148]">
                            {event.name.charAt(0)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// Two straps hanging into the badge's slot, cropped at the top like the Figma frame
function Lanyard() {
    return (
        <svg
            viewBox="0 0 531 300"
            className="pointer-events-none absolute top-0 left-0 w-full"
            aria-hidden
        >
            <path
                d="M120 -10 C 60 120, 200 170, 265 300"
                fill="none"
                stroke="#445088"
                strokeWidth="64"
            />
            <path
                d="M420 -10 C 470 120, 330 170, 265 300"
                fill="none"
                stroke="#313B69"
                strokeWidth="64"
            />
        </svg>
    );
}

// The member's code for checking in at any PMC event, worn as a lanyard badge for the
// next event they have a seat at. It encodes User.user_id, which the check-in app
// (qr-check-in) looks up against the event's attendee list, so the same code works for
// every event the member is registered for.
export function CheckInCode(props: BadgeProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!expanded) return;
        const close = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false);
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, [expanded]);

    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-xl leading-7 font-medium">Your check-in code</h2>
            <div className="glass glass-soft flex flex-col items-center gap-6 p-4 sm:flex-row sm:items-end">
                {/* At 240px wide the straps are 136px tall and end 19px into the badge, at its slot */}
                <div className="relative w-[240px] shrink-0 pt-[117px] pb-3">
                    <LanyardBadge {...props} expanded={false} onToggle={() => setExpanded(true)} />
                    <Lanyard />
                </div>
                <p className="text-center text-lg leading-snug sm:pb-4 sm:text-left">
                    Show this at check-in for any PMC event you're registered for. Tap the corner
                    button to make it full screen.
                </p>
            </div>
            {expanded &&
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
                )}
        </section>
    );
}
