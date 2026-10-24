import { MdOutlineEventNote, MdOutlineMarkEmailUnread } from 'react-icons/md';
import Stargazer from '../../assets/no-events-stargazer.png';
import Rocket from '../../assets/no-events-rocket.png';

// Shown in Upcoming Events when nothing is scheduled. The two illustrations fade into the
// card at their inner edges, so they sit flush against its left and right sides
export function NoUpcomingEvents() {
    return (
        <div className="glass flex flex-col overflow-hidden md:flex-row">
            <img
                src={Stargazer}
                alt=""
                className="w-full max-w-[440px] self-center md:w-[42%] md:self-end"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-8 text-center md:py-10">
                <span className="portal-accent flex size-14 items-center justify-center rounded-full text-white shadow-sm">
                    <MdOutlineEventNote className="size-7" aria-hidden />
                </span>
                <h3 className="text-2xl font-semibold">No upcoming events yet</h3>
                <p className="text-slate-700">We're planning the next one now. Stay tuned!</p>
                <div className="mt-2 flex items-center gap-3 border-t border-slate-200/80 pt-4 text-left text-sm text-slate-600">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/70 text-violet-500">
                        <MdOutlineMarkEmailUnread className="size-5" aria-hidden />
                    </span>
                    We'll announce new events by email, so keep an eye on your inbox.
                </div>
            </div>
            <img src={Rocket} alt="" className="hidden w-[17%] max-w-[200px] self-end md:block" />
        </div>
    );
}
