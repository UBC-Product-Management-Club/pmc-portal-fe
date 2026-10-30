import { ReactNode } from 'react';
import { MdOutlineCalendarToday, MdOutlineLocationOn, MdOutlineSell } from 'react-icons/md';
import { Event } from '../../types/Event';
import { renderDate } from '../../utils';
import { Badge } from '../Portal/Badge';
import { displayBadge, EventStatus, eventTiming } from './eventStatus';

type EventHeaderProps = {
    event: Event;
    status: EventStatus;
    message?: string;
    priceLine?: ReactNode;
    action?: ReactNode;
};

// Figma "Events" frame: title and badge, glass card with tagline, details and the main button, image on the right.
// From xl the image is 288x360 (the art's 4:5) and shares its top and bottom edges with the title and the card:
// the card grows to meet a taller image, and the image fills a taller card.
export function EventHeader({ event, status, message, priceLine, action }: EventHeaderProps) {
    const badge = displayBadge(status, eventTiming(event));

    return (
        <section className="flex flex-col gap-6 md:gap-8 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <h1 className="text-4xl leading-none font-medium md:text-5xl">{event.name}</h1>
                    {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
                </div>
                <div className="glass flex flex-col gap-4 p-4 xl:flex-1">
                    <p className="text-base">{message ?? event.blurb}</p>
                    <div className="flex flex-col gap-2 rounded-[10px] bg-white/60 p-4 font-medium xl:flex-1 xl:justify-center">
                        <p className="flex items-center gap-2">
                            <MdOutlineCalendarToday className="size-6 shrink-0" aria-hidden />
                            {renderDate(event.startTime, event.endTime)}
                        </p>
                        <p className="flex items-center gap-2">
                            <MdOutlineLocationOn className="size-6 shrink-0" aria-hidden />
                            {event.location}
                        </p>
                        {priceLine && (
                            <div className="flex items-start gap-2">
                                <MdOutlineSell className="size-6 shrink-0" aria-hidden />
                                {priceLine}
                            </div>
                        )}
                    </div>
                    {action}
                </div>
            </div>
            <div className="relative order-first aspect-[205/256] w-full max-w-[230px] shrink-0 self-center overflow-hidden rounded-[10px] bg-[#919191] shadow-md xl:order-last xl:aspect-auto xl:min-h-[360px] xl:w-[288px] xl:max-w-none xl:self-stretch">
                {event.thumbnail && (
                    <img
                        src={event.thumbnail}
                        alt={`${event.name} event art`}
                        className="absolute inset-0 size-full object-cover"
                    />
                )}
            </div>
        </section>
    );
}
