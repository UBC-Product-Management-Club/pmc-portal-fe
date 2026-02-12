import { type EventCard } from '../../types/Event';
import { Link } from 'react-router-dom';
import { renderDate, renderTime, useInAppBrowser } from '../../utils';
import ReactMarkdown from 'react-markdown';
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from 'react-icons/fa';

type EventCardProps = {
    event: EventCard;
    disabled: boolean;
    link: string;
};

export function EventCard({ event, disabled, link }: EventCardProps) {
    const { isMobile } = useInAppBrowser();
    const contentClass = `flex h-[500px] flex-col-reverse items-start justify-evenly gap-4 overflow-hidden rounded-2xl px-8 py-8 text-white md:h-[280px] md:flex-row md:items-center md:justify-between md:px-16 md:py-6 ${
        disabled ? 'bg-pmc-black/80' : 'bg-pmc-dark-purple'
    }`;
    const groupClass = 'w-full md:w-4/5 md:self-center flex flex-col gap-1';
    const nameClass = 'text-3xl font-bold max-sm:text-[1.75rem]';
    const thumbnailClass =
        'aspect-square w-[17rem] self-center rounded-[13px] object-cover shadow-[0_8px_16px_rgba(0,0,0,0.2)] md:w-[15rem]';
    const statusClass = disabled ? 'text-red-400' : 'text-green-400';
    const statusText = disabled ? 'Ended' : 'Upcoming';
    const statusDotClass = disabled ? 'bg-red-400' : 'bg-green-400';
    const statusPillClass =
        'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1';
    const dateRowClass = 'flex items-center gap-2 text-sm text-white/80';
    const contents = (
        <div className={contentClass}>
            <div className={groupClass}>
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
                <p className={nameClass}>{event.name}</p>
                <div className={dateRowClass}>
                    <FaRegCalendarAlt />
                    <span>{renderDate(event.startTime, event.endTime)}</span>
                </div>
                <div className={dateRowClass}>
                    <FaRegClock />
                    <span className="inline-flex items-center gap-1">
                        {renderTime(event.startTime, event.endTime)} | <FaMapPin /> {event.location}
                    </span>
                </div>

                {!isMobile && <ReactMarkdown>{event.blurb}</ReactMarkdown>}
            </div>
            <img
                className={thumbnailClass}
                src={`https://cvxxwlszessyxnqonacw.supabase.co/storage/v1/object/public/event-media/${event.eventId}/thumbnail`}
                alt="Event thumbnail"
            />
        </div>
    );
    const isExternal = link.startsWith('https://');
    const navigateTo = isExternal ? (
        <a href={link} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            {contents}
        </a>
    ) : (
        <Link to={link} style={{ textDecoration: 'none' }}>
            {contents}
        </Link>
    );

    return <>{disabled ? contents : navigateTo}</>;
}
