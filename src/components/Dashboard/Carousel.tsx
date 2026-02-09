import { useEffect, useRef, useState } from 'react';

type CarouselProps<T> = {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    showArrows?: boolean;
};

export function Carousel<T>({ items, renderItem, showArrows = true }: CarouselProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const wrapperClass = 'relative w-full';
    const trackClass =
        'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
    const arrowClass =
        'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/50 text-xl text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30';
    const leftArrowClass = `${arrowClass} left-[3px]`;
    const rightArrowClass = `${arrowClass} right-[3px]`;
    const cardClass = 'flex-[0_0_100%] snap-start';

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding
    };

    useEffect(() => {
        updateScrollButtons(); // initial check
    }, [items]);

    const scrollByCard = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const containerWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollBy({
            left: direction === 'right' ? containerWidth : -containerWidth,
            behavior: 'smooth',
        });
    };

    return (
        <div className={wrapperClass}>
            {showArrows && canScrollLeft && (
                <button className={leftArrowClass} onClick={() => scrollByCard('left')}>
                    ←
                </button>
            )}
            <div
                data-testid={'carousel-track'}
                ref={scrollRef}
                onScroll={updateScrollButtons}
                className={trackClass}
            >
                {items.map((item, idx) => (
                    <div className={cardClass} key={idx}>
                        {renderItem(item)}
                    </div>
                ))}
            </div>
            {showArrows && canScrollRight && (
                <button className={rightArrowClass} onClick={() => scrollByCard('right')}>
                    →
                </button>
            )}
        </div>
    );
}
