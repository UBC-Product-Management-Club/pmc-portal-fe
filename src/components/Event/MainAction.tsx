import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// The button sits in the header card; on a phone a copy pins to the bottom only once
// the card's button has scrolled away, so it never covers the card itself
export function MainAction({ children }: { children: ReactNode }) {
    const inline = useRef<HTMLDivElement>(null);
    const [scrolledAway, setScrolledAway] = useState(false);

    useEffect(() => {
        const el = inline.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(([entry]) =>
            setScrolledAway(!entry.isIntersecting && entry.boundingClientRect.top < 0)
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={inline}>{children}</div>
            {/* Rendered on <body>: the glass card's blur would otherwise trap a fixed bar */}
            {scrolledAway &&
                createPortal(
                    <div className="fixed inset-x-0 bottom-0 z-20 bg-white/85 p-4 font-geist shadow-lg backdrop-blur md:hidden">
                        {children}
                    </div>,
                    document.body
                )}
        </>
    );
}
