import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { PageContent } from '../../types/EventDay';
import { Section } from './EventSections';

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
            <div className="glass flex flex-col gap-4 p-4">
                {content.mentors.length > 0 && (
                    <>
                        <h3 className="text-sm font-semibold">Your mentors</h3>
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {content.mentors.map((mentor, index) => (
                                <li
                                    key={`${mentor.name}-${index}`}
                                    className="flex items-center gap-3 rounded-[10px] bg-white/60 p-3"
                                >
                                    {mentor.photo ? (
                                        <img
                                            src={mentor.photo}
                                            alt=""
                                            className="size-11 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="size-11 shrink-0 rounded-full bg-[#919191]" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {mentor.link ? (
                                                <a href={mentor.link} className="underline">
                                                    {mentor.name}
                                                </a>
                                            ) : (
                                                mentor.name
                                            )}
                                        </p>
                                        <p className="text-sm text-slate-600">{mentor.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[10px] bg-white/60 p-4">
                        <h3 className="mb-2 text-sm font-semibold">What to prepare</h3>
                        <ul className="flex flex-col gap-1">
                            {content.prep.map((item, index) => (
                                <li key={item}>
                                    <label className="flex min-h-11 cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="size-5 accent-violet-500"
                                            checked={ticks.includes(index)}
                                            onChange={() => toggle(index)}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-[10px] bg-white/60 p-4">
                        <h3 className="mb-2 text-sm font-semibold">Q&amp;A</h3>
                        <div className="flex flex-col divide-y divide-slate-200">
                            {content.faq.map(({ q, a }) => (
                                <details key={q} className="group py-1">
                                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
                                        {q}
                                        <MdExpandMore
                                            className="size-5 shrink-0 transition-transform group-open:rotate-180"
                                            aria-hidden
                                        />
                                    </summary>
                                    <p className="pb-3 text-sm text-slate-700">{a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
