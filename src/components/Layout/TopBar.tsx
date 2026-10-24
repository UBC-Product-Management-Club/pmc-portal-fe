import { useState } from 'react';
import { MdExpandLess, MdExpandMore, MdMenu } from 'react-icons/md';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { ButtonLink } from '../Portal/Button';
import { MEMBERSHIP_PATH } from './paths';

const COLLAPSED_KEY = 'member-bar-collapsed';

function useCollapsed() {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(COLLAPSED_KEY) === 'true';
        } catch {
            return false;
        }
    });
    const toggle = () => {
        setCollapsed(!collapsed);
        try {
            localStorage.setItem(COLLAPSED_KEY, String(!collapsed));
        } catch {
            // stays collapsed for this visit only
        }
    };
    return { collapsed, toggle };
}

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { isMember } = useUserData();
    const { collapsed, toggle } = useCollapsed();
    const showOffer = !isMember && !collapsed;

    return (
        <header
            className={`portal-tint sticky top-0 z-30 flex items-center gap-4 px-4 font-geist backdrop-blur md:justify-center md:gap-6 ${showOffer ? 'min-h-[60px]' : 'min-h-[60px] md:min-h-0 md:py-1'}`}
        >
            <button
                type="button"
                onClick={onOpenMenu}
                className="flex size-11 items-center justify-center rounded-[10px] text-black hover:bg-white/60 md:hidden"
                aria-label="Open menu"
            >
                <MdMenu className="size-6" aria-hidden />
            </button>
            {!isMember && (
                <div className="ml-auto flex items-center gap-2 md:ml-0 md:gap-6">
                    {showOffer && (
                        <>
                            <p className="hidden text-base font-medium text-black md:block">
                                Want to enjoy discounted event prices?
                            </p>
                            <ButtonLink to={MEMBERSHIP_PATH} className="text-sm">
                                Become a PMC Member
                            </ButtonLink>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={showOffer}
                        aria-label={showOffer ? 'Hide membership offer' : 'Show membership offer'}
                        className="flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-sm text-slate-600 hover:bg-white/60"
                    >
                        {!showOffer && 'Membership'}
                        {showOffer ? (
                            <MdExpandLess className="size-5" aria-hidden />
                        ) : (
                            <MdExpandMore className="size-5" aria-hidden />
                        )}
                    </button>
                </div>
            )}
        </header>
    );
}
