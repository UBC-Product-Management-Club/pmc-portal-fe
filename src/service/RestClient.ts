export class RestClient {
    public constructor(private readonly baseUrl: string) {}

    public async request<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
        const headers = { ...(await this.buildHeaders(options.body)), ...(options.headers || {}) };
        const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });

        if (!response.ok) {
            // Optionally log or throw a custom error
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            return response.json() as Promise<TResponse>;
        }

        // Add handling for other types if needed
        return null as unknown as TResponse;
    }

    public get<TResponse>(path: string, headers: HeadersInit = {}): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'GET',
            credentials: 'include',
            headers,
        });
    }

    public post<TResponse>(
        path: string,
        body: BodyInit,
        headers: HeadersInit = {}
    ): Promise<TResponse> {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        return this.request<TResponse>(path, {
            method: 'POST',
            credentials: 'include',
            headers: {
                ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
                ...headers,
            },
            body,
        });
    }

    public put<TRequest, TResponse>(
        path: string,
        body: TRequest,
        headers: HeadersInit = {}
    ): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });
    }

    public delete<TResponse>(path: string, headers: HeadersInit = {}): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'DELETE',
            credentials: 'include',
            headers,
        });
    }

    private async buildHeaders(body?: unknown): Promise<HeadersInit> {
        const token = localStorage.getItem('id_token');
        const headers: HeadersInit = {};
        headers.Authorization = token ? `Bearer ${token}` : '';

        if (!(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    }
}
