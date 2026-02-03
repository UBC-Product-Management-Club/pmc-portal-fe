import { useAuth0 } from '@auth0/auth0-react';
import PMCLogo from '../../assets/pmclogo.svg';
import Footer from '../../components/Footer/Footer';
import { useInAppBrowser } from '../../utils';

export default function Login() {
    const { loginWithRedirect } = useAuth0();
    const { isInAppBrowser } = useInAppBrowser();
    const containerClass =
        'relative flex h-screen w-screen flex-row items-center bg-pmc-dark-blue md:flex-col md:justify-around md:bg-pmc-blue';
    const contentClass =
        'mx-auto flex w-full flex-col items-center justify-center rounded-none bg-pmc-dark-blue p-8 md:h-[27rem] md:w-[36rem] md:rounded-2xl';
    const logoClass = 'h-32 w-32 md:h-40 md:w-40';
    const headerClass =
        'text-center font-[Helvetica] leading-relaxed text-transparent bg-clip-text bg-white md:text-2xl';
    const buttonContainerClass = 'flex flex-col';
    const loginButtonClass =
        'my-2 w-[300px] cursor-pointer rounded-full border-0 bg-white py-3 text-base font-normal text-[#1c1c1c]';
    const footerClass = 'absolute bottom-4 w-full';

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
            <div className={contentClass}>
                <img className={logoClass} src={PMCLogo} data-testid="logo" alt="PMC Logo" />
                <h1 className={headerClass}> PMC Membership Portal</h1>
                <div className={buttonContainerClass}>
                    <button className={loginButtonClass} onClick={handleLogin}>
                        Log in / sign up
                    </button>
                </div>
            </div>
            <div className={footerClass}>
                <Footer />
            </div>
        </div>
    );
}
