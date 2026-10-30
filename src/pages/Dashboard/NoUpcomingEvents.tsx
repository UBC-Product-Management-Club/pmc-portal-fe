import { MdOutlineEventNote, MdOutlineMarkEmailUnread } from 'react-icons/md';
import Stargazer from '../../assets/no-events-stargazer.png';

// Four-point sparkle centred on (x, y)
const sparkle = (x: number, y: number, r: number) =>
    `M${x} ${y - r}Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y}Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r}Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y}Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r}Z`;

// Line-art rocket with a dashed trail, drawn so the card shows through around it
function Rocket() {
    return (
        <svg viewBox="0 0 120 220" className="h-auto w-full" aria-hidden>
            <path d={sparkle(14, 20, 9)} fill="#c4b5fd" />
            <path d={sparkle(102, 196, 7)} fill="#f9a8d4" />
            <path
                d="M70 80 C80 104 60 118 52 132 C40 156 62 180 86 178"
                stroke="#c4b5fd"
                strokeWidth="2.5"
                strokeDasharray="6 7"
                fill="none"
                strokeLinecap="round"
            />
            <g
                transform="rotate(35 82 46)"
                stroke="#7c5ce0"
                strokeWidth="3"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
            >
                <path d="M82 18 C95 30 96 54 89 66 H75 C68 54 69 30 82 18Z" />
                <path d="M75 56 L66 70 L75 67 M89 56 L98 70 L89 67" />
                <circle cx="82" cy="40" r="5" />
                <path d="M79 72 L78 79 M85 72 L86 79" />
            </g>
        </svg>
    );
}

// Shown in Upcoming Events when nothing is scheduled. The illustration fades into the
// card at its right edge, so it sits flush against the card's left side
export function NoUpcomingEvents() {
    return (
        <div className="glass flex flex-col overflow-hidden md:flex-row">
            <img
                src={Stargazer}
                alt=""
                className="w-full max-w-[440px] self-center md:w-[42%] md:self-end"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-8 text-center md:py-10">
                <span className="portal-accent flex size-14 items-center justify-center rounded-full text-white shadow-sm">
                    <MdOutlineEventNote className="size-7" aria-hidden />
                </span>
                <h3 className="text-2xl font-semibold">No upcoming events yet</h3>
                <p className="text-slate-700">We're planning the next one now. Stay tuned!</p>
                <div className="mt-2 flex items-center gap-3 border-t border-slate-200/80 pt-4 text-left text-sm text-slate-600">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/70 text-violet-500">
                        <MdOutlineMarkEmailUnread className="size-5" aria-hidden />
                    </span>
                    We'll announce new events by email, so keep an eye on your inbox.
                </div>
            </div>
            <div className="hidden w-28 shrink-0 self-center pr-6 md:block">
                <Rocket />
            </div>
        </div>
    );
}
