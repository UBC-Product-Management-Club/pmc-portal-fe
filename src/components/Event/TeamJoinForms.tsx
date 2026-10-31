import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../hooks/useTeam';
import { Button } from '../Portal/Button';
import { inputClass } from './applicationRules';
import { normalizeTeamCode, teamErrorMessage } from './teamErrors';

type Mode = 'create' | 'join';

// Two buttons; picking one opens its input. Both lead to the team page
export function TeamJoinForms({ eventId }: { eventId: string }) {
    const navigate = useNavigate();
    const { createTeam, joinTeam } = useTeam();
    const [mode, setMode] = useState<Mode | null>(null);
    const [value, setValue] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const open = (next: Mode) => {
        setMode(next);
        setValue('');
        setError('');
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const input = value.trim();
        if (!input || !mode) return;
        setBusy(true);
        setError('');
        try {
            if (mode === 'create') await createTeam(eventId, input);
            else await joinTeam(eventId, normalizeTeamCode(input));
            navigate(`/events/${eventId}/team`);
        } catch (err) {
            setError(teamErrorMessage(err));
            setBusy(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="primary"
                    aria-expanded={mode === 'create'}
                    onClick={() => open('create')}
                >
                    Create a team
                </Button>
                <Button aria-expanded={mode === 'join'} onClick={() => open('join')}>
                    Join with a code
                </Button>
            </div>
            <p className="text-xs text-slate-600">
                Your teammates will see your name and the email you applied with.
            </p>
            {mode && (
                <form onSubmit={submit} className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold" htmlFor="team-input">
                        {mode === 'create' ? 'Team name' : 'Team code'}
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="team-input"
                            autoFocus
                            className={`${inputClass} ${mode === 'join' ? 'uppercase placeholder:normal-case' : ''}`}
                            placeholder={mode === 'create' ? 'e.g. Royal Flush' : 'e.g. R4827'}
                            maxLength={mode === 'create' ? 80 : undefined}
                            autoCapitalize={mode === 'join' ? 'characters' : undefined}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <Button type="submit" disabled={!value.trim() || busy} className="shrink-0">
                            {mode === 'create'
                                ? busy
                                    ? 'Creating…'
                                    : 'Create'
                                : busy
                                  ? 'Joining…'
                                  : 'Join'}
                        </Button>
                    </div>
                    {error && <p className="text-sm font-medium text-red-700">{error}</p>}
                </form>
            )}
        </div>
    );
}
