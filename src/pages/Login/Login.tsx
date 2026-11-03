import { useAuth0 } from '@auth0/auth0-react';
import PMCLogo from '../../assets/pmclogo-gradient.png';
import Footer from '../../components/Footer/Footer';
import { useInAppBrowser } from '../../utils';

// Matches ubcpmc.com: Poppins, navy ink, the brand gradient on PMC and the button, over the
// portal's colour glows
export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();
    const containerClass =
        'portal-bg relative flex min-h-dvh w-full flex-col overflow-hidden px-[clamp(20px,5vw,72px)] pmc-type selection:bg-pmc-accent/20';
    // Short landscape screens (phones on their side) tighten the spacing so it all fits
    const logoClass =
        'flex items-center gap-2.5 py-6 text-lg font-bold tracking-[-0.02em] [@media(max-height:520px)]:py-3';
    const contentClass = 'flex flex-1 flex-col justify-center py-8 [@media(max-height:520px)]:py-3';
    const headerClass =
        'max-w-[18ch] text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance [@media(max-height:520px)]:text-[1.9rem]';
    const introClass =
        'mt-4 max-w-[44ch] text-[1.08rem] text-pmc-mute [@media(max-height:520px)]:mt-2';
    const loginButtonClass =
        'pmc-btn-gradient group mt-8 [@media(max-height:520px)]:mt-4 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border-0 px-6 py-3.5 text-[0.95rem] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
    const footerClass = 'border-t border-pmc-ink/10 py-6 [@media(max-height:520px)]:py-3';

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
                <div>
                    <h1 className={headerClass}>
                        Welcome to the <span className="pmc-gradient-text">PMC</span> Membership
                        Portal
                    </h1>
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
                </div>
            </main>

            <div className={footerClass}>
                <Footer />
            </div>
        </div>
    );
}
