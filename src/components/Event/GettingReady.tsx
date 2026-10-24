import { useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import { PageContent } from '../../types/EventDay';
import { Section } from './EventSections';

// Mentors without a photo get one of these circles in turn
const AVATAR_COLOURS = ['bg-[#c9b8e8]', 'bg-[#f5b5cf]', 'bg-[#b8c8f0]'];

const labelClass = 'mb-1.5 text-[13px] font-semibold';

// Prep ticks live in this browser only
function usePrepTicks(eventId: string) {
    const key = `prep-${eventId}`;
    const [ticks, setTicks] = useState<number[]>(() => {
        try {
            return JSON.parse(localStorage.getItem(key) ?? '[]');
        } catch {
            return [];
        }
    });
    const toggle = (index: number) => {
        const next = ticks.includes(index) ? ticks.filter((i) => i !== index) : [...ticks, index];
        setTicks(next);
        try {
            localStorage.setItem(key, JSON.stringify(next));
        } catch {
            // ticks just won't persist
        }
    };
    return { ticks, toggle };
}

export function GettingReady({
    eventId,
    content,
}: {
    eventId: string;
    content: PageContent | null;
}) {
    const { ticks, toggle } = usePrepTicks(eventId);

    if (!content) {
        return (
            <Section title="Getting Ready" id="getting-ready">
                <div className="glass p-4">Coming soon</div>
            </Section>
        );
    }

    return (
        <Section title="Getting Ready" id="getting-ready">
            <div className="glass flex flex-col gap-3.5 p-3.5">
                {content.mentors.length > 0 && (
                    <div>
                        <h3 className={labelClass}>Your mentors</h3>
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {content.mentors.map((mentor, index) => (
                                <li
                                    key={`${mentor.name}-${index}`}
                                    className="flex items-center gap-3 rounded-[10px] bg-white/60 p-3.5"
                                >
                                    {mentor.photo ? (
                                        <img
                                            src={mentor.photo}
                                            alt=""
                                            className="size-11 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            className={`size-11 shrink-0 rounded-full ${AVATAR_COLOURS[index % AVATAR_COLOURS.length]}`}
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">
                                            {mentor.link ? (
                                                <a href={mentor.link} className="underline">
                                                    {mentor.name}
                                                </a>
                                            ) : (
                                                mentor.name
                                            )}
                                        </p>
                                        <p className="text-xs text-slate-600">{mentor.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid items-start gap-3.5 md:grid-cols-2">
                    <div className="rounded-[10px] bg-white/60 p-3.5">
                        <h3 className={labelClass}>What to prepare</h3>
                        <ul className="flex flex-col">
                            {content.prep.map((item, index) => (
                                <li key={item}>
                                    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
                                        <input
                                            type="checkbox"
                                            className="size-4 shrink-0 accent-violet-400"
                                            checked={ticks.includes(index)}
                                            onChange={() => toggle(index)}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-[10px] bg-white/60 p-3.5">
                        <h3 className={labelClass}>Q&amp;A</h3>
                        <div className="flex flex-col divide-y divide-slate-200/90">
                            {content.faq.map(({ q, a }) => (
                                <details key={q} className="group">
                                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm group-open:font-semibold">
                                        {q}
                                        <MdAdd
                                            className="size-4 shrink-0 text-slate-600 group-open:hidden"
                                            aria-hidden
                                        />
                                        <MdRemove
                                            className="hidden size-4 shrink-0 text-slate-600 group-open:block"
                                            aria-hidden
                                        />
                                    </summary>
                                    <p className="pb-3 text-[13px] text-slate-600">{a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
