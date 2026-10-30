export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const inputClass =
    'w-full rounded-[10px] border border-portal-stroke bg-white/75 px-3 py-2 text-base text-black outline-none focus:border-violet-400 disabled:bg-slate-100/70';

// Client-side checks; the server checks the same rules again
type FileRules = { type: string; required: boolean; accept?: string[]; maxSizeMB?: number };

export function checkFile(q: FileRules, file: File | null): string | undefined {
    if (q.type !== 'file') return;
    if (!file) return q.required ? 'Please upload a file.' : undefined;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (q.accept?.includes('application/pdf') && !isPdf) return 'Upload a PDF file.';
    if (q.maxSizeMB && file.size > q.maxSizeMB * 1_000_000) {
        return `That file is too large. The limit is ${q.maxSizeMB} MB.`;
    }
}

export function checkEmail(value: string): string | undefined {
    const email = value.trim();
    if (!email) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return 'Enter an email like you@example.com';
    }
}

// Ten-digit North American numbers, with or without +1, spaces, dashes or brackets
export function checkPhone(value: string, required: boolean): string | undefined {
    const phone = value.trim();
    if (!phone) return required ? 'Please enter your phone number.' : undefined;
    if (!/^(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)) {
        return 'Enter a phone number like 604-555-0123';
    }
}

// Submission links must be full https:// links of at most 2,048 characters
export function checkLink(value: string, required: boolean): string | undefined {
    const link = value.trim();
    if (!link) return required ? 'This field is required.' : undefined;
    if (link.length > 2048) return 'Links can be at most 2,048 characters.';
    try {
        if (new URL(link).protocol === 'https:') return;
    } catch {
        // falls through to the message below
    }
    return 'Enter a full link starting with https://';
}
