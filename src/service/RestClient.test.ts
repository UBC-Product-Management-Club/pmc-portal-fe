// RestClient.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { RestClient } from './RestClient';

// Global fetch mock
const fetchMock = vi.fn();

// Replace global fetch with mock
beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('RestClient', () => {
    const baseUrl = 'https://api.example.com';
    const client = new RestClient(baseUrl);

    it('should perform a GET request and return JSON', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
                get: () => 'application/json',
            },
            json: async () => ({ data: 'test' }),
        });

        const response = await client.get<{ data: string }>('/test');

        expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/test`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: '',
                'Content-Type': 'application/json',
            },
        });
        expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
        expect(response).toEqual({ data: 'test' });
    });

    it('should perform a POST request with body', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
                get: () => 'application/json',
            },
            json: async () => ({ success: true }),
        });

        const payload = JSON.stringify({ name: 'ChatGPT' });

        const response = await client.post<{ success: boolean }>('/submit', payload);

        expect(fetchMock).toHaveBeenCalledWith(
            `${baseUrl}/submit`,
            expect.objectContaining({
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: expect.objectContaining({
                    Authorization: '',
                    'Content-Type': 'application/json',
                }),
            })
        );

        expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
        expect(response).toEqual({ success: true });
    });

    it('should handle non-JSON responses gracefully', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
                get: () => 'text/plain',
            },
            text: async () => 'Not JSON',
        });

        const result = await client.get<unknown>('/plain');
        expect(result).toBeNull(); // since non-JSON returns null
        expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
    });

    it('should throw on HTTP errors', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error',
            headers: {
                get: () => 'application/json',
            },
            json: async () => ({ error: 'fail' }),
        });

        await expect(client.get('/fail')).rejects.toThrow('HTTP error 500: Server Error');
    });

    it('should send PUT request with JSON body', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
                get: () => 'application/json',
            },
            json: async () => ({ updated: true }),
        });

        const data = { id: 1, value: 'updated' };

        const result = await client.put<typeof data, { updated: boolean }>('/update', data);

        expect(fetchMock).toHaveBeenCalledWith(
            `${baseUrl}/update`,
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify(data),
                credentials: 'include',
            })
        );

        expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
        expect(result).toEqual({ updated: true });
    });

    it('should perform a DELETE request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 204,
            statusText: 'No Content',
            headers: {
                get: () => 'application/json',
            },
            json: async () => null,
        });

        const response = await client.delete<null>('/remove');

        expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/remove`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Authorization: '',
                'Content-Type': 'application/json',
            },
        });

        expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
        expect(response).toBeNull();
    });

    describe('with JWT', () => {
        it('GET', async () => {
            (localStorage.getItem as Mock).mockReturnValueOnce('jwt');
            fetchMock.mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: {
                    get: () => 'application/json',
                },
                json: async () => ({ data: 'test' }),
            });

            const response = await client.get<{ data: string }>('/test');

            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/test`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer jwt',
                    'Content-Type': 'application/json',
                },
            });
            expect(localStorage.getItem).toHaveBeenCalledWith('id_token');
            expect(response).toEqual({ data: 'test' });
        });
    });
});
