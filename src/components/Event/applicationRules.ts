import { Question } from '../../types/Question';

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const inputClass =
    'w-full rounded-[10px] border border-portal-stroke bg-white/75 px-3 py-2 text-base text-black outline-none focus:border-violet-400 disabled:bg-slate-100/70';

// Client-side checks; the server checks the same rules again
export function checkFile(q: Question, file: File | null): string | undefined {
    if (q.type !== 'file') return;
    if (!file) return q.required ? 'Please upload a file.' : undefined;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (q.accept?.includes('application/pdf') && !isPdf) return 'Upload a PDF file.';
    if (q.maxSizeMB && file.size > q.maxSizeMB * 1_000_000) {
        return `That file is too large. The limit is ${q.maxSizeMB} MB.`;
    }
}
