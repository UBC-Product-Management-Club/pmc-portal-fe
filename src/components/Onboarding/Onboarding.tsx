import PMCLogo from '../../assets/pmclogo.svg';
import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { IoArrowBack } from 'react-icons/io5';
import { UserDataForm } from '../UserDataForm/UserDataForm';
import { Universities, UserDataFromUser, UserDataFromUserSchema } from '../../types/User';
import { ActionTypes, useUserData } from '../../providers/UserData/UserDataProvider';
import { Payment } from '../Payment/Payment';
import { FetchFeeResponse, PaymentType } from '../../service/PaymentService';
import { Link } from 'react-router-dom';
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
    const [currPage, setCurrPage] = useState<Pages>(Pages.USER_INFO);
    const [fee, setFee] = useState<FetchFeeResponse>();
    const { user: auth0User, logout } = useAuth0();
    const { user, update } = useUserData();
    const paymentService = usePaymentService();
    const userService = useUserService();
    const containerClass =
        'relative flex min-h-screen flex-col items-center justify-evenly bg-pmc-blue';
    const contentClass =
        'relative mx-auto flex w-[70%] max-w-[750px] flex-col rounded-2xl bg-pmc-dark-blue px-20 py-8 md:px-20 md:py-8 sm:max-w-[90%] sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4';
    const returnButtonClass =
        'mt-4 mb-4 flex w-fit cursor-pointer items-center gap-4 border-0 bg-transparent text-white';
    const logoClass = 'h-16 w-16';
    const contentHeaderClass = 'my-8 text-xl text-white';
    const paymentHeaderClass = 'my-2 text-white';
    const paymentSuccessClass = 'flex flex-col items-center pt-4 text-white';
    const primaryButtonClass =
        'mt-2 block rounded-lg bg-white px-8 py-2 font-semibold text-pmc-midnight-blue';
    const buttonRowClass = 'mt-4 flex gap-3';
    const choiceButtonClass =
        'flex-1 cursor-pointer rounded-md border-none bg-blue-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-blue-800';
    const choiceLinkClass =
        'inline-flex flex-1 cursor-pointer items-center justify-center rounded-md bg-gray-500 px-5 py-2.5 text-base font-semibold text-white no-underline hover:bg-gray-600';

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
                setCurrPage(Pages.USER_INFO);
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
                            <IoArrowBack />
                            Back
                        </button>
                    )}
                    <img className={logoClass} src={PMCLogo} />
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
                                To become a PMC member for the 2025/2026 academic year, a {charge}{' '}
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
                                To become a PMC member for the 2025/2026 academic year, a {charge}{' '}
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
                                <span style={{ fontSize: 'x-large' }}>🥳</span>
                            </h1>
                            <div className={paymentSuccessClass}>
                                <img src={checkmark} width={40} />
                                <h3>Payment Successful</h3>
                                <p>We've processed your {charge} charge</p>
                                <br />
                                <Link
                                    to="/dashboard"
                                    color="white"
                                    style={{ textDecoration: 'None' }}
                                >
                                    <button className={primaryButtonClass}>
                                        Continue to dashboard
                                    </button>
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
