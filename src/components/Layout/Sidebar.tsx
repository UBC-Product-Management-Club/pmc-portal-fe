import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MdOutlineDashboard, MdOutlineEvent, MdLogout } from 'react-icons/md';
import PMCLogo from '../../assets/pmclogo-gradient.png';
import Geary from '../../assets/geary normal.png';
import { useEvents } from '../../hooks/useEvents';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { EventCard } from '../../types/Event';
import { resetMemberBar } from './memberBar';

type SidebarProps = {
    onNavigate?: () => void;
};

const rowClass =
    'relative flex min-h-14 items-center gap-2 p-4 text-sm text-pmc-ink transition-colors duration-200 hover:bg-portal-badge/50';

// One highlight glides to whichever row holds the current page, so moving between pages reads
// as one continuous motion instead of a background jumping from row to row
function useActiveIndicator() {
    const navRef = useRef<HTMLElement>(null);
    const [box, setBox] = useState<{ top: number; height: number } | null>(null);
    const [animate, setAnimate] = useState(false);
    const { pathname } = useLocation();

    const measure = useCallback(() => {
        const nav = navRef.current;
        const row = nav?.querySelector('[aria-current="page"]')?.closest('[data-nav-row]');
        if (!nav || !row) return setBox(null);
        const top = row.getBoundingClientRect().top - nav.getBoundingClientRect().top;
        setBox({ top, height: row.getBoundingClientRect().height });
    }, []);

    // First placement is instant; later moves glide
    useLayoutEffect(() => {
        measure();
        const id = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(id);
    }, [pathname, measure]);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        const observer = new ResizeObserver(measure);
        observer.observe(nav);
        // Rows inside the scrolling events list move with it, so follow without gliding
        const follow = () => {
            setAnimate(false);
            measure();
            requestAnimationFrame(() => setAnimate(true));
        };
        nav.addEventListener('scroll', follow, true);
        return () => {
            observer.disconnect();
            nav.removeEventListener('scroll', follow, true);
        };
    }, [measure]);

    return { navRef, box, animate, measure };
}

// The brand and profile rows share the pale pink-to-lavender tint from the Figma
const tintClass = 'bg-white/50';

function EventIcon({ event }: { event: EventCard }) {
    if (event.icon) {
        return <img src={event.icon} alt="" className="size-6 shrink-0 rounded-full" />;
    }
    return (
        <span
            className="pmc-deep flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            aria-hidden
        >
            {event.name.charAt(0)}
        </span>
    );
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const { user } = useUserData();
    const { logout } = useAuth0();
    const { getAll } = useEvents();
    const [events, setEvents] = useState<EventCard[]>([]);
    const { navRef, box, animate, measure } = useActiveIndicator();

    useEffect(() => {
        getAll()
            .then(setEvents)
            .catch(() => setEvents([]));
    }, [getAll]);

    // Event rows arrive after the first paint; place the highlight once they exist
    useLayoutEffect(measure, [events, user, measure]);

    return (
        <nav
            ref={navRef}
            className="portal-tint relative isolate flex h-full w-full flex-col border-r border-portal-stroke font-pmc"
            aria-label="Main"
        >
            <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 top-0 -z-10 bg-portal-badge before:pmc-deep before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full ${animate ? 'transition-[translate,height,opacity] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-opacity' : ''}`}
                style={{
                    translate: `0 ${box?.top ?? 0}px`,
                    height: box?.height ?? 0,
                    opacity: box ? 1 : 0,
                }}
            />
            <div className={`flex items-center gap-2 p-4 ${tintClass}`}>
                <img src={PMCLogo} alt="UBC PMC" className="h-9 w-auto shrink-0" />
                <div className="flex flex-col gap-0.5 text-pmc-ink">
                    <p className="text-sm leading-5 font-semibold">UBC PMC</p>
                    <p className="text-xs leading-4">Member</p>
                </div>
            </div>

            <NavLink
                to="/dashboard"
                end
                onClick={onNavigate}
                data-nav-row
                className={({ isActive }) =>
                    `${rowClass} font-medium ${isActive ? 'font-semibold hover:bg-transparent' : ''}`
                }
            >
                <MdOutlineDashboard className="size-6 shrink-0" aria-hidden />
                Dashboard
            </NavLink>

            <div className={`${rowClass} font-medium`}>
                <MdOutlineEvent className="size-6 shrink-0" aria-hidden />
                Events
            </div>

            <div className="flex-1 overflow-y-auto">
                {events.length > 0 && (
                    <ul>
                        {events.map((event) => (
                            <li key={event.eventId} data-nav-row>
                                <NavLink
                                    to={`/events/${event.eventId}`}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `${rowClass} pl-12 ${isActive ? 'font-semibold hover:bg-transparent' : ''}`
                                    }
                                >
                                    <EventIcon event={event} />
                                    {event.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {user && (
                <div data-nav-row className={`flex items-center gap-2 p-4 ${tintClass}`}>
                    <NavLink
                        to="/profile"
                        onClick={onNavigate}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px]"
                    >
                        <img
                            src={Geary}
                            alt=""
                            className="size-8 shrink-0 rounded-full bg-white object-cover"
                        />
                        <div className="min-w-0 text-pmc-ink">
                            <p className="truncate text-sm leading-5 font-medium">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="truncate text-xs leading-4">{user.email}</p>
                        </div>
                    </NavLink>
                    <button
                        type="button"
                        onClick={() => {
                            resetMemberBar();
                            logout({ logoutParams: { returnTo: window.location.origin } });
                        }}
                        className="flex size-11 shrink-0 items-center justify-center pmc-hover-chip rounded-[10px] text-pmc-ink"
                        aria-label="Log out"
                    >
                        <MdLogout className="size-5" aria-hidden />
                    </button>
                </div>
            )}
        </nav>
    );
}
