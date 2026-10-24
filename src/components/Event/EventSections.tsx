import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MdLockOutline } from 'react-icons/md';
import Markdown from 'react-markdown';
import moment from 'moment-timezone';
import { Schedule } from '../../types/Event';

export function Section({
    title,
    id,
    children,
}: {
    title: string;
    id?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="flex scroll-mt-24 flex-col gap-2">
            <h2 className="text-xl leading-7 font-medium">{title}</h2>
            {children}
        </section>
    );
}

export function AboutSection({ description }: { description: string }) {
    return (
        <Section title="About">
            <div className="glass p-4 text-base [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3">
                <Markdown>{description}</Markdown>
            </div>
        </Section>
    );
}

// One card per day; check-in buttons stay hidden for now
export function ScheduleSection({ schedule }: { schedule: Schedule }) {
    return (
        <Section title="Schedule">
            <div className="glass flex flex-col gap-4 p-4">
                {schedule.days.map((day) => (
                    <div key={day.date} className="rounded-[10px] bg-white/60 p-4">
                        <h3 className="mb-3 text-2xl leading-8 font-medium">{day.label}</h3>
                        <ul className="flex flex-col gap-2">
                            {day.items.map((item) => (
                                <li key={`${item.time}-${item.title}`} className="flex gap-4">
                                    <span className="w-20 shrink-0 font-medium text-slate-600">
                                        {moment(item.time, 'HH:mm').format('h:mm A')}
                                    </span>
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>
    );
}

type LinkCardProps = { title: string; description: string; to: string; locked: boolean };

function LinkCard({ title, description, to, locked }: LinkCardProps) {
    const body = (
        <>
            <h3 className="flex items-center gap-2 text-2xl leading-8 font-medium">
                {locked && <MdLockOutline className="size-5" aria-hidden />}
                {title}
            </h3>
            <p className="text-base text-slate-600">
                {locked ? "Available once you're registered" : description}
            </p>
        </>
    );

    return locked ? (
        <div className="glass flex flex-1 flex-col gap-2 p-4 opacity-80">{body}</div>
    ) : (
        <Link
            to={to}
            className="glass flex flex-1 flex-col gap-2 p-4 text-black no-underline hover:bg-white/60"
        >
            {body}
        </Link>
    );
}

export function EventLinkCards({ eventId, registered }: { eventId: string; registered: boolean }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <LinkCard
                title="Getting Ready / Q&A"
                description="Mentors, what to prepare and answers to common questions"
                to={`/events/${eventId}#getting-ready`}
                locked={!registered}
            />
            <LinkCard
                title="Team Formation"
                description="Create a team, join one with a code, or compete on your own"
                to={`/events/${eventId}/team`}
                locked={!registered}
            />
        </div>
    );
}
