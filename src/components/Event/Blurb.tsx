import { ReactNode } from 'react';
import Markdown from 'react-markdown';

// Blurbs are short Markdown, so organizers can bold a line or give it its own paragraph from the database
export function Blurb({ text, className }: { text: string; className?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <Markdown
                components={{
                    p: ({ children }: { children?: ReactNode }) => (
                        <p className={className}>{children}</p>
                    ),
                }}
            >
                {text}
            </Markdown>
        </div>
    );
}
