import { MdMenu } from 'react-icons/md';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useUserData } from '../../providers/UserData/UserDataProvider';

type TopBarProps = {
    onOpenMenu: () => void;
};

export function TopBar({ onOpenMenu }: TopBarProps) {
    const { user, isMember } = useUserData();
    const paymentService = usePaymentService();

    const becomeMember = async () => {
        if (!user) return;
        const { url } = await paymentService.createStripeSessionUrl();
        window.location.href = url;
    };

    return (
        <header className="portal-tint sticky top-0 z-30 flex min-h-[68px] items-center gap-4 px-4 font-geist md:justify-center md:gap-12">
            <button
                type="button"
                onClick={onOpenMenu}
                className="flex size-11 items-center justify-center rounded-[10px] text-black hover:bg-white/60 md:hidden"
                aria-label="Open menu"
            >
                <MdMenu className="size-6" aria-hidden />
            </button>
            {!isMember && (
                <>
                    <p className="hidden text-base font-medium text-black md:block">
                        Want to enjoy discounted event prices?
                    </p>
                    <button
                        type="button"
                        onClick={becomeMember}
                        className="ml-auto min-h-9 rounded-[10px] border border-portal-stroke bg-portal-surface px-4 py-2 text-sm font-semibold text-black hover:bg-white md:ml-0"
                    >
                        Become a PMC Member
                    </button>
                </>
            )}
        </header>
    );
}
