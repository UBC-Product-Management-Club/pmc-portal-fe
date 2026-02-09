import { useEffect, useState } from 'react';
import { FiBook } from 'react-icons/fi';
import { TbSchool } from 'react-icons/tb';
import { ProfileWhyPM } from '../../components/Profile/ProfileWhyPM';
import { useEvents } from '../../hooks/useEvents';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import type { EventCard } from '../../types/Event';
import GearyConstruction from '../../assets/geary_construction.svg';

export function Profile() {
    const { user, isMember } = useUserData();
    const { getUserCurrentEvents } = useEvents();
    const [userEvents, setUserEvents] = useState<EventCard[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const containerClass = 'flex flex-col gap-10 text-white';
    const panelClass =
        'rounded-3xl border border-white/10 bg-[var(--pmc-midnight-blue)]/40 p-6 shadow-lg backdrop-blur-md sm:p-8';
    const twoColClass = 'grid gap-10 lg:grid-cols-2 lg:items-start';
    const photoWrapClass =
        'inline-flex h-32 w-32 items-center justify-center rounded-full border border-pmc-blue/70 p-1.5';
    const infoClass = 'flex flex-1 flex-col gap-4';
    const nameRowClass = 'flex flex-wrap items-center gap-3';
    const pillClass =
        'flex w-fit items-center gap-2 rounded-full bg-pmc-blue/80 px-4 py-2 text-sm text-white shadow-sm';
    const badgeClass =
        'flex h-16 w-16 items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-white/90';
    const mutedTextClass = 'text-white/70';
    const labelClass = 'text-xs font-semibold uppercase tracking-wide text-white/60';

    useEffect(() => {
        if (!user?.userId) return;

        setEventsLoading(true);
        getUserCurrentEvents()
            .then(setUserEvents)
            .catch((error) => {
                console.error('Failed to fetch user events', error);
                setUserEvents([]);
            })
            .finally(() => setEventsLoading(false));
    }, [getUserCurrentEvents, user?.userId]);

    return (
        user && (
            <div className={containerClass}>
                <section className={panelClass}>
                    <div className={twoColClass}>
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-(--pmc-midnight-blue)/70 p-5 shadow-md">
                            <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-r from-(--pmc-light-blue)/30 via-(--pmc-purple)/30 to-(--pmc-red)/30" />
                            <div className="relative flex flex-col gap-5">
                                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/60">
                                    <span>{isMember ? 'PMC Member' : 'PMC Non-Member'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={photoWrapClass}>
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-(--pmc-light-blue) via-(--pmc-purple) to-(--pmc-red) text-xl font-semibold text-white">
                                            {`${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className={infoClass}>
                                        <div className={nameRowClass}>
                                            <h2 className="text-xl font-semibold">
                                                {user.firstName} {user.lastName}
                                            </h2>
                                            {user.pronouns && (
                                                <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white/80">
                                                    {user.pronouns}
                                                </span>
                                            )}
                                        </div>
                                        {user.email && (
                                            <p className={`text-xs ${mutedTextClass}`}>
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-3 text-sm">
                                    {user.university && (
                                        <div className="flex flex-col gap-2">
                                            <div className={labelClass}>Academics</div>
                                            <div className="flex flex-col gap-2">
                                                <div className={pillClass}>
                                                    <TbSchool />
                                                    <span>{user.university}</span>
                                                </div>
                                                <div className={pillClass}>
                                                    <FiBook />
                                                    <span>
                                                        Year {user.year}, {user.faculty},{' '}
                                                        {user.major}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* removed Product Management Club row */}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <ProfileWhyPM />
                            <div className="flex flex-col gap-3">
                                <div className={labelClass}>Events attended</div>
                                {eventsLoading ? (
                                    <p className={`text-sm ${mutedTextClass}`}>Loading events...</p>
                                ) : userEvents.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {userEvents.map((event) => (
                                            <div
                                                key={event.eventId}
                                                className={badgeClass}
                                                style={{
                                                    clipPath:
                                                        'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                                                    backgroundImage: `url(${event.thumbnail})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    boxShadow: '0 10px 20px rgba(36, 38, 64, 0.35)',
                                                }}
                                                title={event.name}
                                            >
                                                <span className="sr-only">{event.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <img
                                            src={GearyConstruction}
                                            alt="Geary construction"
                                            className="h-9 w-9"
                                        />
                                        <span>Attend more events to collect badges.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    );
}
