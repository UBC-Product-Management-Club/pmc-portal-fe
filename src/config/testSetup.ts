import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

const mockLocalStorage = {
    ...localStorage,
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

global.localStorage = mockLocalStorage;

afterEach(() => {
    cleanup();
});
