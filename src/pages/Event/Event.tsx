import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';
import moment from 'moment-timezone';
import { type Event } from '../../types/Event';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { useAuth0 } from '@auth0/auth0-react';
import { EventRegistrationModal } from '../../components/Event/EventRegistrationModal';
import { Question, questionsSchema } from '../../types/Question';
import { usePaymentService } from '../../hooks/usePaymentService';
import { AttendeeSchema, AttendeeStatus } from '../../types/Attendee';
import { showToast } from '../../utils';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { CheckoutSessionResponse } from '../../service/PaymentService';
import Markdown from 'react-markdown';

interface DetailRowProps {
    icon: ReactNode;
    text: string;
    subtext?: string | ReactNode;
}

function Detail({ icon, text, subtext }: DetailRowProps) {
    return (
        <div className="flex flex-row items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--pmc-dark-purple)/30 text-(--pmc-light-blue)">
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <h4 className="m-0 text-base font-semibold text-white">{text}</h4>
                {subtext && <p className="m-0 text-sm text-gray-300">{subtext}</p>}
            </div>
        </div>
    );
}

export default function Event() {
    const { isAuthenticated, logout } = useAuth0();
    const eventService = useEvents();
    const attendeeService = useAttendee();
    const paymentService = usePaymentService();
    const { event_id } = useParams<{ event_id: string }>();
    const navigateTo = useNavigate();
    const { user } = useUserData();

    const [event, setEvent] = useState<Event | undefined>();
    const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionResponse>();
    const [attendeeStatus, setAttendeeStatus] = useState<AttendeeStatus>();
    const [error, setError] = useState(false);

    const mapRef = useRef<HTMLIFrameElement | null>(null);
    const isFull = event && event.registered >= event.maxAttendees;
    const canGoToEventPage =
        event &&
        attendeeStatus &&
        (attendeeStatus === 'REGISTERED' || attendeeStatus === 'ACCEPTED');

    const buttonState = (() => {
        if (!event) return 'hidden';
        if (!user || !isAuthenticated) return 'authRequired';
        if (loading) return 'loading';
        if (moment().isBefore(moment(event.registrationOpens))) return 'notOpenYet';
        if (attendeeStatus === 'REGISTERED') return 'alreadyRegistered';
        if (attendeeStatus === 'APPLIED') return 'applied';
        if (attendeeStatus === 'PROCESSING') return 'processing';
        if (attendeeStatus === 'ACCEPTED') return 'accepted';
        if (moment().isAfter(moment(event.registrationCloses))) return 'closed';
        if (isFull) return 'full';
        return 'open';
    })();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!event_id) return;

        const fetchData = async () => {
            try {
                const promises = [
                    eventService.getById(event_id).then((event) => {
                        setEvent(event);
                        if (
                            event.eventFormQuestions &&
                            typeof event.eventFormQuestions === 'object' &&
                            'questions' in event.eventFormQuestions
                        ) {
                            const result = questionsSchema.safeParse(
                                event.eventFormQuestions.questions
                            );
                            if (result.success) setParsedQuestions(result.data);
                        }
                    }),
                ];

                if (isAuthenticated) {
                    promises.push(
                        attendeeService
                            .getAttendee(event_id)
                            .then((attendee) => setAttendeeStatus(attendee?.status))
                    );
                }

                await Promise.all(promises);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [event_id, isAuthenticated]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            showToast('success', 'Payment successful! You are registered for the event.');
            setAttendeeStatus('REGISTERED');
        }
        window.history.replaceState({}, document.title, `/events/${event_id}/register`);
    }, [event_id]);

    useEffect(() => {
        if (event_id && attendeeStatus === 'PROCESSING') {
            paymentService
                .getOrCreateEventCheckoutSession(event_id)
                .then((session) => {
                    console.log(session);
                    setCheckoutSession(session);
                })
                .catch((error) => console.error(error));
        }
    }, [attendeeStatus, event_id]);

    const navigateToStripeEventPayment = async (eventId: string) => {
        try {
            console.log('creating checkout session');
            const resp = await paymentService.getOrCreateEventCheckoutSession(eventId);
            if (!resp.url) {
                throw new Error('Stripe session did not return a URL');
            }
            window.location.href = resp.url;
        } catch (err) {
            console.error('Stripe checkout failed', err);
            setError(true);
        }
    };

    const constructFormData = (data: Record<string, unknown>) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data)) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value === undefined || value === null) {
                formData.append(key, '');
            } else {
                formData.append(key, String(value));
            }
        }
        return formData;
    };

    const onFormSubmit = async (formData: Record<string, unknown>) => {
        if (!event?.eventId) return;

        try {
            const payload = constructFormData(formData);
            const resp = await eventService.addAttendee(event.eventId, payload);
            const parsed = AttendeeSchema.safeParse(resp.attendee);

            if (!parsed.success) {
                console.log('Validation errors:', parsed.error.issues);
                throw new Error('Attendee validation failed');
            }

            if (!event.needsReview) {
                await navigateToStripeEventPayment(event.eventId);
            } else {
                setAttendeeStatus('APPLIED');
                setIsModalOpen(false);
                showToast('success', 'Your application has been submitted.');
            }
        } catch (err) {
            console.error('Error submitting attendee form:', err);
            setError(true);
        }
    };

    const handleRegisterClick = async () => {
        if (!event || !event.eventId) return;

        const hasQuestions =
            parsedQuestions && Array.isArray(parsedQuestions) && parsedQuestions.length > 0;

        if (!hasQuestions) {
            try {
                const payload = constructFormData({});
                const resp = await eventService.addAttendee(event.eventId, payload);
                const parsed = AttendeeSchema.safeParse(resp.attendee);
                if (!parsed.success) {
                    console.error('Validation errors:', parsed.error.issues);
                    throw new Error('Attendee validation failed');
                }
                const attendeeId = parsed.data.attendeeId;
                if (!attendeeId) throw new Error('No attendeeId returned');

                await navigateToStripeEventPayment(event.eventId);
            } catch (err) {
                console.error('Error registering without questions:', err);
                setError(true);
            }
        } else {
            setIsModalOpen(true);
        }
    };

    const baseButtonClass =
        'w-full rounded-full py-3 px-6 text-base font-semibold transition-all duration-200 cursor-pointer';
    const primaryButtonClass = `${baseButtonClass} bg-gradient-to-r from-[var(--pmc-light-blue)] to-[var(--pmc-purple)] text-white hover:shadow-lg hover:shadow-[var(--pmc-purple)]/30 hover:scale-[1.02] border-none`;
    const secondaryButtonClass = `${baseButtonClass} bg-white text-[var(--pmc-dark-blue)] hover:bg-gray-100 border border-gray-200`;
    const disabledButtonClass = `${baseButtonClass} bg-gray-600 text-gray-300 cursor-not-allowed border-none`;

    const renderButton = () => {
        switch (buttonState) {
            case 'authRequired':
                return (
                    <button className={secondaryButtonClass} onClick={() => navigateTo('/')}>
                        Please sign in to register
                    </button>
                );
            case 'loading':
                return (
                    <button className={disabledButtonClass} disabled>
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></span>
                            Loading...
                        </span>
                    </button>
                );
            case 'full':
                return (
                    <a
                        href={event?.waitlistForm ? event.waitlistForm : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <button className={secondaryButtonClass}>
                            Sorry! This event is full. Join the waitlist!
                        </button>
                    </a>
                );
            case 'alreadyRegistered':
            case 'accepted':
                return (
                    <div className="flex flex-col gap-3">
                        <button
                            className={`${disabledButtonClass} bg-green-500/20 text-green-400`}
                            disabled
                        >
                            You're in!
                        </button>
                        {canGoToEventPage && (
                            <Link
                                to={
                                    event.externalPage?.startsWith('https://')
                                        ? event.externalPage
                                        : `/events/${event.eventId}`
                                }
                                target="_blank"
                                rel="noreferrer noopener"
                                className="block"
                            >
                                <button className={primaryButtonClass}>Go to event page</button>
                            </Link>
                        )}
                    </div>
                );
            case 'applied':
                return (
                    <button
                        className={`${disabledButtonClass} bg-(--pmc-purple)/20 text-(--pmc-light-blue)`}
                        disabled
                    >
                        Thank you for applying!
                    </button>
                );
            case 'notOpenYet':
                return (
                    <button className={disabledButtonClass} disabled>
                        Registration opens soon!
                    </button>
                );
            case 'closed':
                return (
                    <button className={disabledButtonClass} disabled>
                        Registration has closed
                    </button>
                );
            case 'processing':
                return (
                    <div className="flex flex-col items-center gap-2">
                        <button
                            className={`${disabledButtonClass} bg-yellow-500/20 text-yellow-400`}
                            disabled
                        >
                            We are processing your registration!
                        </button>
                        {checkoutSession && (
                            <p className="text-center text-sm text-gray-400">
                                Click{' '}
                                <a
                                    href={checkoutSession.url}
                                    target="_blank"
                                    className="font-medium text-(--pmc-light-blue) underline hover:text-white"
                                >
                                    here
                                </a>{' '}
                                to complete payment. Expires{' '}
                                {moment.unix(checkoutSession.expires_at).calendar()}
                            </p>
                        )}
                    </div>
                );
            case 'open':
                return (
                    <button className={primaryButtonClass} onClick={handleRegisterClick}>
                        Register now!
                    </button>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-(--pmc-light-blue) border-t-transparent"></div>
                <p className="text-lg text-gray-300">Loading...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--pmc-red)/20">
                    <span className="text-3xl text-(--pmc-red)">!</span>
                </div>
                <p className="text-lg text-white">
                    An error occurred fetching event details. Please try refreshing or
                </p>
                <a
                    className="cursor-pointer text-(--pmc-light-blue) underline hover:text-white"
                    onClick={() =>
                        logout({
                            logoutParams: {
                                returnTo: window.location.origin,
                            },
                        })
                    }
                >
                    signing in again
                </a>
            </div>
        );
    }

    return (
        <div className="text-white">
            {/* Back Link */}
            <Link
                to="/dashboard"
                className="mb-6 flex items-center gap-2 text-gray-400 no-underline transition-colors hover:text-white"
            >
                <IoArrowBack size={20} />
                <span>Back to Dashboard</span>
            </Link>

            {/* Header Section - Image and Basic Info Side by Side */}
            <div className="mb-10 grid gap-6 md:grid-cols-2">
                {/* Event Image */}
                <div>
                    <img
                        src={event.thumbnail}
                        alt={event.name}
                        className="rounded-2xl object-cover shadow-2xl"
                    />
                </div>

                {/* Basic Event Info */}
                <div className="flex flex-col">
                    <h1 className="mb-6 text-3xl font-bold leading-tight lg:text-4xl">
                        {event.name}
                    </h1>

                    {/* Details Card */}
                    <div className="flex flex-col grow rounded-2xl border border-gray-700 bg-(--pmc-midnight-blue)/50 p-6">
                        <div className="flex flex-col h-full gap-5">
                            <Detail
                                icon={<CiCalendar size={24} />}
                                text={moment
                                    .utc(event.startTime)
                                    .tz('America/Vancouver')
                                    .format('dddd, Do MMMM yyyy')}
                                subtext={(() => {
                                    const start = moment
                                        .utc(event.startTime)
                                        .tz('America/Vancouver');
                                    const end = moment.utc(event.endTime).tz('America/Vancouver');
                                    return start.day() === end.day()
                                        ? `${start.format('h:mm A')} - ${end.format('h:mm A z')}`
                                        : 'See times below';
                                })()}
                            />

                            <Detail
                                icon={<CiLocationOn size={24} />}
                                text={event.location}
                                subtext={
                                    <a
                                        className="cursor-pointer text-sm text-(--pmc-light-blue) underline hover:text-white"
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${event.location.replace(' ', '+')}`}
                                    >
                                        Get directions
                                    </a>
                                }
                            />

                            <Detail
                                icon={<FaDollarSign size={24} />}
                                text={`Member price: ${event.memberPrice === 0 ? 'Free!' : `$${event.memberPrice.toFixed(2)}`}`}
                                subtext={`Non-member price: $${event.nonMemberPrice.toFixed(2)}`}
                            />

                            <div className="flex-1 my-auto">
                                <iframe
                                    ref={mapRef}
                                    className="w-full rounded-xl border-2"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${event.location}`}
                                />
                            </div>

                            {/* Registration Button */}
                            <div className="mt-auto">{renderButton()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Info Section - Text wraps around map */}
            <div>
                <h2 className="mb-4 text-2xl font-bold">About the Event</h2>
                <div className="prose prose-invert max-w-none text-gray-300 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5">
                    <div className="float-right mb-6 ml-10 w-full md:w-[420px]"></div>
                    <Markdown>{event.description}</Markdown>
                    <div className="clear-both" />
                </div>
            </div>

            {/* Registration Modal */}
            {user && (
                <EventRegistrationModal
                    isModalOpen={isModalOpen}
                    questions={parsedQuestions}
                    onClose={() => setIsModalOpen(false)}
                    onFormSubmit={onFormSubmit}
                    eventId={event.eventId}
                    userId={user.userId || ''}
                    submitText={event.needsReview ? 'Submit' : undefined}
                />
            )}
        </div>
    );
}
