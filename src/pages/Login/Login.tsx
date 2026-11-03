import { useAuth0 } from '@auth0/auth0-react';
import PMCLogo from '../../assets/pmclogo-ahover.png';
import Footer from '../../components/Footer/Footer';
import { Button } from '../../components/Portal/Button';
import { useInAppBrowser } from '../../utils';

export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();
    const containerClass =
        'portal-bg relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 font-geist text-black';
    const contentClass =
        'glass relative flex w-full max-w-[36rem] flex-col items-center gap-6 px-6 py-12 md:px-12 md:py-16';
    const logoClass = 'size-28 object-contain md:size-32';
    const headerClass = 'text-center text-2xl font-semibold md:text-3xl';
    const loginButtonClass = 'w-full max-w-[300px] cursor-pointer';
    const footerClass = 'absolute bottom-6 w-full px-4';

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
            {/* Same soft colour blobs as the portal layout */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                <div className="absolute top-1/3 -left-20 size-[420px] rounded-full bg-pink-300 opacity-50 blur-[70px]" />
                <div className="absolute -right-28 bottom-0 size-[460px] rounded-full bg-violet-300 opacity-50 blur-[70px]" />
            </div>
            <div className={contentClass}>
                <img className={logoClass} src={PMCLogo} data-testid="logo" alt="PMC Logo" />
                <h1 className={headerClass}>PMC Membership Portal</h1>
                <Button variant="primary" className={loginButtonClass} onClick={handleLogin}>
                    Log in / sign up
                </Button>
            </div>
            <div className={footerClass}>
                <Footer />
            </div>
        </div>
    );
}
