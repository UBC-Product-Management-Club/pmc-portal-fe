import { useEffect, useState } from 'react';
import { HEIST_END, HEIST_START } from '../utils';

export type Phase = 'before' | 'during' | 'after';

function useSubmissionWindow() {
    const getPhase = (now: number): Phase => {
        if (now < HEIST_START) return 'before';
        if (now >= HEIST_START && now < HEIST_END) return 'during';
        return 'after';
    };

    const [phase, setPhase] = useState<Phase>(() => {
        const now = Date.now();
        return getPhase(now);
    });

    useEffect(() => {
        const now = Date.now();
        let toStartTimeout: ReturnType<typeof setTimeout> | undefined;
        let toEndTimeout: ReturnType<typeof setTimeout> | undefined;

        if (now < HEIST_START) {
            toStartTimeout = setTimeout(() => {
                setPhase('during');
            }, HEIST_START - now);

            toEndTimeout = setTimeout(() => {
                setPhase('after');
            }, HEIST_END - now);
        } else if (now >= HEIST_START && now < HEIST_END) {
            toEndTimeout = setTimeout(() => {
                setPhase('after');
            }, HEIST_END - now);
        } else {
            setPhase('after');
        }

        return () => {
            if (toStartTimeout) clearTimeout(toStartTimeout);
            if (toEndTimeout) clearTimeout(toEndTimeout);
        };
    }, []);

    return phase;
}

export { useSubmissionWindow };
