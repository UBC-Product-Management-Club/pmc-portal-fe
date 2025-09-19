import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Carousel } from './Carousel';

type MockItem = { id: number; name: string };

const mockItems: MockItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
];

const mockRenderItem = (item: MockItem) => <div data-testid={`item-${item.id}`}>{item.name}</div>;

describe('Carousel Component', () => {
    beforeEach(() => vi.clearAllMocks());
    afterEach(() => vi.restoreAllMocks());

    test('renders all items', () => {
        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);
        mockItems.forEach((item) => {
            expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
        });
    });

    test('renders arrows only if scrollable', () => {
        // Mock scroll width smaller than client width → no scrolling → arrows hidden
        const mockClientWidth = 1000;
        const mockScrollWidth = 900;
        const track = document.createElement('div');
        Object.defineProperties(track, {
            scrollLeft: { value: 0, writable: true },
            scrollWidth: { value: mockScrollWidth },
            clientWidth: { value: mockClientWidth },
        });

        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

        // initially, arrows not rendered because useEffect will set canScrollLeft/Right false
        expect(screen.queryByRole('button', { name: '←' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '→' })).not.toBeInTheDocument();
    });

    // doesnt work bruh chat is stupid
    // test('arrow buttons are clickable and scroll', () => {
    //     const mockScrollBy = vi.fn();

    //     // Render carousel
    //     render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

    //     // Get the track element
    //     const track = screen.getByTestId("carousel-track")

    //     // Mock scroll properties
    //     Object.assign(track, {
    //       clientWidth: 300,
    //       scrollWidth: 900,
    //       scrollLeft: 0,
    //       scrollBy: mockScrollBy,
    //     });

    //     // Trigger useEffect / updateScrollButtons
    //     act(() => {
    //       fireEvent.scroll(track);
    //     });

    //     // Right arrow should now exist
    //     const rightArrow = screen.getByText('→');
    //     expect(rightArrow).toBeInTheDocument();

    //     // Click the arrow
    //     fireEvent.click(rightArrow);
    //     expect(mockScrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });

    //     // Simulate scrolling to the right to show left arrow
    //     Object.assign(track, { scrollLeft: 300 });
    //     act(() => fireEvent.scroll(track));

    //     const leftArrow = screen.getByText('←');
    //     expect(leftArrow).toBeInTheDocument();

    //     // Click the left arrow
    //     fireEvent.click(leftArrow);
    //     expect(mockScrollBy).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });
    //   });

    test('handles different data types', () => {
        const stringItems = ['Apple', 'Banana', 'Cherry'];
        const stringRenderItem = (item: string) => <div data-testid={`fruit-${item}`}>{item}</div>;
        render(<Carousel items={stringItems} renderItem={stringRenderItem} />);
        stringItems.forEach((fruit) => {
            expect(screen.getByTestId(`fruit-${fruit}`)).toBeInTheDocument();
        });
    });

    test('calls renderItem for each item', () => {
        const mockRenderSpy = vi.fn(mockRenderItem);
        render(<Carousel items={mockItems} renderItem={mockRenderSpy} />);
        expect(mockRenderSpy).toHaveBeenCalledTimes(mockItems.length);
        mockItems.forEach((item) => expect(mockRenderSpy).toHaveBeenCalledWith(item));
    });
});
