import Footer from './components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { Navbar } from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export function Layout() {
    const { isLoading } = useAuth0();
    return (
        <div className={'width-fit'}>
            {!isLoading && (
                <>
                    <Toaster position="top-center" />
                    <Navbar />
                    <div className={'container'}>
                        <Outlet />
                    </div>
                    <div className="footer">
                        <Footer />
                    </div>
                </>
            )}
        </div>
    );
}
