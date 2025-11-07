import { useEffect, useRef, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useEvents } from './useEvents';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseEventFormDraftProps<T extends Record<string, any>> {
    userId: string;
    eventId: string;
    methods: UseFormReturn<T & FieldValues>;
    isOpen: boolean;
    debounceMs?: number;
    onLoadError?: (error: Error) => void;
    onSaveError?: (error: Error) => void;
    onLoadSuccess?: (draft: T) => void;
    onSaveSuccess?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEventFormDraft<T extends Record<string, any>>({
    userId,
    eventId,
    methods,
    isOpen,
    debounceMs = 2000,
    onLoadError,
    onSaveError,
    onLoadSuccess,
    onSaveSuccess,
}: UseEventFormDraftProps<T>) {
    const { watch, reset, getValues } = methods;
    const { loadDraft, saveDraft } = useEvents();

    const [hasLoaded, setHasLoaded] = useState(false);
    const lastSavedRef = useRef<string>('');

    // Load draft when modal opens
    useEffect(() => {
        if (!userId || !eventId || !isOpen || userId === '') {
            if (!isOpen && hasLoaded) {
                console.log('Modal closed, resetting state');
                setHasLoaded(false);
            }
            return;
        }

        if (hasLoaded) {
            console.log('Already loaded, skipping');
            return;
        }

        console.log('Loading draft...');
        let cancelled = false;

        const loadDraftData = async () => {
            try {
                const draft = await loadDraft(eventId, userId);

                if (cancelled) return;

                if (draft) {
                    const draftStr = JSON.stringify(draft);
                    lastSavedRef.current = draftStr;
                    reset(draft as T);
                    onLoadSuccess?.(draft as T);
                } else {
                    const currentValues = getValues();
                    lastSavedRef.current = JSON.stringify(currentValues);
                }

                setHasLoaded(true);
            } catch (error) {
                console.error('Load draft error:', error);
                if (!cancelled) {
                    onLoadError?.(error instanceof Error ? error : new Error(String(error)));
                    setHasLoaded(true);
                }
            }
        };

        loadDraftData();

        //cleanup, ensures only last async call updates state
        return () => {
            cancelled = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, eventId, isOpen]);

    // Debounced auto-save
    const watchedValues = watch();
    const [debouncedValues] = useDebounce(watchedValues, debounceMs);

    useEffect(() => {
        if (!hasLoaded || !isOpen || !userId || !eventId) {
            return;
        }

        const currentValues = JSON.stringify(debouncedValues);

        // Skip if nothing changed from last save
        if (currentValues === lastSavedRef.current) {
            return;
        }

        let cancelled = false;

        const saveDraftData = async () => {
            try {
                await saveDraft(eventId, userId, debouncedValues as T);
                if (!cancelled) {
                    lastSavedRef.current = currentValues;
                    onSaveSuccess?.();
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to save draft:', error);
                    onSaveError?.(error instanceof Error ? error : new Error(String(error)));
                }
            }
        };

        saveDraftData();

        return () => {
            cancelled = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoaded, debouncedValues, isOpen]);

    // Flush draft - force immediate save
    const flushDraft = useCallback(async () => {
        if (!userId || !eventId || !hasLoaded) {
            return;
        }

        const currentValues = getValues();
        const currentValuesStr = JSON.stringify(currentValues);

        if (currentValuesStr === lastSavedRef.current) {
            return;
        }

        try {
            await saveDraft(eventId, userId, currentValues as T);
            lastSavedRef.current = currentValuesStr;
            onSaveSuccess?.();
        } catch (error) {
            onSaveError?.(error instanceof Error ? error : new Error(String(error)));
        }
    }, [userId, eventId, hasLoaded]);

    return { flushDraft };
}
