import { useAuth0 } from '@auth0/auth0-react';
import { MdArrowForward } from 'react-icons/md';
import PMCLogo from '../../assets/pmclogo-ahover.png';
import Footer from '../../components/Footer/Footer';
import { Button } from '../../components/Portal/Button';
import { useInAppBrowser } from '../../utils';

export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();
    const containerClass =
        'portal-bg relative flex min-h-dvh w-full flex-col overflow-hidden font-geist text-slate-950 selection:bg-violet-200';
    const contentClass =
        'relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-center px-4 py-10 md:px-12';
    const headerClass =
        'login-rise mt-10 max-w-[11ch] text-[clamp(3.25rem,10vw,6rem)] leading-[0.92] font-bold tracking-[-0.04em] text-balance md:mt-14';
    const introClass = 'mt-6 max-w-[34ch] text-lg leading-7 text-violet-950/80 md:mt-8 md:text-xl';
    const loginButtonClass =
        'group min-h-14 w-full cursor-pointer gap-2 px-8 text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 sm:w-auto';
    const footerClass = 'relative mx-auto w-full max-w-[1120px] px-4 pb-6 md:px-12';

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
            {/* Same soft colour blobs as the portal layout, larger so the type sits in colour */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="absolute -top-32 right-[-10%] size-[640px] rounded-full bg-violet-300 opacity-60 blur-[90px]" />
                <div className="absolute bottom-[-20%] left-[-12%] size-[560px] rounded-full bg-pink-300 opacity-60 blur-[90px]" />
                {/* Poster-scale outlined initials fill the open right side on wide screens */}
                <span className="absolute top-1/2 right-[-4vw] hidden -translate-y-1/2 text-[clamp(14rem,30vw,30rem)] leading-none font-bold tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_rgb(255_255_255/0.8)] xl:block">
                    PMC
                </span>
            </div>

            <main className={contentClass}>
                <div className="flex items-center gap-3">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pmc-dark-blue shadow-[0_6px_16px_-6px_rgb(29_35_63/0.5)]">
                        <img
                            src={PMCLogo}
                            data-testid="logo"
                            alt="PMC Logo"
                            className="size-7 object-contain"
                        />
                    </span>
                    <span className="text-base leading-tight font-semibold">
                        UBC PMC
                        <span className="block text-sm font-normal text-violet-950/70">
                            Membership Portal
                        </span>
                    </span>
                </div>

                <h1 className={headerClass}>
                    Product <span className="text-violet-700">Management</span> Club
                </h1>
                <p className={introClass}>
                    Your membership, event applications, teams and submissions, all in one place.
                </p>

                <div className="mt-10 flex flex-col items-start gap-3">
                    <Button variant="primary" className={loginButtonClass} onClick={handleLogin}>
                        Log in / sign up
                        <MdArrowForward
                            className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                            aria-hidden
                        />
                    </Button>
                    <p className="text-sm text-violet-950/70">
                        New to PMC? The same button creates your account.
                    </p>
                </div>
            </main>

            <div className={footerClass}>
                <Footer />
            </div>
        </div>
    );
}
