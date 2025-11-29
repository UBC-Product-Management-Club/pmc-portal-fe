import { useEffect, useState } from 'react';
import { getEventTimestamps } from '../utils';
import { useEvents } from './useEvents';

export type Phase = 'before' | 'during' | 'after';

function useSubmissionWindow(eventId: string) {
    const { getById } = useEvents();

    const [phase, setPhase] = useState<Phase>('before');

    useEffect(() => {
        let toStartTimeout: ReturnType<typeof setTimeout> | undefined;
        let toEndTimeout: ReturnType<typeof setTimeout> | undefined;

        async function setup() {
            const event = await getById(eventId);

            const { start, end } = getEventTimestamps(event);
            const now = Date.now();

            if (now < start) {
                setPhase('before');
                toStartTimeout = setTimeout(() => setPhase('during'), start - now);
                toEndTimeout = setTimeout(() => setPhase('after'), end - now);
            } else if (now >= start && now < end) {
                setPhase('during');
                toEndTimeout = setTimeout(() => setPhase('after'), end - now);
            } else {
                setPhase('after');
            }
        }

        setup();

        return () => {
            if (toStartTimeout) clearTimeout(toStartTimeout);
            if (toEndTimeout) clearTimeout(toEndTimeout);
        };
    }, [getById, eventId]);

    return phase;
}

export { useSubmissionWindow };
