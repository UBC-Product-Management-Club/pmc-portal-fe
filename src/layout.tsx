import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';

export function Layout() {
    const { isLoading } = useAuth0();
    const [menuOpen, setMenuOpen] = useState(false);
    // The drawer stays mounted through its exit so it can slide away instead of vanishing
    const [menuMounted, setMenuMounted] = useState(false);
    const openerRef = useRef<HTMLElement | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => setMenuOpen(false), [pathname]);

    // Page changes run as a view transition (see index.css). BrowserRouter ignores Link's
    // viewTransition prop, so in-app link clicks are routed through it here; new tabs,
    // modified clicks, same-page anchors and browsers without the API keep normal behaviour
    useEffect(() => {
        if (!document.startViewTransition) return;
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
            if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (
                url.pathname === window.location.pathname &&
                url.search === window.location.search
            ) {
                return;
            }
            e.preventDefault();
            document.startViewTransition(() =>
                flushSync(() => navigate(url.pathname + url.search + url.hash))
            );
        };
        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, [navigate]);

    // Entering is a keyframe that runs on mount; leaving is a transition, then unmount
    useEffect(() => {
        if (menuOpen) {
            openerRef.current = document.activeElement as HTMLElement | null;
            setMenuMounted(true);
            const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
            window.addEventListener('keydown', onKey);
            return () => window.removeEventListener('keydown', onKey);
        }
        openerRef.current?.focus();
        openerRef.current = null;
        const id = setTimeout(() => setMenuMounted(false), 220);
        return () => clearTimeout(id);
    }, [menuOpen]);

    useEffect(() => {
        if (menuOpen && menuMounted) {
            panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
        }
    }, [menuOpen, menuMounted]);

    if (isLoading) return null;

    return (
        <div className="portal-bg min-h-screen pmc-type md:flex">
            <Toaster position="top-center" />

            {/* Desktop: sidebar always visible on the left */}
            <aside className="sticky top-0 z-10 hidden h-screen w-[255px] shrink-0 md:block">
                <Sidebar />
            </aside>

            {/* Phone: sidebar slides in as a full-height sheet from the menu button */}
            {menuMounted && (
                <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className={`absolute inset-0 bg-pmc-ink/30 backdrop-blur-[2px] ${menuOpen ? 'animate-[pmc-fade-in_300ms_ease-out]' : 'opacity-0 transition-opacity duration-200'}`}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        tabIndex={-1}
                    />
                    <div
                        ref={panelRef}
                        className={`relative h-full w-[min(85vw,320px)] bg-pmc-bg shadow-xl ${menuOpen ? 'animate-[pmc-drawer-in_380ms_cubic-bezier(.16,1,.3,1)] motion-reduce:animate-[pmc-fade-in_200ms_ease-out]' : '-translate-x-full transition-[translate] duration-200 ease-in motion-reduce:translate-x-0 motion-reduce:opacity-0 motion-reduce:transition-opacity'}`}
                    >
                        <Sidebar onNavigate={() => setMenuOpen(false)} />
                        <button
                            type="button"
                            onClick={() => setMenuOpen(false)}
                            className="pmc-hover-chip absolute top-4 right-2 flex size-11 items-center justify-center rounded-[10px] text-pmc-ink"
                            aria-label="Close menu"
                        >
                            <MdClose className="size-6" aria-hidden />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative min-w-0 flex-1">
                <TopBar onOpenMenu={() => setMenuOpen(true)} />
                <main className="mx-auto max-w-[1257px] px-4 py-8 [view-transition-name:portal-main] md:px-12 md:py-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
