import React from 'react';

type StyledTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    hasError?: boolean;
};

export const TextAreaWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-full">{children}</div>
);

export const StyledTextArea = ({ hasError, className, ...props }: StyledTextAreaProps) => {
    const borderClass = hasError
        ? 'border border-red-500 focus:border-red-500'
        : 'border border-transparent focus:border-[#4a4d6e]';
    return (
        <textarea
            {...props}
            className={`min-h-[144px] w-full resize-none rounded-lg bg-[#2b2d42] p-4 text-sm text-white placeholder:text-pmc-midnight-grey focus:outline-none ${borderClass} ${className ?? ''}`}
        />
    );
};

export const CharacterCount = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute bottom-3 right-4 text-sm text-[#8d8f9a]">{children}</div>
);
