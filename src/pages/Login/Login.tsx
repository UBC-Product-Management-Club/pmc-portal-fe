import { useAuth0 } from '@auth0/auth0-react';
import PMCLogo from '../../assets/pmclogo-gradient.png';
import Footer from '../../components/Footer/Footer';
import { useInAppBrowser } from '../../utils';

// Matches ubcpmc.com: light lavender page, navy ink, Poppins, the brand gradient on the button
export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();
    const containerClass =
        'flex min-h-dvh w-full flex-col bg-pmc-bg px-[clamp(20px,5vw,72px)] pmc-type selection:bg-pmc-accent/20';
    const logoClass = 'flex items-center gap-2.5 py-6 text-lg font-bold tracking-[-0.02em]';
    const contentClass = 'flex flex-1 flex-col justify-center pb-16';
    const headerClass =
        'max-w-[18ch] text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance';
    const introClass = 'mt-4 max-w-[44ch] text-[1.08rem] text-pmc-mute';
    const loginButtonClass =
        'pmc-deep group mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border-0 px-6 py-3.5 text-[0.95rem] font-medium text-white shadow-[0_10px_24px_-12px_rgb(138_88_207/0.7)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgb(191_65_140/0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
    const footerClass = 'border-t border-pmc-ink/10 py-6';

    function handleLogin() {
        if (isInAppBrowser) {
            const message =
                'For security reasons, please open this page in an external browser to log in. In-app browsers are not supported for secure login.';
            window.location.href = `googlechrome://${window.location.host}${window.location.pathname}`;

            setTimeout(() => {
                window.alert(message);
            }, 200);
        } else {
            loginWithRedirect();
        }
    }

    return (
        <div className={containerClass}>
            <div className={logoClass}>
                <img src={PMCLogo} data-testid="logo" alt="" width={34} height={30} />
                UBC PMC
            </div>

            <main className={contentClass}>
                <h1 className={headerClass}>Welcome to the PMC Membership Portal</h1>
                <p className={introClass}>
                    Sign in to manage your membership, apply to events and work with your team.
                </p>
                <button type="button" className={loginButtonClass} onClick={handleLogin}>
                    Log in / sign up
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                    >
                        <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                </button>
            </main>

            <div className={footerClass}>
                <Footer />
            </div>
        </div>
    );
}
