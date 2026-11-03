import { useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { ButtonLink } from '../Portal/Button';
import { dismissMemberBar, isMemberBarDismissed } from './memberBar';
import { MEMBERSHIP_PATH } from './paths';

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { isMember } = useUserData();
    const [dismissed, setDismissed] = useState(isMemberBarDismissed);
    const showOffer = !isMember && !dismissed;

    const close = () => {
        dismissMemberBar();
        setDismissed(true);
    };

    return (
        <header
            className={`portal-tint sticky top-0 z-30 flex min-h-[60px] items-center gap-4 px-4 font-pmc backdrop-blur md:justify-center md:gap-6 ${showOffer ? '' : 'md:hidden'}`}
        >
            <button
                type="button"
                onClick={onOpenMenu}
                className="flex size-11 items-center justify-center rounded-[10px] text-pmc-ink hover:bg-pmc-bg md:hidden"
                aria-label="Open menu"
            >
                <MdMenu className="size-6" aria-hidden />
            </button>
            {showOffer && (
                <div className="ml-auto flex items-center gap-2 md:ml-0 md:gap-6">
                    <p className="hidden text-base font-medium text-pmc-ink md:block">
                        Want to enjoy discounted event prices?
                    </p>
                    <ButtonLink to={MEMBERSHIP_PATH} className="text-sm">
                        Become a PMC Member
                    </ButtonLink>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close membership offer"
                        className="flex size-11 items-center justify-center rounded-[10px] text-pmc-mute hover:bg-pmc-bg"
                    >
                        <MdClose className="size-5" aria-hidden />
                    </button>
                </div>
            )}
        </header>
    );
}
