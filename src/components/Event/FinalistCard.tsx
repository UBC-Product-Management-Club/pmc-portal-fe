import { MdEmojiEvents } from 'react-icons/md';

// Only after results are published, and only for finalists; nobody sees "Not a finalist"
export function FinalistCard({ isFinalist }: { isFinalist?: boolean }) {
    if (isFinalist !== true) return null;
    return (
        <div className="glass flex items-center gap-3 border-amber-300 p-4">
            <MdEmojiEvents className="size-8 shrink-0 text-amber-500" aria-hidden />
            <div>
                <p className="font-semibold">Finalist</p>
                <p className="text-sm text-slate-700">
                    Your team made the finals. Congratulations, and good luck on stage!
                </p>
            </div>
        </div>
    );
}
