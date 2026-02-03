import Footer from './components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { Navbar } from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export function Layout() {
    const { isLoading } = useAuth0();
    const wrapperClass = 'mx-auto h-[95vh] w-[90vw] max-w-full lg:w-[65vw]';
    const containerClass = 'py-12';
    const footerClass = 'py-4';
    return (
        <div className={wrapperClass}>
            {!isLoading && (
                <>
                    <Toaster position="top-center" />
                    <Navbar />
                    <div className={containerClass}>
                        <Outlet />
                    </div>
                    <div className={footerClass}>
                        <Footer />
                    </div>
                </>
            )}
        </div>
    );
}
