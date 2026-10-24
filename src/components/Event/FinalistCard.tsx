import { MdEmojiEvents } from 'react-icons/md';

// Only after results are published, and only for finalists; nobody sees "Not a finalist"
export function FinalistCard({ isFinalist }: { isFinalist?: boolean }) {
    if (isFinalist !== true) return null;
    return (
        <div className="glass relative flex items-center gap-4 overflow-hidden p-4 pl-5">
            <span className="portal-accent absolute inset-y-0 left-0 w-1.5" aria-hidden />
            <span className="portal-accent flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm">
                <MdEmojiEvents className="size-6" aria-hidden />
            </span>
            <div>
                <p className="text-lg font-semibold">Finalist</p>
                <p className="text-sm text-slate-700">
                    Your team made the finals. Congratulations, and good luck on stage!
                </p>
            </div>
        </div>
    );
}
