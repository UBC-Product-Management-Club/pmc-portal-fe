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
import { styled } from 'styled-components';
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

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    min-height: 100vh;
    background-color: var(--pmc-blue);
`;
const Content = styled.div`
    width: 70%;
    max-width: 750px;
    margin: auto;
    display: flex;
    flex-direction: column;
    padding: 2rem 5rem;
    border-radius: 1rem;
    position: relative;
    background-color: #1d233f;

    @media (max-width: 768px) {
        padding: 1.5rem;
        max-width: 90%;
    }

    @media (max-width: 480px) {
        padding: 1rem;
    }
`;
const ReturnButton = styled.button`
    background-color: transparent;
    border: none;
    overflow: hidden;
    outline: none;
    width: fit-content;
    cursor: pointer;
    color: white;
    outline: none;
    display: flex;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const Logo = styled.img`
    width: 4rem;
    height: 4rem;
`;

const ContentHeader = styled.h1`
    font-size: x-large;
    margin: 2rem 0;
    color: white;
`;

const PaymentHeader = styled.p`
    color: white;
    margin: 0.5rem 0;
`;

const PaymentSuccess = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding-top: 1rem;
    padding-botton: 1 rem;
`;

const Button = styled.button`
    cursor: pointer;
    display: block;
    font-family: poppins;
    font-weight: 600;
    margin-top: 0.5rem;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    color: var(--pmc-midnight-blue);
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 16px;
`;

const StyledButton = styled.button`
    font-family: poppins;
    flex: 1;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: white;
    background-color: #2563eb;
    font-size: 1rem;
    &:hover {
        background-color: #1e40af;
    }
`;

const StyledLinkButton = styled(Link)`
    font-family: poppins;
    flex: 1;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    color: white;
    background-color: #6b7280; /* gray */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    &:hover {
        background-color: #4b5563;
    }
`;

export default function Onboarding() {
    const [responses, setResponses] = useState<Partial<UserDataFromUser>>({});
    const [currPage, setCurrPage] = useState<Pages>(Pages.USER_INFO);
    const [fee, setFee] = useState<FetchFeeResponse>();
    const { user: auth0User, logout } = useAuth0();
    const { user, update } = useUserData();
    const paymentService = usePaymentService();
    const userService = useUserService();

    useEffect(() => {
        paymentService
            .getMembershipFee()
            .then(setFee)
            .catch(() => console.error('failed to fetch fee'));
    }, []);

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
            <Container data-testid="onboarding">
                <Content>
                    {currPage !== Pages.PAYMENT_SUCCESS && (
                        <ReturnButton onClick={computePreviousPage}>
                            <IoArrowBack />
                            Back
                        </ReturnButton>
                    )}
                    <Logo src={PMCLogo} />
                    {currPage === Pages.USER_INFO && (
                        <>
                            <ContentHeader>Let's get you signed up!</ContentHeader>
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
                                            .then(() => setCurrPage(Pages.MEMBERSHIP));
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
                            <PaymentHeader>
                                To become a PMC member for the 2025/2026 academic year, a {charge}{' '}
                                membership fee is required. Would you like to become a member?
                            </PaymentHeader>
                            <ButtonRow>
                                <StyledButton
                                    onClick={() => {
                                        setCurrPage(Pages.PAYMENT);
                                    }}
                                >
                                    Yes, continue to payments
                                </StyledButton>

                                <StyledLinkButton to="/dashboard">
                                    No, continue as non-member
                                </StyledLinkButton>
                            </ButtonRow>
                        </>
                    )}
                    {currPage === Pages.PAYMENT && fee && user && (
                        <>
                            <PaymentHeader>
                                To become a PMC member for the 2025/2026 academic year, a {charge}{' '}
                                membership fee is required.
                            </PaymentHeader>
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
                            <ContentHeader>
                                Welcome to PMC {user?.firstName}!{' '}
                                <span style={{ fontSize: 'x-large' }}>🥳</span>
                            </ContentHeader>
                            <PaymentSuccess>
                                <img src={checkmark} width={40} />
                                <h3>Payment Successful</h3>
                                <p>We've processed your {charge} charge</p>
                                <br />
                                <Link
                                    to="/dashboard"
                                    color="white"
                                    style={{ textDecoration: 'None' }}
                                >
                                    <Button>Continue to dashboard</Button>
                                </Link>
                            </PaymentSuccess>
                        </>
                    )}
                </Content>
            </Container>
        );
    } else {
        return <h1>please refresh the page</h1>;
    }
}
