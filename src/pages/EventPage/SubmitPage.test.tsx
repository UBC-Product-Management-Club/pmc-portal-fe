import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useTeam } from '../../hooks/useTeam';
import { useSubmission } from '../../hooks/useSubmission';
import { ApiError } from '../../service/RestClient';
import { showToast } from '../../utils';
import SubmitPage from './SubmitPage';

vi.mock('../../hooks/useEvents');
vi.mock('../../hooks/useTeam');
vi.mock('../../hooks/useSubmission');
vi.mock('../../utils', async (original) => ({
    ...(await original<typeof import('../../utils')>()),
    showToast: vi.fn(),
}));

const HOUR = 60 * 60 * 1000;
const fromNow = (ms: number) => new Date(Date.now() + ms).toISOString();

const phase = {
    phaseId: 'p1',
    eventId: 'e1',
    startTime: null,
    deadline: fromNow(HOUR),
    isEnabled: true,
    fields: [
        { id: 'description', type: 'long-answer', label: 'Short description', required: true },
    ],
    extendedUntil: null,
    serverTime: fromNow(0),
};

const team = { team_id: 't1', Team: { team_name: 'Royal Flush', team_code: 'R4827' } };

describe('SubmitPage', () => {
    let getPhases: Mock;
    let saveSubmission: Mock;

    const renderPage = () =>
        render(
            <MemoryRouter initialEntries={['/events/e1/submit']}>
                <Routes>
                    <Route path="/events/:event_id/submit" element={<SubmitPage />} />
                </Routes>
            </MemoryRouter>
        );

    beforeEach(() => {
        vi.resetAllMocks();
        getPhases = vi.fn().mockResolvedValue([phase]);
        saveSubmission = vi.fn();
        (useEvents as Mock).mockReturnValue({
            getById: vi.fn().mockResolvedValue({ eventId: 'e1', name: 'Product Jackpot' }),
        });
        (useTeam as Mock).mockReturnValue({ getTeam: vi.fn().mockResolvedValue(team) });
        (useSubmission as Mock).mockReturnValue({
            getPhases,
            getSubmission: vi.fn().mockResolvedValue(null),
            saveSubmission,
        });
    });

    it('opens the form for a phase with no start time', async () => {
        renderPage();

        expect(await screen.findByText('Submit your project')).toBeTruthy();
    });

    it('says when there is no phase', async () => {
        getPhases.mockResolvedValue([]);
        renderPage();

        expect(await screen.findByText("This event doesn't have a submission yet.")).toBeTruthy();
    });

    it("doesn't call a broken phase row a missing submission", async () => {
        getPhases.mockRejectedValue(new Error('invalid phase'));
        renderPage();

        expect(await screen.findByText(/Couldn't load the submission form/)).toBeTruthy();
    });

    it('explains a deck the server refuses as too large', async () => {
        saveSubmission.mockRejectedValue(new ApiError('error', 400, 'FILE_TOO_LARGE'));
        renderPage();

        fireEvent.change(await screen.findByLabelText(/Short description/), {
            target: { value: 'A product' },
        });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() =>
            expect(showToast).toHaveBeenCalledWith('error', 'That file is too large.')
        );
    });
});
