import PMCLogo from '../assets/pmclogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserData } from '../providers/UserData/UserDataProvider';

export function Navbar() {
    const { user } = useUserData();
    const { isAuthenticated, logout } = useAuth0();
    const navigateTo = useNavigate();

    return (
        <div className="mt-8 flex flex-row items-center justify-between rounded-full border border-white px-4 py-2 sm:px-8">
            <img
                src={PMCLogo}
                onClick={() => navigateTo('/dashboard')}
                alt="PMC Logo"
                className="h-8 cursor-pointer"
            />
            <nav className="flex items-center gap-4 font-bold">
                {user && (
                    <Link to="/profile" className="no-underline">
                        <span className="text-base text-white transition-all duration-500 hover:bg-gradient-to-r hover:from-[var(--pmc-light-blue)] hover:via-[var(--pmc-purple)] hover:to-[var(--pmc-red)] hover:bg-clip-text hover:text-transparent">
                            Profile
                        </span>
                    </Link>
                )}
                {isAuthenticated ? (
                    <button
                        onClick={async () =>
                            await logout({
                                logoutParams: {
                                    returnTo: window.location.origin,
                                },
                            })
                        }
                        className="cursor-pointer rounded-full border-none bg-white px-4 py-2 text-base font-bold outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--pmc-light-blue)] hover:via-[var(--pmc-purple)] hover:to-[var(--pmc-red)] hover:text-white"
                    >
                        Sign out
                    </button>
                ) : (
                    <Link to="/">
                        <button className="cursor-pointer rounded-full border-none bg-white px-4 py-2 text-base font-bold outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--pmc-light-blue)] hover:via-[var(--pmc-purple)] hover:to-[var(--pmc-red)] hover:text-white">
                            Sign in
                        </button>
                    </Link>
                )}
            </nav>
        </div>
    );
}
