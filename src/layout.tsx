import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';

export function Layout() {
    const { isLoading } = useAuth0();
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => setMenuOpen(false), [pathname]);

    if (isLoading) return null;

    return (
        <div className="portal-bg min-h-screen font-geist text-black md:flex">
            <Toaster position="top-center" />

            {/* Desktop: sidebar always visible on the left */}
            <aside className="sticky top-0 hidden h-screen w-[255px] shrink-0 md:block">
                <Sidebar />
            </aside>

            {/* Phone: sidebar opens as a full-height sheet from the menu button */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    />
                    <div className="relative h-full w-[min(85vw,320px)] shadow-xl">
                        <Sidebar onNavigate={() => setMenuOpen(false)} />
                        <button
                            type="button"
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-4 right-2 flex size-11 items-center justify-center rounded-[10px] text-black"
                            aria-label="Close menu"
                        >
                            <MdClose className="size-6" aria-hidden />
                        </button>
                    </div>
                </div>
            )}

            <div className="min-w-0 flex-1">
                <TopBar onOpenMenu={() => setMenuOpen(true)} />
                <main className="mx-auto max-w-[1257px] px-4 py-8 md:px-12 md:py-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
