import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ApiError } from '../service/RestClient';
import { JsonValue } from '../service/EventService';
import { useEvents } from './useEvents';

export type DraftValues = Record<string, string>;
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'stale';

// Drafts come back as { draft, version } once versioned; older drafts are just the values
function readDraft(raw: Record<string, JsonValue> | null) {
    if (!raw) return { values: null, version: undefined };
    if ('draft' in raw && typeof raw.draft === 'object' && raw.draft !== null) {
        return {
            values: raw.draft as DraftValues,
            version: typeof raw.version === 'number' ? raw.version : undefined,
        };
    }
    return { values: raw as DraftValues, version: undefined };
}

// Text answers only; files upload on submit. A stale save (another tab) is never applied silently.
export function useApplicationDraft(eventId: string, enabled: boolean) {
    const { loadDraft, saveDraft, deleteDraft } = useEvents();
    const [initial, setInitial] = useState<DraftValues | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [serverCopy, setServerCopy] = useState<DraftValues | null>(null);
    const version = useRef<number | undefined>(undefined);
    const lastSaved = useRef('');
    const pending = useRef<DraftValues | null>(null);
    const stale = useRef(false);

    useEffect(() => {
        if (!enabled) return;
        loadDraft(eventId)
            .then((raw) => {
                const { values, version: v } = readDraft(raw);
                version.current = v;
                lastSaved.current = JSON.stringify(values ?? {});
                setInitial(values);
            })
            .catch(() => setInitial(null))
            .finally(() => setLoaded(true));
    }, [eventId, enabled, loadDraft]);

    const save = useCallback(
        async (values: DraftValues) => {
            pending.current = values;
            const serialized = JSON.stringify(values);
            if (stale.current || serialized === lastSaved.current) return;
            setStatus('saving');
            try {
                await saveDraft(eventId, values, version.current);
                if (version.current !== undefined) version.current += 1;
                lastSaved.current = serialized;
                setStatus('saved');
            } catch (error) {
                if (error instanceof ApiError && error.code === 'STALE_DRAFT') {
                    const body = error.body as { draft?: DraftValues; version?: number };
                    setServerCopy(body?.draft ?? null);
                    version.current = body?.version;
                    stale.current = true;
                    setStatus('stale');
                } else {
                    setStatus('error');
                }
            }
        },
        [eventId, saveDraft]
    );

    const queueSave = useDebouncedCallback(save, 1500);

    const retry = () => pending.current && save(pending.current);

    // Use the other tab's copy; the caller resets the form with it
    const takeServerCopy = () => {
        stale.current = false;
        const copy = serverCopy ?? {};
        lastSaved.current = JSON.stringify(copy);
        setServerCopy(null);
        setStatus('saved');
        return copy;
    };

    // Keep this tab's answers: save them over the newer copy
    const keepMine = () => {
        stale.current = false;
        setServerCopy(null);
        lastSaved.current = '';
        return pending.current && save(pending.current);
    };

    const clear = () => {
        queueSave.cancel();
        return deleteDraft(eventId).catch(() => undefined);
    };

    return { initial, loaded, status, queueSave, retry, takeServerCopy, keepMine, clear };
}
