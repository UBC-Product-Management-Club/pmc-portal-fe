import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useEvents } from '../../hooks/useEvents';
import { Event } from '../../types/Event';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { IoArrowBack } from 'react-icons/io5';
import { useInAppBrowser } from '../../utils';

export default function Paywall() {
    const { user } = useUserData();
    const { event_id } = useParams<{ event_id: string }>();
    const { getById } = useEvents();
    const { isMobile } = useInAppBrowser();
    const paymentService = usePaymentService();
    const [error, setError] = useState<string>();
    const [event, setEvent] = useState<Event>();
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const pageClass =
        'fixed inset-0 flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--pmc-blue),var(--pmc-dark-blue))] p-6';
    const cardClass =
        'flex w-full max-w-[900px] flex-col-reverse items-center gap-6 rounded-3xl bg-[rgba(255,255,255,0.08)] px-8 py-8 text-center text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md md:flex-row md:gap-12 md:px-16 md:py-12 md:text-left';
    const columnClass = 'flex flex-col items-center gap-5 md:items-start';
    const titleClass = 'text-[2.3rem] font-bold text-pmc-light-grey';
    const subtitleClass = 'max-w-[420px] text-[1.1rem] text-[#dfe6ef]';
    const blurbClass = 'max-w-[480px] text-base text-[#cfd9e5] opacity-90 md:max-w-[90%]';
    const buttonClass =
        'mt-2 w-full rounded-xl bg-pmc-light-grey px-8 py-3 text-base font-semibold text-pmc-midnight-blue md:w-1/2';
    const thumbClass =
        'w-[14rem] rounded-2xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.3)] md:w-[20rem]';
    const messageClass =
        'w-full max-w-[600px] rounded-2xl bg-[rgba(255,255,255,0.08)] p-12 text-center text-xl text-pmc-light-grey';
    const returnClass = 'flex w-fit items-center gap-4 text-white';

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
            if (session) {
                window.location.assign(session.url);
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError('Failed to fetch checkout session!');
        }
    }

    if (error) {
        return (
            <div className={pageClass}>
                <div className={messageClass}>
                    An error occurred! Please refresh the page. {error}
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className={pageClass}>
                <div className={messageClass}>Loading event...</div>
            </div>
        );
    }

    return (
        <div className={pageClass}>
            <div className={cardClass}>
                <div className={columnClass}>
                    <Link to="/dashboard">
                        <button className={returnClass}>
                            <IoArrowBack />
                            Back
                        </button>
                    </Link>
                    <h1 className={titleClass}>Welcome to {event.name}!</h1>
                    <p className={subtitleClass}>
                        Hi {user?.firstName ?? 'there'} 👋 — finalize your registration below to
                        confirm your spot.
                    </p>
                    {!isMobile && event.blurb && <p className={blurbClass}>{event.blurb}</p>}
                    <button className={buttonClass} onClick={checkout} disabled={loadingCheckout}>
                        {loadingCheckout ? 'Loading...' : 'Secure Your Spot'}
                    </button>
                </div>
                <img className={thumbClass} src={event.thumbnail} alt={`${event.name} thumbnail`} />
            </div>
        </div>
    );
}
