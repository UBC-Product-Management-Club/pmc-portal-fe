import { useState } from 'react';
import PMCLogo from '../assets/pmclogo-ahover.png';
import PMCLogoHover from '../assets/pmclogo-hover.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserData } from '../providers/UserData/UserDataProvider';

export function Navbar() {
    const { user } = useUserData();
    const { isAuthenticated, logout } = useAuth0();
    const navigateTo = useNavigate();
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    return (
        <div className="sticky top-8 z-50 -mx-4 w-[calc(100%+2rem)] bg-[var(--pmc-midnight-blue)]/50 backdrop-blur-md flex flex-row items-center justify-between rounded-full border border-white px-4 py-2 sm:mx-0 sm:w-full sm:px-8">
            <img
                src={isLogoHovered ? PMCLogoHover : PMCLogo}
                onClick={() => navigateTo('/dashboard')}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                alt="PMC Logo"
                className="h-8 cursor-pointer"
            />
            <nav className="flex items-center gap-4 font-bold">
                {isAuthenticated && user ? (
                    <div className="relative group">
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-all duration-300 hover:border-white/70 hover:bg-white/20"
                            aria-label="User menu"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                                />
                            </svg>
                        </button>
                        <div className="absolute right-0 top-full hidden w-44 rounded-xl border border-white/15 bg-[var(--pmc-midnight-blue)] p-2 pt-3 text-center text-sm text-white shadow-lg backdrop-blur-md group-hover:block">
                            <Link
                                to="/profile"
                                className="block rounded-lg px-3 py-2 no-underline transition-all duration-200 hover:bg-gradient-to-r hover:from-[var(--pmc-light-blue)] hover:to-[var(--pmc-purple)] hover:text-white hover:shadow-lg hover:shadow-[var(--pmc-purple)]/30 hover:scale-[1.02]"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={async () =>
                                    await logout({
                                        logoutParams: {
                                            returnTo: window.location.origin,
                                        },
                                    })
                                }
                                className="group/signout inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-center transition-colors hover:bg-white/10"
                            >
                                <span>Sign out</span>
                                <span className="hidden group-hover/signout:inline-flex">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V6.75A2.25 2.25 0 0013.5 4.5h-6A2.25 2.25 0 005.25 6.75v10.5A2.25 2.25 0 007.5 19.5h6a2.25 2.25 0 002.25-2.25V15"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 12h7.5m0 0L17.25 9.75M19.5 12l-2.25 2.25"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/">
                        <button className="cursor-pointer rounded-full border-none bg-white px-4 py-2 text-base font-bold outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--pmc-light-blue)] hover:to-[var(--pmc-purple)] hover:text-white hover:shadow-lg hover:shadow-[var(--pmc-purple)]/30 hover:scale-[1.02]">
                            Sign in
                        </button>
                    </Link>
                )}
            </nav>
        </div>
    );
}
