import '../styles/component-theme.css';
import PMCLogo from '../../assets/pmclogo.svg';

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
                <img src={PMCLogo} className="logo" alt={"PMC Logo"}/>
                <h2>Are you a member?</h2>
                <div className="event-registration-form-buttons">
                    <button
                        className="pmc-button pmc-button-white"
                        onClick={onSignInOrCreateAccount}
                    >
                        Sign in / Create an account
                    </button>
                    <button
                        className="pmc-button pmc-button-transparent"
                        onClick={onContinueAsGuest}
                    >
                        Continue as Guest Instead
                    </button>
                </div>
            </div>
    );
}