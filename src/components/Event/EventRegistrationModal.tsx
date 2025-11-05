import Modal from 'react-modal';
import { styled } from 'styled-components';
import { Question } from '../../types/Question';
import { EventQuestionRenderer } from '../EnvironmentWrappers/EventQuestionRenderer';

type EventRegistrationModalProps = {
    isModalOpen: boolean;
    questions: Question[];
    onClose: () => void;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    onFormSubmit: (formData: Record<string, any>) => void;

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

// Renders event form + payment button
export function EventRegistrationModal({
    isModalOpen,
    questions,
    onClose,
    onFormSubmit,
    submitText,
}: EventRegistrationModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={onClose}
            contentLabel="Event Registration Modal"
            style={modalStyles}
            shouldCloseOnOverlayClick={true}
        >
            <Container>
                <ModalHeader>
                    <Title>Event Registration</Title>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>

                <ModalBody>
                    <EventQuestionRenderer
                        questions={questions}
                        onSubmit={onFormSubmit}
                        submitText={submitText}
                    />
                </ModalBody>
            </Container>
        </Modal>
    );
}
