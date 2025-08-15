import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Carousel } from './Carousel';

// Mock data for testing
type MockItem = {
    id: number;
    name: string;
};

const mockItems: MockItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
];

const mockRenderItem = (item: MockItem) => <div data-testid={`item-${item.id}`}>{item.name}</div>;

describe('Carousel Component', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('renders all items', () => {
        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

        expect(screen.getByTestId('item-1')).toBeInTheDocument();
        expect(screen.getByTestId('item-2')).toBeInTheDocument();
        expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });

    test('renders arrows by default', () => {
        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

        expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '→' })).toBeInTheDocument();
    });

    test('hides arrows when showArrows is false', () => {
        render(<Carousel items={mockItems} renderItem={mockRenderItem} showArrows={false} />);

        expect(screen.queryByRole('button', { name: '←' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '→' })).not.toBeInTheDocument();
    });

    test('renders empty carousel when no items provided', () => {
        render(<Carousel items={[]} renderItem={mockRenderItem} />);

        expect(screen.queryByTestId(/item-/)).not.toBeInTheDocument();
        // Arrows should still be present
        expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '→' })).toBeInTheDocument();
    });

    test('arrow buttons are clickable', () => {
        // Mock scrollBy method using vi.fn()
        const mockScrollBy = vi.fn();
        HTMLElement.prototype.scrollBy = mockScrollBy;

        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

        const leftArrow = screen.getByRole('button', { name: '←' });
        const rightArrow = screen.getByRole('button', { name: '→' });

        fireEvent.click(rightArrow);
        expect(mockScrollBy).toHaveBeenCalledWith({
            left: expect.any(Number),
            behavior: 'smooth',
        });

        fireEvent.click(leftArrow);
        expect(mockScrollBy).toHaveBeenCalledWith({
            left: expect.any(Number),
            behavior: 'smooth',
        });
    });

    test('calls renderItem function for each item', () => {
        const mockRenderItemSpy = vi.fn().mockImplementation(mockRenderItem);

        render(<Carousel items={mockItems} renderItem={mockRenderItemSpy} />);

        expect(mockRenderItemSpy).toHaveBeenCalledTimes(3);
        expect(mockRenderItemSpy).toHaveBeenCalledWith(mockItems[0]);
        expect(mockRenderItemSpy).toHaveBeenCalledWith(mockItems[1]);
        expect(mockRenderItemSpy).toHaveBeenCalledWith(mockItems[2]);
    });

    test('handles different data types', () => {
        const stringItems: string[] = ['Apple', 'Banana', 'Cherry'];
        const stringRenderItem = (item: string) => <div data-testid={`fruit-${item}`}>{item}</div>;

        render(<Carousel items={stringItems} renderItem={stringRenderItem} />);

        expect(screen.getByTestId('fruit-Apple')).toBeInTheDocument();
        expect(screen.getByTestId('fruit-Banana')).toBeInTheDocument();
        expect(screen.getByTestId('fruit-Cherry')).toBeInTheDocument();
    });

    test('scroll functionality with mocked DOM methods', () => {
        // Mock querySelector and clientWidth using vi.fn()
        const mockElement = { clientWidth: 300 };
        const mockScrollBy = vi.fn();
        const mockQuerySelector = vi.fn().mockReturnValue(mockElement);

        HTMLElement.prototype.scrollBy = mockScrollBy;
        HTMLElement.prototype.querySelector = mockQuerySelector;

        render(<Carousel items={mockItems} renderItem={mockRenderItem} />);

        const rightArrow = screen.getByRole('button', { name: '→' });
        fireEvent.click(rightArrow);

        expect(mockScrollBy).toHaveBeenCalledWith({
            left: 316, // 300 + 16 (gap)
            behavior: 'smooth',
        });

        const leftArrow = screen.getByRole('button', { name: '←' });
        fireEvent.click(leftArrow);

        expect(mockScrollBy).toHaveBeenCalledWith({
            left: -316, // -300 - 16 (gap)
            behavior: 'smooth',
        });
    });
});
