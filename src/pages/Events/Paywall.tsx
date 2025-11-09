import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useEvents } from '../../hooks/useEvents';
import { Event } from '../../types/Event';
import styled from 'styled-components';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { IoArrowBack } from 'react-icons/io5';
import { useInAppBrowser } from '../../utils';

const PageWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--pmc-blue), var(--pmc-dark-blue));
    padding: 1.5rem;
    box-sizing: border-box;
`;

const Card = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    padding: 3rem 4rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
    max-width: 900px;
    width: 100%;
    color: white;
    backdrop-filter: blur(8px);
    text-align: left;

    @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
        gap: 1.5rem;
        padding: 2rem;
        max-width: 95%;
        text-align: center;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;

    @media screen and (max-width: 768px) {
        align-items: center;
    }
`;

const Title = styled.h1`
    font-size: 2.3rem;
    font-weight: 700;
    color: var(--pmc-light-grey);
    margin: 0;
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    color: #dfe6ef;
    max-width: 420px;
    margin: 0;
`;

const Blurb = styled.p`
    font-size: 1rem;
    color: #cfd9e5;
    line-height: 1.5;
    max-width: 480px;
    font-weight: 400;
    opacity: 0.9;
    margin: 0;

    @media screen and (max-width: 768px) {
        max-width: 90%;
    }
`;

const Button = styled.button`
    background: var(--pmc-light-grey);
    color: var(--pmc-midnight-blue);
    border: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.75rem 2rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-top: 0.5rem;
    @media screen and (min-width: 768px) {
        width: 50%;
    }
`;

const Thumbnail = styled.img`
    width: 20rem;
    height: auto;
    border-radius: 1rem;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

    @media screen and (max-width: 768px) {
        width: 14rem;
    }
`;

const MessageBox = styled.div`
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    padding: 3rem;
    text-align: center;
    color: var(--pmc-light-grey);
    font-size: 1.25rem;
    max-width: 600px;
    width: 100%;
`;

const ReturnButton = styled.button`
    background-color: transparent;
    border: none;
    overflow: hidden;
    outline: none;
    width: fit-content;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export default function Paywall() {
    const { user } = useUserData();
    const { event_id } = useParams<{ event_id: string }>();
    const { getById } = useEvents();
    const { isMobile } = useInAppBrowser();
    const paymentService = usePaymentService();
    const [error, setError] = useState<string>();
    const [event, setEvent] = useState<Event>();
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    useEffect(() => {
        if (!event_id) {
            return;
        }

        getById(event_id)
            .then(setEvent)
            .catch((error) => {
                console.error(error);
                setError('Failed to fetch event!');
            });
    }, [event_id]);

    async function checkout() {
        if (!event_id) return;
        setLoadingCheckout(true);
        try {
            const session = await paymentService.getOrCreateRSVPCheckoutSession(event_id);
            window.location.href = session.url;
        } catch (error) {
            console.error(error);
            setError('Failed to fetch checkout session!');
        }
    }

    if (error) {
        return (
            <PageWrapper>
                <MessageBox>An error occurred! Please refresh the page. {error}</MessageBox>
            </PageWrapper>
        );
    }

    if (!event) {
        return (
            <PageWrapper>
                <MessageBox>Loading event...</MessageBox>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Card>
                <Column>
                    <Link to="/dashboard">
                        <ReturnButton>
                            <IoArrowBack />
                            Back
                        </ReturnButton>
                    </Link>
                    <Title>Welcome to {event.name}!</Title>
                    <Subtitle>
                        Hi {user?.firstName ?? 'there'} 👋 — finalize your registration below to
                        confirm your spot.
                    </Subtitle>
                    {!isMobile && event.blurb && <Blurb>{event.blurb}</Blurb>}
                    <Button onClick={checkout} disabled={loadingCheckout}>
                        {loadingCheckout ? 'Loading...' : 'Secure Your Spot'}
                    </Button>
                </Column>
                <Thumbnail src={event.thumbnail} alt={`${event.name} thumbnail`} />
            </Card>
        </PageWrapper>
    );
}
