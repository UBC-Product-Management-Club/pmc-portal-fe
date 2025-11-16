import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { useAttendee } from '../../hooks/useAttendee';
// import { loadComponent } from './EventUtils';

// We'll mock these two hooks
vi.mock('react-router-dom');
vi.mock('../../hooks/useAttendee');
vi.mock('./Paywall.tsx', () => ({
    default: () => <div>Paywall</div>,
}));
vi.mock('./test-event/main.tsx', () => ({
    default: () => <div>EventMain</div>,
}));

import EventDashboard from './EventDashboard';

describe('EventDashboard', () => {
    const mockGetAttendee = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useParams, { partial: true }).mockReturnValue({
            event_id: 'test-event',
        });
        vi.mocked(useAttendee, { partial: true }).mockReturnValue({
            getAttendee: mockGetAttendee,
        });
    });

    async function renderComponent() {
        return act(() => render(<EventDashboard />));
    }

    it('renders loading state initially', async () => {
        mockGetAttendee.mockReturnValueOnce(new Promise(() => {}));

        await renderComponent();

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders Event main component when attendee is REGISTERED', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'REGISTERED' });

        await renderComponent();

        expect(await screen.findByText('EventMain')).toBeInTheDocument();
    });

    it('renders Paywall when attendee is ACCEPTED', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'ACCEPTED' });

        await renderComponent();

        expect(await screen.findByText('Paywall')).toBeInTheDocument();
    });

    it('renders NoEventAccess when attendee status is unknown', async () => {
        mockGetAttendee.mockResolvedValue({ status: 'REJECTED' });

        await renderComponent();

        expect(screen.getByText('Access denied!')).toBeInTheDocument();
    });

    it('renders loading if no event_id in params', async () => {
        (useParams as Mock).mockReturnValue({});
        await renderComponent();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
