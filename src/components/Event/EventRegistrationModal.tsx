import Modal from 'react-modal';
import z from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { buildEventFormResponseSchema, showToast } from '../../utils';
import { Question } from '../../types/Question';
import { EventQuestionRenderer } from '../EnvironmentWrappers/EventQuestionRenderer';
import { useEventFormDraft } from '../../hooks/useEventFormDraft';
import { useEvents } from '../../hooks/useEvents.ts';
import { useState } from 'react';

type EventRegistrationModalProps = {
    isModalOpen: boolean;
    questions: Question[];
    eventId: string;
    userId: string;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFormSubmit: (formData: Record<string, any>) => Promise<void>;
    submitText?: string;
};

const modalStyles = {
    content: {
        padding: 0,
        border: 'none',
        background: 'transparent',
        inset: 'unset',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 2, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '110px',
        paddingBottom: '24px',
    },
};

export function EventRegistrationModal({
    isModalOpen,
    questions,
    eventId,
    userId,
    onClose,
    onFormSubmit,
    submitText,
}: EventRegistrationModalProps) {
    const containerClass =
        'flex max-h-[calc(100vh-140px)] w-[min(92vw,600px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--pmc-midnight-blue)]/80 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md';
    const headerClass =
        'relative flex items-center justify-between border-b border-white/10 px-8 py-6';
    const titleClass = 'text-xl font-semibold text-white';
    const closeClass =
        'flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white transition-colors hover:bg-white/10';
    const bodyClass = 'flex-1 overflow-y-auto px-8 py-6';
    const responseSchema = buildEventFormResponseSchema(questions);
    type ResponseData = z.infer<typeof responseSchema>;

    const methods = useForm<ResponseData>({
        resolver: zodResolver(responseSchema),
        shouldUnregister: false,
    });

    const { flushDraft } = useEventFormDraft({
        userId,
        eventId,
        methods,
        isOpen: isModalOpen,
        onLoadSuccess: () => showToast('success', 'Draft loaded'),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const { deleteDraft } = useEvents();

    const handleSubmit = async (data: ResponseData) => {
        setLoading(true);
        setError(null);
        try {
            await onFormSubmit(data);
            await deleteDraft(eventId);
            onClose();
        } catch (err) {
            console.error('Form submission failed:', err);
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (isClosing) return;
        setIsClosing(true);
        try {
            await flushDraft();
            showToast('success', 'Draft saved');
        } catch (err) {
            console.error('Failed to save draft on close:', err);
        } finally {
            setIsClosing(false);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={handleClose}
            contentLabel="Event Registration Modal"
            style={modalStyles}
            shouldCloseOnOverlayClick={!loading && !isClosing}
        >
            <div className={containerClass}>
                <div className={headerClass}>
                    <h2 className={titleClass}>Event Registration</h2>
                    <button
                        className={closeClass}
                        onClick={handleClose}
                        disabled={loading || isClosing}
                    >
                        {isClosing ? '...' : '×'}
                    </button>
                </div>
                <div className={bodyClass}>
                    <EventQuestionRenderer<ResponseData>
                        onSubmit={handleSubmit}
                        questions={questions}
                        methods={methods}
                        loading={loading}
                        error={error}
                        submitText={submitText}
                    />
                </div>
            </div>
        </Modal>
    );
}
