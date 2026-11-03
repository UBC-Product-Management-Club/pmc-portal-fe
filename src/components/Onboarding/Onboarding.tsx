import PMCLogo from '../../assets/pmclogo-gradient.png';
import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { IoArrowBack } from 'react-icons/io5';
import { UserDataForm } from '../UserDataForm/UserDataForm';
import { Universities, UserDataFromUser, UserDataFromUserSchema } from '../../types/User';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';
import { Payment } from '../Payment/Payment';
import { FetchFeeResponse, PaymentType } from '../../service/PaymentService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../../utils';
import { ZodError } from 'zod/v4';
import { PaymentIntent } from '@stripe/stripe-js';
import { useUserService } from '../../hooks/useUserService';
import { usePaymentService } from '../../hooks/usePaymentService';
import checkmark from '../../assets/payment_success_checkmark.svg';

enum Pages {
    USER_INFO,
    MEMBERSHIP,
    PAYMENT,
    PAYMENT_SUCCESS,
}

export default function Onboarding() {
    const [responses, setResponses] = useState<Partial<UserDataFromUser>>({});
    // Signed-in non-members arrive at ?step=membership from Become a PMC Member
    const [searchParams] = useSearchParams();
    const fromMemberButton = searchParams.get('step') === 'membership';
    const navigate = useNavigate();
    const [currPage, setCurrPage] = useState<Pages>(
        fromMemberButton ? Pages.MEMBERSHIP : Pages.USER_INFO
    );
    const [fee, setFee] = useState<FetchFeeResponse>();
    const { user: auth0User, logout } = useAuth0();
    const { user, update } = useUserData();
    const paymentService = usePaymentService();
    const userService = useUserService();
    // Matches ubcpmc.com and the portal: light page, white card, Poppins, brand-gradient main action
    const containerClass =
        'portal-bg pmc-type flex min-h-dvh flex-col items-center justify-center px-4 py-10';
    const contentClass = 'glass flex w-full max-w-[750px] flex-col px-5 py-6 sm:px-10 sm:py-8';
    const returnButtonClass =
        'mb-6 flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-[10px] text-pmc-mute transition-colors hover:text-pmc-ink focus-visible:outline-2 focus-visible:outline-pmc-accent';
    const logoClass = 'h-9 w-auto self-start';
    const contentHeaderClass = 'mt-6 mb-6 text-2xl';
    const paymentHeaderClass = 'mt-6 mb-2 leading-7';
    const paymentSuccessClass = 'flex flex-col items-center gap-1 pt-4 text-center';
    const pillClass =
        'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-6 text-base font-medium no-underline transition-[background-color,border-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pmc-accent';
    const primaryButtonClass = `${pillClass} pmc-btn-gradient text-white`;
    const buttonRowClass = 'mt-6 flex flex-col gap-3 sm:flex-row';
    const choiceButtonClass = `${primaryButtonClass} flex-1`;
    const choiceLinkClass = `${pillClass} flex-1 border border-portal-stroke bg-white text-pmc-ink hover:border-pmc-accent/30 hover:bg-portal-badge active:bg-[#e4ddf5]`;

    useEffect(() => {
        paymentService
            .getMembershipFee()
            .then(setFee)
            .catch(() => console.error('failed to fetch fee'));
    }, [paymentService]);

    async function computePreviousPage() {
        switch (currPage) {
            case Pages.USER_INFO:
                await logout({
                    logoutParams: {
                        returnTo: window.location.origin,
                    },
                });
                break;
            case Pages.MEMBERSHIP:
                if (fromMemberButton) navigate(-1);
                else setCurrPage(Pages.USER_INFO);
                break;
            case Pages.PAYMENT:
                setCurrPage(Pages.MEMBERSHIP);
        }
    }

    const charge = useMemo(() => {
        if (user && fee) {
            return formatPrice(
                user.university === Universities[0] ? fee.ubcPrice : fee.nonUbcPrice
            );
        }
    }, [user, fee]);

    if (auth0User) {
        return (
            <div className={containerClass} data-testid="onboarding">
                <div className={contentClass}>
                    {currPage !== Pages.PAYMENT_SUCCESS && (
                        <button className={returnButtonClass} onClick={computePreviousPage}>
                            <IoArrowBack aria-hidden />
                            Back
                        </button>
                    )}
                    <img className={logoClass} src={PMCLogo} alt="UBC PMC" />
                    {currPage === Pages.USER_INFO && (
                        <>
                            <h1 className={contentHeaderClass}>Let's get you signed up!</h1>
                            <UserDataForm
                                responses={responses}
                                onSubmit={(data: UserDataFromUser) => {
                                    try {
                                        const responses = UserDataFromUserSchema.parse(data);
                                        update({
                                            type: ActionTypes.UPDATE,
                                            payload: responses,
                                        });
                                        console.log(user);
                                        setResponses(responses);
                                        userService
                                            .create({ ...user, ...responses })
                                            .then(() => setCurrPage(Pages.MEMBERSHIP))
                                            .catch(() => {
                                                // handle this!
                                            });
                                    } catch (error: unknown) {
                                        if (error instanceof ZodError) {
                                            // TODO: Notify the user
                                            console.error(
                                                'An error occurred. Try inputting information again'
                                            );
                                        }
                                    }
                                }}
                                hasWaiver
                            />
                        </>
                    )}
                    {currPage === Pages.MEMBERSHIP && fee && (
                        <>
                            <p className={paymentHeaderClass}>
                                To become a PMC member for the 2026/2027 academic year, a {charge}{' '}
                                membership fee is required. Would you like to become a member?
                            </p>
                            <div className={buttonRowClass}>
                                <button
                                    className={choiceButtonClass}
                                    onClick={() => {
                                        setCurrPage(Pages.PAYMENT);
                                    }}
                                >
                                    Yes, continue to payments
                                </button>

                                <Link className={choiceLinkClass} to="/dashboard">
                                    No, continue as non-member
                                </Link>
                            </div>
                        </>
                    )}
                    {currPage === Pages.PAYMENT && fee && user && (
                        <>
                            <p className={paymentHeaderClass}>
                                To become a PMC member for the 2026/2027 academic year, a {charge}{' '}
                                membership fee is required.
                            </p>
                            <Payment
                                data-testid="payment"
                                onPayment={(payment: PaymentIntent) => {
                                    if (payment.status !== 'succeeded') {
                                        // notify the user, a payment error has occurred. They haven't been charged
                                        console.warn('Payment failed. No charge has been applied');
                                        return;
                                    }
                                    setCurrPage(Pages.PAYMENT_SUCCESS);
                                }}
                                onError={(e) => console.error(e)}
                                options={{
                                    type: PaymentType.MEMBERSHIP,
                                    userId: user.userId ?? '',
                                }}
                            />
                        </>
                    )}
                    {currPage === Pages.PAYMENT_SUCCESS && (
                        <>
                            <h1 className={contentHeaderClass}>
                                Welcome to PMC {user?.firstName}!{' '}
                                <span className="text-2xl">🥳</span>
                            </h1>
                            <div className={paymentSuccessClass}>
                                <img src={checkmark} width={40} alt="" />
                                <h3>Payment Successful</h3>
                                <p className="mb-4 text-pmc-mute">
                                    We've processed your {charge} charge
                                </p>
                                <Link to="/dashboard" className={`${primaryButtonClass} mt-2`}>
                                    Continue to dashboard
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else {
        return <h1>please refresh the page</h1>;
    }
}
