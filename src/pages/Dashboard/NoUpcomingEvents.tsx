import { MdOutlineEventNote, MdOutlineMarkEmailUnread } from 'react-icons/md';

// Four-point sparkle used for the stars
const sparkle = (x: number, y: number, r: number) =>
    `M${x} ${y - r}Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z`;

function Sparkle({ className, color }: { className: string; color: string }) {
    return (
        <svg
            viewBox="-10 -10 20 20"
            className={`pointer-events-none absolute ${className}`}
            aria-hidden
        >
            <path d={sparkle(0, 0, 10)} fill={color} />
        </svg>
    );
}

// Gear outline around Geary's head: 8 teeth
function gearPath(cx: number, cy: number, outer: number, inner: number) {
    const step = (2 * Math.PI) / 8;
    const points = Array.from({ length: 8 }).flatMap((_, i) => {
        const a = step * i - Math.PI / 2;
        return (
            [
                [-0.27, inner],
                [-0.15, outer],
                [0.15, outer],
                [0.27, inner],
            ] as const
        ).map(([frac, r]) => {
            const angle = a + frac * step;
            return `${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
        });
    });
    return `M${points.join(' L')}Z`;
}

// Geary in his suit, looking through a telescope from a little hill
function GearyStargazing() {
    return (
        <svg viewBox="0 0 240 200" className="h-auto w-full" aria-hidden>
            <path d="M0 184 Q60 150 130 168 T240 172 V200 H0Z" fill="#ddd6fe" opacity="0.7" />
            <path d="M0 192 Q80 170 160 186 T240 186 V200 H0Z" fill="#fbcfe8" opacity="0.7" />

            {/* Tripod */}
            <g stroke="#64748b" strokeWidth="4" strokeLinecap="round">
                <path d="M148 74 L130 184" />
                <path d="M148 74 L152 188" />
                <path d="M148 74 L174 182" />
            </g>

            {/* Gear head and face */}
            <path d={gearPath(74, 96, 46, 37)} fill="#d4d4d8" />
            <circle cx="74" cy="100" r="31" fill="#71717a" />
            <circle cx="62" cy="98" r="3.2" fill="#18181b" />
            <path
                d="M80 97 q5 -3 10 0"
                stroke="#18181b"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M66 109 q4 4 8 0"
                stroke="#18181b"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <circle cx="54" cy="106" r="3.4" fill="#f9a8d4" />
            <circle cx="92" cy="105" r="3.4" fill="#f9a8d4" />

            {/* Suit, shirt and tie */}
            <path d="M38 132 Q74 116 110 132 L116 176 Q74 190 32 176Z" fill="#2f3a8a" />
            <path d="M62 124 L74 146 L86 124Z" fill="#a5b4fc" />
            <path d="M71 128 L77 128 L79 150 L74 156 L69 150Z" fill="#e11d48" />
            <circle cx="74" cy="164" r="2" fill="#fde68a" />
            <circle cx="74" cy="172" r="2" fill="#fde68a" />

            {/* Telescope, eyepiece at Geary's eye */}
            <g transform="rotate(-28 92 97)">
                <rect x="94" y="89" width="46" height="16" rx="4" fill="#a78bfa" />
                <rect x="138" y="85" width="54" height="24" rx="5" fill="#8b5cf6" />
                <rect x="188" y="81" width="12" height="32" rx="4" fill="#7c3aed" />
                <rect x="130" y="87" width="6" height="20" rx="2" fill="#f9a8d4" />
                <rect x="85" y="91" width="11" height="12" rx="2" fill="#475569" />
            </g>

            {/* Arms holding the telescope */}
            <path
                d="M104 136 Q122 116 116 88"
                stroke="#2f3a8a"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M44 138 Q30 150 40 166"
                stroke="#2f3a8a"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Rocket() {
    return (
        <svg viewBox="0 0 120 200" className="h-full w-full" aria-hidden>
            <path
                d="M86 40 C40 70 100 110 60 140 S30 180 70 196"
                stroke="#c4b5fd"
                strokeWidth="2.5"
                strokeDasharray="6 7"
                fill="none"
                strokeLinecap="round"
            />
            <g
                transform="rotate(35 92 28)"
                stroke="#8b5cf6"
                strokeWidth="2.6"
                fill="#f5f3ff"
                strokeLinejoin="round"
            >
                <path d="M92 6 C104 18 104 38 98 48 H86 C80 38 80 18 92 6Z" />
                <path d="M86 40 L78 52 L86 50Z M98 40 L106 52 L98 50Z" />
                <circle cx="92" cy="26" r="4.5" fill="#fbcfe8" />
            </g>
        </svg>
    );
}

export function NoUpcomingEvents() {
    return (
        <div className="glass relative overflow-hidden p-6 md:px-10 md:py-8">
            <Sparkle className="top-6 left-[28%] size-4" color="#f9a8d4" />
            <Sparkle className="top-12 left-[10%] size-3" color="#c4b5fd" />
            <Sparkle className="top-5 right-[16%] size-5" color="#c4b5fd" />
            <Sparkle className="right-6 bottom-16 size-3" color="#f9a8d4" />
            <span className="absolute top-5 left-5 size-4 rounded-full bg-violet-300" aria-hidden />
            <span
                className="absolute top-8 right-[38%] size-1.5 rounded-full bg-violet-400"
                aria-hidden
            />

            <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-end md:gap-8">
                <div className="w-48 shrink-0 md:w-56">
                    <GearyStargazing />
                </div>

                <div className="flex flex-1 flex-col items-center gap-3 text-center md:pb-4">
                    <span className="portal-accent flex size-14 items-center justify-center rounded-full text-white shadow-sm">
                        <MdOutlineEventNote className="size-7" aria-hidden />
                    </span>
                    <h3 className="text-2xl font-semibold">No upcoming events yet</h3>
                    <p className="text-slate-700">We're planning the next one now. Stay tuned!</p>
                    <div className="mt-2 flex items-center gap-3 border-t border-slate-200/80 pt-4 text-left text-sm text-slate-600">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/70 text-violet-500">
                            <MdOutlineMarkEmailUnread className="size-5" aria-hidden />
                        </span>
                        PMC announces new events by email, so keep an eye on your inbox.
                    </div>
                </div>

                <div className="hidden h-44 w-24 shrink-0 self-center md:block">
                    <Rocket />
                </div>
            </div>
        </div>
    );
}
