import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserService } from './useUserService';

const mockFetch = vi.fn();
const mockCreate = vi.fn();

vi.mock('../service/UserService', () => {
    return {
        UserService: vi.fn().mockImplementation(() => ({
            fetch: mockFetch,
            create: mockCreate,
        })),
    };
});

describe('useUserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const rawMockUser = {
        user_id: 'user123',
        email: 'test@example.com',
        university: 'University of British Columbia',
        display_name: 'geary',
        first_name: 'geary',
        last_name: 'abc',
        pfp: 'https://url.com',
        pronouns: '',
        why_pm: 'abc',
        is_payment_verified: false,
        faculty: 'faculty',
        major: 'major',
        student_id: '12345678',
        year: '3',
    };

    const mockUser = {
        userId: 'user123',
        email: 'test@example.com',
        university: 'University of British Columbia',
        displayName: 'geary',
        firstName: 'geary',
        lastName: 'abc',
        pfp: 'https://url.com',
        pronouns: '',
        whyPm: 'abc',
        isPaymentVerified: false,
        faculty: 'faculty',
        major: 'major',
        studentId: '12345678',
        year: '3',
    };

    it('fetches user with userId', async () => {
        mockFetch.mockResolvedValueOnce(rawMockUser);

        const { result } = renderHook(() => useUserService());
        const res = await result.current.get('user123');

        expect(mockFetch).toHaveBeenCalledWith('user123');
        expect(res).toEqual(mockUser);
    });

    it('fetches non-existing user', async () => {
        mockFetch.mockRejectedValueOnce(new Error('User not found!'));

        const { result } = renderHook(() => useUserService());
        await expect(result.current.get('unknown-user')).rejects.toThrowError('User not found!');
    });

    it('calls create with user', async () => {
        const { result } = renderHook(() => useUserService());
        await result.current.create({ email: 'x@example.com' });

        expect(mockCreate).toHaveBeenCalledWith({
            email: 'x@example.com',
            isPaymentVerified: false,
        });
    });
});
