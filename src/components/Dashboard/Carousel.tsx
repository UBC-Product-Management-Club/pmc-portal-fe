import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

const CarouselWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const CarouselTrack = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 1rem;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ArrowButton = styled.button`
    position: absolute;
    top: 55%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const LeftArrow = styled(ArrowButton)`
    left: 10px;
`;

const RightArrow = styled(ArrowButton)`
    right: 10px;
`;

const CardWrapper = styled.div`
    flex: 0 0 100%;
    scroll-snap-align: start;
`;

type CarouselProps<T> = {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    showArrows?: boolean;
};

export function Carousel<T>({ items, renderItem, showArrows = true }: CarouselProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
        <CarouselWrapper>
            {showArrows && canScrollLeft && (
                <LeftArrow onClick={() => scrollByCard('left')}>←</LeftArrow>
            )}
            <CarouselTrack
                data-testid={'carousel-track'}
                ref={scrollRef}
                onScroll={updateScrollButtons}
            >
                {items.map((item, idx) => (
                    <CardWrapper key={idx}>{renderItem(item)}</CardWrapper>
                ))}
            </CarouselTrack>
            {showArrows && canScrollRight && (
                <RightArrow onClick={() => scrollByCard('right')}>→</RightArrow>
            )}
        </CarouselWrapper>
    );
}
