import { ReactNode } from 'react';
import { MdOutlineCalendarToday, MdOutlineLocationOn } from 'react-icons/md';
import { Event } from '../../types/Event';
import { renderDate } from '../../utils';
import { Badge } from '../Portal/Badge';
import { EventStatus, STATUS_BADGES } from './eventStatus';

type EventHeaderProps = {
    event: Event;
    status: EventStatus;
    message?: string;
    priceLine?: ReactNode;
    action?: ReactNode;
};

// Figma "Events" frame: title and badge, glass card with tagline, details and the main button, image on the right
export function EventHeader({ event, status, message, priceLine, action }: EventHeaderProps) {
    const badge = STATUS_BADGES[status];

    return (
        <section className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <h1 className="text-4xl leading-none font-medium md:text-5xl">{event.name}</h1>
                    {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
                </div>
                <div className="glass flex flex-col gap-4 p-4">
                    <p className="text-base">{message ?? event.blurb}</p>
                    <div className="flex flex-col gap-2 rounded-[10px] bg-white/60 p-4 font-medium">
                        <p className="flex items-center gap-2">
                            <MdOutlineCalendarToday className="size-6 shrink-0" aria-hidden />
                            {renderDate(event.startTime, event.endTime)}
                        </p>
                        <p className="flex items-center gap-2">
                            <MdOutlineLocationOn className="size-6 shrink-0" aria-hidden />
                            {event.location}
                        </p>
                    </div>
                    {priceLine}
                    {action}
                </div>
            </div>
            <div className="order-first aspect-[205/256] w-full max-w-[230px] shrink-0 self-center overflow-hidden rounded-[10px] bg-[#919191] md:order-last md:self-start">
                {event.thumbnail && (
                    <img src={event.thumbnail} alt="" className="size-full object-cover" />
                )}
            </div>
        </section>
    );
}
