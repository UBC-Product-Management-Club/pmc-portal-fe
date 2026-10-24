import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MdOutlineDashboard, MdOutlineEvent, MdLogout } from 'react-icons/md';
import PMCLogo from '../../assets/pmclogo-ahover.png';
import { useEvents } from '../../hooks/useEvents';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { EventCard } from '../../types/Event';

type SidebarProps = {
    onNavigate?: () => void;
};

const rowClass = 'flex min-h-14 items-center gap-2 p-4 text-sm text-black';

export function Sidebar({ onNavigate }: SidebarProps) {
    const { user } = useUserData();
    const { logout } = useAuth0();
    const { getAll } = useEvents();
    const [events, setEvents] = useState<EventCard[]>([]);

    useEffect(() => {
        getAll()
            .then(setEvents)
            .catch(() => setEvents([]));
    }, [getAll]);

    return (
        <nav className="flex h-full w-full flex-col bg-white font-geist" aria-label="Main">
            <div className="portal-tint flex items-center gap-2 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pmc-dark-blue">
                    <img src={PMCLogo} alt="UBC PMC" className="size-7 object-contain" />
                </div>
                <div className="flex flex-col gap-0.5 text-black">
                    <p className="text-sm leading-5 font-semibold">UBC PMC</p>
                    <p className="text-xs leading-4">Member</p>
                </div>
            </div>

            <NavLink
                to="/dashboard"
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                    `${rowClass} font-medium ${isActive ? 'bg-portal-surface' : 'bg-white'}`
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
                    <ul className="ml-12 overflow-hidden rounded-l-[10px] bg-portal-surface">
                        {events.map((event) => (
                            <li key={event.eventId}>
                                <NavLink
                                    to={`/events/${event.eventId}`}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `${rowClass} ${isActive ? 'bg-portal-badge font-medium' : ''}`
                                    }
                                >
                                    {event.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {user && (
                <div className="portal-tint flex items-center gap-2 p-4">
                    <NavLink
                        to="/profile"
                        onClick={onNavigate}
                        className="flex min-w-0 flex-1 items-center gap-2"
                    >
                        <img src={user.pfp} alt="" className="size-8 shrink-0 rounded-full" />
                        <div className="min-w-0 text-black">
                            <p className="truncate text-sm leading-5 font-medium">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="truncate text-xs leading-4">{user.email}</p>
                        </div>
                    </NavLink>
                    <button
                        type="button"
                        onClick={() =>
                            logout({ logoutParams: { returnTo: window.location.origin } })
                        }
                        className="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-black hover:bg-white/60"
                        aria-label="Log out"
                    >
                        <MdLogout className="size-5" aria-hidden />
                    </button>
                </div>
            )}
        </nav>
    );
}
