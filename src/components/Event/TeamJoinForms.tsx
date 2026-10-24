import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../hooks/useTeam';
import { Button } from '../Portal/Button';
import { inputClass } from './applicationRules';
import { normalizeTeamCode, teamErrorMessage } from './teamErrors';

// Create a team or join one with a code; both lead to the team page
export function TeamJoinForms({ eventId }: { eventId: string }) {
    const navigate = useNavigate();
    const { createTeam, joinTeam } = useTeam();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState<'create' | 'join' | null>(null);
    const [error, setError] = useState<{ form: 'create' | 'join'; message: string } | null>(null);

    const run = async (form: 'create' | 'join', action: () => Promise<unknown>) => {
        setBusy(form);
        setError(null);
        try {
            await action();
            navigate(`/events/${eventId}/team`);
        } catch (e) {
            setError({ form, message: teamErrorMessage(e) });
            setBusy(null);
        }
    };

    const onCreate = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        run('create', () => createTeam(eventId, name.trim()));
    };

    const onJoin = (e: FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        run('join', () => joinTeam(eventId, normalizeTeamCode(code)));
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={onCreate} className="flex flex-col gap-2">
                <label className="text-sm font-semibold" htmlFor="team-name">
                    Create a team
                </label>
                <input
                    id="team-name"
                    className={inputClass}
                    placeholder="Team name"
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button type="submit" disabled={!name.trim() || busy !== null}>
                    {busy === 'create' ? 'Creating…' : 'Create a team'}
                </Button>
                {error?.form === 'create' && (
                    <p className="text-sm font-medium text-red-700">{error.message}</p>
                )}
            </form>
            <form onSubmit={onJoin} className="flex flex-col gap-2">
                <label className="text-sm font-semibold" htmlFor="team-code">
                    Join with a code
                </label>
                <input
                    id="team-code"
                    className={`${inputClass} uppercase`}
                    placeholder="e.g. R4827"
                    autoCapitalize="characters"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button type="submit" disabled={!code.trim() || busy !== null}>
                    {busy === 'join' ? 'Joining…' : 'Join with a code'}
                </Button>
                {error?.form === 'join' && (
                    <p className="text-sm font-medium text-red-700">{error.message}</p>
                )}
            </form>
        </div>
    );
}
