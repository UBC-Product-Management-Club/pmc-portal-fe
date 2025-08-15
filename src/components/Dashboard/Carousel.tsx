import styled from 'styled-components';
import { useRef } from 'react';

const CarouselWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const CarouselTrack = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
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
    left: -20px;
`;

const RightArrow = styled(ArrowButton)`
    right: -20px;
`;

const CardWrapper = styled.div`
    flex: 0 0 auto;
    width: 380px;
`;

type CarouselProps<T> = {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    showArrows?: boolean;
};

export function Carousel<T>({ items, renderItem, showArrows = true }: CarouselProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollByCard = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.querySelector('div')?.clientWidth || 300;
        scrollRef.current.scrollBy({
            left: direction === 'right' ? cardWidth + 16 : -cardWidth - 16,
            behavior: 'smooth',
        });
    };

    return (
        <CarouselWrapper>
            {showArrows && <LeftArrow onClick={() => scrollByCard('left')}>←</LeftArrow>}
            <CarouselTrack ref={scrollRef}>
                {items.map((item, idx) => (
                    <CardWrapper key={idx}>{renderItem(item)}</CardWrapper>
                ))}
            </CarouselTrack>
            {showArrows && <RightArrow onClick={() => scrollByCard('right')}>→</RightArrow>}
        </CarouselWrapper>
    );
}
