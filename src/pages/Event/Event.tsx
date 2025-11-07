import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import moment from 'moment-timezone';
import { type Event } from '../../types/Event';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { styled } from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { EventRegistrationModal } from '../../components/Event/EventRegistrationModal';
import { Question, questionsSchema } from '../../types/Question';
import { usePaymentService } from '../../hooks/usePaymentService';
import { AttendeeSchema, AttendeeStatus } from '../../types/Attendee';
import { showToast } from '../../utils';
import { CheckoutSessionResponse } from '../../service/PaymentService';
import Markdown from 'react-markdown';

const EventHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
    @media screen and (max-width: 1350px) {
        flex-direction: column;
    }
`;

const DetailsContainer = styled.div`
    width: 50%;
    @media screen and (max-width: 1350px) {
        width: 100%;
    }
`;

const Thumbnail = styled.img`
    border-radius: 8px;
    max-width: 50%;
    padding: 1rem;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 1350px) {
        max-width: 100%;
        padding: 0;
    }
`;

const Title = styled.h1`
    color: #ffffff;
    font-size: xx-large;
    font-weight: bold;
`;

const Details = styled.div`
    display: flex;
    padding: 1.5rem;
    border: 1px solid #a9a9a9;
    border-radius: 12px;
    text-align: left;
    align-items: flex-start;
    flex-wrap: wrap;
    color: white;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: space-between;
`;

const DetailRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

const DetailText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    h4,
    p {
        margin: 0;
    }
`;

const RegisterButton = styled.button`
    width: 100%;
    color: #1c1c1c;
    border-radius: 20px;
    font-weight: 500;
    font-family: inherit;
    height: 3rem;
    background: #f0f0f0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    margin-top: 1rem;
    transition: border-color 0.2s;
    &:hover {
        border-color: black;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    }
    &:disabled {
        background: gray;
        cursor: not-allowed;
        color: LightGray;
    }
`;

const Description = styled.div`
    padding: 1rem;
    text-align: left;
    & > h1 {
        color: #ffffff;
        font-size: x-large;
        font-weight: bold;
    }

    & > p {
        color: white;
    }
`;

interface DetailRow {
    icon: ReactNode;
    text: string;
    subtext?: string | ReactNode;
}

function Detail(props: DetailRow) {
    return (
        <DetailRow>
            {props.icon}
            <DetailText>
                <h4>{props.text}</h4>
                {props.subtext && <p>{props.subtext}</p>}
            </DetailText>
        </DetailRow>
    );
}

export default function Event() {
    const { isAuthenticated } = useAuth0();
    const eventService = useEvents();
    const attendeeService = useAttendee();
    const paymentService = usePaymentService();
    const { event_id } = useParams<{ event_id: string }>();
    const navigateTo = useNavigate();

    const [event, setEvent] = useState<Event | undefined>();
    const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionResponse>();
    const [attendeeStatus, setAttendeeStatus] = useState<AttendeeStatus>();
    const [error, setError] = useState(false);

    const mapRef = useRef<HTMLIFrameElement | null>(null);
    const scrollToMap = () => mapRef!.current!.scrollIntoView({ behavior: 'smooth' });
    const isFull = event && event.registered >= event.maxAttendees;
    const canGoToEventPage =
        event &&
        attendeeStatus &&
        (attendeeStatus === 'REGISTERED' || attendeeStatus === 'ACCEPTED');

    const buttonState = (() => {
        if (!event) return 'hidden';
        if (isFull) return 'full';
        if (!isAuthenticated) return 'authRequired';
        if (loading) return 'loading';
        if (moment().isBefore(moment(event.registrationOpens))) return 'notOpenYet';
        if (attendeeStatus === 'REGISTERED') return 'alreadyRegistered';
        if (attendeeStatus === 'APPLIED') return 'applied';
        if (attendeeStatus === 'PROCESSING') return 'processing';
        if (attendeeStatus === 'ACCEPTED') return 'accepted';
        if (moment().isAfter(moment(event.registrationCloses))) return 'closed';
        return 'open';
    })();

    // Modal UI state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch event and parses event form questions
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

    // Display payment message and delete temp attendee record [WIP]
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
                .getCheckoutSession(event_id)
                .then((session) => {
                    console.log(session);
                    setCheckoutSession(session);
                })
                .catch((error) => console.error(error));
        }
    }, [event_id, attendeeStatus]);

    // Create stripe session and redirects user
    const navigateToStripeEventPayment = async (eventId: string) => {
        try {
            console.log('creating checkout session');
            const resp = await paymentService.createStripeSessionEventUrl(eventId);
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

    // Adds attendee response then redirect to stripe checkout
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

    const renderButton = () => {
        switch (buttonState) {
            case 'authRequired':
                return (
                    <RegisterButton onClick={() => navigateTo('/')}>
                        Please sign in to register
                    </RegisterButton>
                );
            case 'loading':
                return <RegisterButton disabled>Loading...</RegisterButton>;
            case 'full':
                return (
                    <a
                        href={event?.waitlistForm ? event.waitlistForm : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <RegisterButton>
                            Sorry! This event is full. Join the waitlist!
                        </RegisterButton>
                    </a>
                );
            case 'alreadyRegistered':
            case 'accepted':
                return (
                    <>
                        <RegisterButton disabled>You're in!</RegisterButton>
                        {canGoToEventPage && (
                            <Link
                                to={
                                    event.externalPage?.startsWith('https://')
                                        ? event.externalPage
                                        : `/events/${event.eventId}`
                                }
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <RegisterButton>Go to event page</RegisterButton>
                            </Link>
                        )}
                    </>
                );
            case 'applied':
                return <RegisterButton disabled>Thank you for applying!</RegisterButton>;
            case 'notOpenYet':
                return <RegisterButton disabled>Registration opens soon!</RegisterButton>;
            case 'closed':
                return <RegisterButton disabled>Registration has closed!</RegisterButton>;
            case 'processing':
                return (
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <RegisterButton disabled>
                            We are processing your registration!
                        </RegisterButton>
                        {checkoutSession && (
                            <span
                                style={{
                                    fontSize: '10pt',
                                    marginTop: '5px',
                                    color: 'var(--pmc-light-grey)',
                                }}
                            >
                                Click{' '}
                                <a
                                    href={checkoutSession.url}
                                    target="_blank"
                                    style={{ color: 'white' }}
                                >
                                    here
                                </a>{' '}
                                to pay. Expires {moment.unix(checkoutSession.expires_at).calendar()}
                            </span>
                        )}
                    </div>
                );
            case 'open':
                return (
                    <RegisterButton onClick={() => !isModalOpen && setIsModalOpen(true)}>
                        Register now!
                    </RegisterButton>
                );
            default:
                return null;
        }
    };

    if (loading) return <p style={{ color: 'white' }}>Loading...</p>;
    if (error) return <p>an error occurred fetching event details... try refreshing.</p>;
    if (!event) return <p style={{ color: 'white' }}>No event details available.</p>;

    return (
        <>
            <EventHeader>
                <Thumbnail src={event.thumbnail} alt="Event" />
                <DetailsContainer>
                    <Title>{event.name}</Title>
                    <Details>
                        <Detail
                            icon={<CiCalendar size={30} />}
                            text={moment
                                .utc(event.startTime)
                                .tz('America/Vancouver')
                                .format('dddd, Do MMMM yyyy')}
                            subtext={(() => {
                                const start = moment.utc(event.startTime).tz('America/Vancouver');
                                const end = moment.utc(event.endTime).tz('America/Vancouver');
                                return start.day() === end.day()
                                    ? `${start.format('h:mm A')} - ${end.format('h:mm A z')}`
                                    : 'See times below';
                            })()}
                        />
                        <Detail
                            icon={<CiLocationOn size={30} />}
                            text={event.location}
                            subtext={
                                <span style={{ cursor: 'pointer' }} onClick={scrollToMap}>
                                    Get directions
                                </span>
                            }
                        />
                        <Detail
                            icon={<FaDollarSign size={30} />}
                            text={`Member price: ${event.memberPrice === 0 ? 'Free!' : `$${event.memberPrice.toFixed(2)}`}`}
                            subtext={`Non-member price: $${event.nonMemberPrice.toFixed(2)}`}
                        />
                    </Details>
                    {renderButton()}
                    <Description>
                        <h1>About the event</h1>
                        <Markdown>{event.description}</Markdown>
                        <h1>Location</h1>
                        <iframe
                            ref={mapRef}
                            width="100%"
                            height="250"
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${event.location}`}
                        />
                    </Description>
                </DetailsContainer>
            </EventHeader>
            <EventRegistrationModal
                isModalOpen={isModalOpen}
                questions={parsedQuestions}
                onClose={() => setIsModalOpen(false)}
                onFormSubmit={onFormSubmit}
                submitText={event.needsReview ? 'Submit' : undefined}
            />
        </>
    );
}
