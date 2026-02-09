import PMCLogo from '../../assets/pmclogo.svg';

// TODO: add PMC logo
// TODO: make sure reroute to the opened event page after user logs in
interface EventRegistrationSignInProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSignInOrCreateAccount: () => void;
    onContinueAsGuest: () => void;
}

export default function EventRegistrationSignIn({
    onSignInOrCreateAccount,
    onContinueAsGuest,
}: EventRegistrationSignInProps) {
    const containerClass = 'flex flex-col items-center gap-4';
    const logoClass = 'h-14 w-[70px]';
    const buttonGroupClass = 'flex w-[70%] flex-col gap-2';
    const baseButtonClass = 'min-w-[10rem] rounded-full px-3 py-3 text-sm font-semibold';
    const primaryButtonClass = `${baseButtonClass} bg-white text-pmc-midnight-blue`;
    const ghostButtonClass = `${baseButtonClass} bg-transparent text-white`;
    return (
        <div className={containerClass}>
            <img src={PMCLogo} className={logoClass} alt={'PMC Logo'} />
            <h2>Are you a member?</h2>
            <div className={buttonGroupClass}>
                <button className={primaryButtonClass} onClick={onSignInOrCreateAccount}>
                    Sign in / Create an account
                </button>
                <button className={ghostButtonClass} onClick={onContinueAsGuest}>
                    Continue as Guest Instead
                </button>
            </div>
        </div>
    );
}
