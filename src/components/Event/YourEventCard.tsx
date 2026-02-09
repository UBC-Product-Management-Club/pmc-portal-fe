import moment from 'moment';
import { type EventCard } from '../../types/Event';
import { Link } from 'react-router-dom';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

type YourEventCardProps = {
    event: EventCard;
    disabled: boolean;
};

export function YourEventCard({ event, disabled }: YourEventCardProps) {
    const containerClass = `flex h-[280px] flex-row justify-between gap-4 overflow-hidden rounded-2xl px-8 py-8 text-white max-sm:flex-col-reverse max-sm:items-start max-sm:gap-8 md:px-16 ${
        disabled ? 'bg-pmc-black/80' : 'bg-pmc-dark-purple'
    }`;
    const columnClass = 'max-w-[50%] self-center max-sm:max-w-full';
    const nameClass = 'text-[1.25rem] font-bold';
    const descClass =
        'h-[4.5rem] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]';
    const thumbClass =
        'aspect-square w-full max-w-[15rem] self-center rounded-[13px] object-cover shadow-[0_8px_16px_rgba(0,0,0,0.2)] max-sm:max-w-full';
    const statusClass = disabled ? 'text-red-400' : 'text-green-400';
    const statusText = disabled ? 'Ended' : 'Upcoming';
    const statusDotClass = disabled ? 'bg-red-400' : 'bg-green-400';
    const statusPillClass =
        'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1';
    const dateRowClass = 'flex items-center gap-2 text-sm text-white/80';
    const contents = (
        <div className={containerClass}>
            <div className={columnClass}>
                <div className="mb-2">
                    <span className={statusPillClass}>
                        <span
                            className={`inline-flex h-2 w-2 rounded-full ${
                                disabled ? statusDotClass : `animate-pulse ${statusDotClass}`
                            }`}
                        />
                        <span className={`text-sm font-semibold ${statusClass}`}>{statusText}</span>
                    </span>
                </div>
                <div className={dateRowClass}>
                    <FaRegCalendarAlt />
                    <span>{moment(event.date).format('MMMM D, YYYY')}</span>
                </div>
                <div className={dateRowClass}>
                    <FaRegClock />
                    <span>
                        {moment(event.startTime).format('HH.mm A')} | {event.location}
                    </span>
                </div>
                <p className={nameClass}>{event.name}</p>
                <p className={descClass}>{event.blurb}</p>
            </div>
            <div className={columnClass}>
                <img className={thumbClass} src={event.thumbnail} alt="Event thumbnail" />
            </div>
        </div>
    );

    return (
        <>
            {disabled ? (
                contents
            ) : (
                <Link to={`/events/${event.eventId}`} style={{ textDecoration: 'none' }}>
                    {contents}
                </Link>
            )}
        </>
    );
}
