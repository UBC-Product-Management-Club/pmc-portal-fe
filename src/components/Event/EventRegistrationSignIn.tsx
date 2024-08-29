import Modal from 'react-modal';
// Set the root element for the modal
Modal.setAppElement('#root');

// TODO: add PMC logo
// TODO: make sure reroute to the opened event page after user logs in
interface EventRegistrationSignInProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSignInOrCreateAccount: () => void;
    onContinueAsGuest: () => void;
}

export default function EventRegistrationSignIn(
    {
        onSignInOrCreateAccount,
        onContinueAsGuest,
     }: EventRegistrationSignInProps) {
    return (
            <div className="event-registration-form">
                <h2>Are you a member?</h2>
                <div className="event-registration-form-buttons">
                    <button
                        className="event-registration-button member-button"
                        onClick={onSignInOrCreateAccount}
                    >
                        Sign in / Create an account
                    </button>
                    <button
                        className="event-registration-button guest-button"
                        onClick={onContinueAsGuest}
                    >
                        Continue as Guest Instead
                    </button>
                </div>
            </div>
    );
}