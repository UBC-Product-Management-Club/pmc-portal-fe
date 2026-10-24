import { ReactNode } from 'react';
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

// List items wrap their text so the step number or check sits beside it
const markdownComponents = {
    li: ({ children }: { children?: ReactNode }) => (
        <li>
            <span>{children}</span>
        </li>
    ),
};

export function AboutSection({ description }: { description: string }) {
    return (
        <Section title="About">
            <div className="glass event-markdown p-4 text-base">
                <Markdown components={markdownComponents}>{description}</Markdown>
            </div>
        </Section>
    );
}

// Days side by side; the label's part before " · " is the heading. Check-in buttons stay hidden for now
export function ScheduleSection({ schedule }: { schedule: Schedule }) {
    return (
        <Section title="Schedule">
            <div className="grid items-start gap-4 md:grid-cols-2">
                {schedule.days.map((day) => (
                    <div key={day.date} className="glass p-4">
                        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 border-b border-slate-200/80 pb-2">
                            <h3 className="text-xl font-semibold">{day.label.split(' · ')[0]}</h3>
                            <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                {moment(day.date, 'YYYY-MM-DD').format('dddd, MMMM D')}
                            </p>
                        </div>
                        <ul className="flex flex-col">
                            {day.items.map((item) => (
                                <li
                                    key={`${item.time}-${item.title}`}
                                    className="flex gap-4 py-1.5 text-sm"
                                >
                                    <span className="w-[4.75rem] shrink-0 font-semibold whitespace-nowrap tabular-nums">
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

type LinkCardProps = { title: string; description: string; href: string; locked: boolean };

// Jumps to the section further down the page once registered
function LinkCard({ title, description, href, locked }: LinkCardProps) {
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
        <a
            href={href}
            className="glass flex flex-1 flex-col gap-2 p-4 text-black no-underline hover:bg-white/60"
        >
            {body}
        </a>
    );
}

export function EventLinkCards({ registered }: { registered: boolean }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <LinkCard
                title="Getting Ready / Q&A"
                description="Mentors, what to prepare and answers to common questions"
                href="#getting-ready"
                locked={!registered}
            />
            <LinkCard
                title="Team Formation"
                description="Create a team, join one with a code, or compete on your own"
                href="#team-formation"
                locked={!registered}
            />
        </div>
    );
}
