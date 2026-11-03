// Carries the API error code, e.g. STALE, STALE_DRAFT, ROSTER_LOCKED, RATE_LIMITED
export class ApiError extends Error {
    public constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
        public readonly fields?: Record<string, string>,
        public readonly body?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class RestClient {
    public constructor(private readonly baseUrl: string) {}

    public async request<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
        const headers = { ...(await this.buildHeaders(options.body)), ...(options.headers || {}) };
        const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });

        if (!response.ok) {
            throw await this.toApiError(response);
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
        body?: BodyInit,
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

    public patch<TRequest, TResponse>(
        path: string,
        body: TRequest,
        headers: HeadersInit = {}
    ): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'PATCH',
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

    // Handles both { error: "message" } (older routes) and { error: { code, message, fields } }
    private async toApiError(response: Response): Promise<ApiError> {
        const message = `HTTP error ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('Content-Type') || '';
        if (!contentType.includes('application/json')) {
            return new ApiError(message, response.status);
        }

        const body = await response.json().catch(() => undefined);
        const error = body?.error;
        if (error && typeof error === 'object') {
            return new ApiError(message, response.status, error.code, error.fields, body);
        }
        return new ApiError(message, response.status, undefined, undefined, body);
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
