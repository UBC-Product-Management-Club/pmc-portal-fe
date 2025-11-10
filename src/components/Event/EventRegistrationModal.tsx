import Modal from 'react-modal';
import z from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { buildEventFormResponseSchema, showToast } from '../../utils';
import { styled } from 'styled-components';
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 600px;
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    background-color: var(--pmc-midnight-blue);
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const Title = styled.h2`
    color: var(--pmc-light-grey);
    margin: 0 auto; /* centers title */
    font-size: 1.5rem;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 0;
    top: 0;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    cursor: pointer;
`;

const ModalBody = styled.div`
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
`;

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
        alignItems: 'center',
        justifyContent: 'center',
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
            <Container>
                <ModalHeader>
                    <Title>Event Registration</Title>
                    <CloseButton onClick={handleClose} disabled={loading || isClosing}>
                        {isClosing ? '...' : '×'}
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <EventQuestionRenderer<ResponseData>
                        onSubmit={handleSubmit}
                        questions={questions}
                        methods={methods}
                        loading={loading}
                        error={error}
                        submitText={submitText}
                    />
                </ModalBody>
            </Container>
        </Modal>
    );
}
