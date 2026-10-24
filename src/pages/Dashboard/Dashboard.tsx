import { ReactNode, useEffect, useId, useState } from 'react';
import moment from 'moment-timezone';
import { IconType } from 'react-icons';
import {
    MdExpandMore,
    MdOutlineCalendarToday,
    MdOutlineLocationOn,
    MdOutlineSell,
} from 'react-icons/md';
import { useEvents } from '../../hooks/useEvents';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { EventCard } from '../../types/Event';
import { Announcement, EventStatusRow } from '../../types/Home';
import { renderDate, renderTime } from '../../utils';
import { Badge } from '../../components/Portal/Badge';
import { Button, ButtonLink } from '../../components/Portal/Button';
import { formatPrice, homeStatus, STATUS_BADGES } from '../../components/Event/eventStatus';

// Multi-day events already show both dates in the time range
const sameDay = (start: string, end: string) =>
    moment
        .utc(start)
        .tz('America/Vancouver')
        .isSame(moment.utc(end).tz('America/Vancouver'), 'day');

function Announcements({ items }: { items: Announcement[] }) {
    const [open, setOpen] = useState(true);
    const listId = useId();

    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                <h2 className="text-xl leading-7 font-medium">Announcements</h2>
                {/* Proposed interaction, pending designer approval: collapse the whole section */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-label={open ? 'Collapse announcements' : 'Expand announcements'}
                    className="flex size-11 items-center justify-center rounded-[10px] hover:bg-white/50"
                >
                    <MdExpandMore
                        className={`size-6 transition-transform ${open ? 'rotate-180' : ''}`}
                        aria-hidden
                    />
                </button>
            </div>
            <div id={listId} hidden={!open} className="glass flex flex-col gap-4 p-4">
                {items.length === 0 ? (
                    <p>No announcements right now.</p>
                ) : (
                    items.map((item) => (
                        <article
                            key={item.announcementId}
                            className="rounded-[10px] bg-white/60 p-4"
                        >
                            <h3 className="mb-2 text-2xl leading-8 font-medium">{item.title}</h3>
                            <p className="text-base">{item.body}</p>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}

function Chip({ icon: Icon, children }: { icon: IconType; children: ReactNode }) {
    return (
        <li className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium">
            <Icon className="size-4 shrink-0" aria-hidden />
            {children}
        </li>
    );
}

function HomeEventCard({
    event,
    row,
    past,
}: {
    event: EventCard;
    row?: EventStatusRow;
    past: boolean;
}) {
    const status = homeStatus(row);
    const badge = status && STATUS_BADGES[status];
    const link = `/events/${event.eventId}`;

    return (
        <article className="glass flex flex-col gap-5 p-4 md:flex-row md:gap-6">
            <div className="order-first aspect-[205/256] w-full max-w-[200px] shrink-0 self-center overflow-hidden rounded-[10px] bg-[#919191] shadow-md md:order-last md:max-w-[180px] md:self-start">
                {event.thumbnail && (
                    <img
                        src={event.thumbnail}
                        alt={`${event.name} event art`}
                        className="size-full object-cover"
                    />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl leading-tight font-medium">{event.name}</h3>
                    {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
                </div>
                <p className="text-lg leading-snug text-slate-800">{event.blurb}</p>
                <ul className="flex flex-wrap gap-2">
                    <Chip icon={MdOutlineCalendarToday}>
                        {sameDay(event.startTime, event.endTime)
                            ? `${renderDate(event.startTime, event.endTime)} · ${renderTime(event.startTime, event.endTime)}`
                            : renderTime(event.startTime, event.endTime)}
                    </Chip>
                    <Chip icon={MdOutlineLocationOn}>{event.location}</Chip>
                    <Chip icon={MdOutlineSell}>
                        {event.memberPrice < event.nonMemberPrice
                            ? `Members ${formatPrice(event.memberPrice)} · Others ${formatPrice(event.nonMemberPrice)}`
                            : formatPrice(event.nonMemberPrice)}
                    </Chip>
                </ul>
                <div className="mt-auto flex flex-col gap-3 md:flex-row">
                    <ButtonLink to={link} className="w-full md:flex-1">
                        View Event
                    </ButtonLink>
                    {past ? (
                        <Button className="w-full md:flex-1" disabled>
                            Registration closed
                        </Button>
                    ) : (
                        <ButtonLink to={link} variant="primary" className="w-full md:flex-1">
                            Register
                        </ButtonLink>
                    )}
                </div>
            </div>
        </article>
    );
}

function EventList({
    title,
    events,
    rows,
    past,
    empty,
}: {
    title: string;
    events: EventCard[];
    rows: EventStatusRow[];
    past: boolean;
    empty: string;
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-xl leading-7 font-medium">{title}</h2>
            {events.length === 0 ? (
                <div className="glass p-4">{empty}</div>
            ) : (
                events.map((event) => (
                    <HomeEventCard
                        key={event.eventId}
                        event={event}
                        row={rows.find((row) => row.eventId === event.eventId)}
                        past={past}
                    />
                ))
            )}
        </section>
    );
}

export default function Dashboard() {
    const { user } = useUserData();
    const { getAll, getStatuses, getAnnouncements } = useEvents();
    const [events, setEvents] = useState<EventCard[]>();
    const [rows, setRows] = useState<EventStatusRow[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        getAll()
            .then(setEvents)
            .catch(() => setError(true));
        getAnnouncements()
            .then(setAnnouncements)
            .catch(() => setAnnouncements([]));
    }, [getAll, getAnnouncements]);

    useEffect(() => {
        if (!user) return;
        getStatuses()
            .then(setRows)
            .catch(() => setRows([]));
    }, [user, getStatuses]);

    const now = new Date();
    const visible = (events ?? []).filter((event) => !event.isDisabled);
    const upcoming = visible
        .filter((event) => new Date(event.endTime) > now)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    const past = visible
        .filter((event) => new Date(event.endTime) <= now)
        .sort((a, b) => b.startTime.localeCompare(a.startTime));

    return (
        <div className="flex flex-col gap-12">
            <h1 className="text-4xl leading-none font-medium md:text-5xl">
                {user?.firstName ? `Hey, ${user.firstName}!` : 'Hey there!'}
            </h1>
            <Announcements items={announcements} />
            {error ? (
                <div className="glass p-4">Couldn't load events. Refresh to try again.</div>
            ) : !events ? (
                <p>Loading events…</p>
            ) : (
                <>
                    <EventList
                        title="Upcoming Events"
                        events={upcoming}
                        rows={rows}
                        past={false}
                        empty="No upcoming events yet"
                    />
                    <EventList
                        title="Past Events"
                        events={past}
                        rows={rows}
                        past
                        empty="No past events"
                    />
                </>
            )}
        </div>
    );
}
