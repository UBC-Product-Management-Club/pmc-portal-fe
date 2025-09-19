import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import moment from 'moment';
import { type Event } from '../../types/Event';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { styled } from 'styled-components';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { useAuth0 } from '@auth0/auth0-react';
import { EventRegistrationModal } from '../../components/Event/EventRegistrationModal';
import { Question, questionsSchema } from '../../types/Question';
import { usePaymentService } from '../../hooks/usePaymentService';
import { AttendeeSchema } from '../../types/Attendee';
import { showToast } from '../../utils';

const EventHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
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
    margin: auto;
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
        color: var(--pmc-midnight-grey);
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

interface EventProps {
    eventInfo?: ReactNode;
}

export default function Event(props: EventProps) {
    const { isAuthenticated } = useAuth0();
    const eventService = useEvents();
    const attendeeService = useAttendee();
    const paymentService = usePaymentService();
    const { event_id } = useParams<{ event_id: string }>();
    const navigateTo = useNavigate();

    const [event, setEvent] = useState<Event | undefined>();
    const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState(false);

    const mapRef = useRef<HTMLIFrameElement | null>(null);
    const scrollToMap = () => mapRef!.current!.scrollIntoView({ behavior: 'smooth' });

    // Modal UI state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch event and parses event form questions
    useEffect(() => {
        if (!event_id) return;

        eventService
            .getById(event_id)
            .then((event) => {
                setEvent(event);

                //Parse event questions
                if (
                    event.eventFormQuestions &&
                    typeof event.eventFormQuestions === 'object' &&
                    'questions' in event.eventFormQuestions
                ) {
                    const result = questionsSchema.safeParse(event.eventFormQuestions.questions);
                    if (result.success) {
                        setParsedQuestions(result.data);
                    }
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
        if (isAuthenticated) {
            eventService
                .getAttendee(event_id)
                .then((attendee) => setIsRegistered(attendee !== null))
                .catch(() => {});
        }
    }, [event_id]);

    // Display payment message and delete temp attendee record [WIP]
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const attendeeId = query.get('attendeeId');
        console.log('attendeeId', attendeeId);

        if (query.get('success')) {
            showToast('success', 'Payment successful! You are registered for the event.');
            setIsRegistered(true);
        } else if (query.get('canceled') && attendeeId) {
            attendeeService.deleteAttendee(attendeeId);
            showToast('error', 'Payment canceled, you have not been charged.');
        }
        window.history.replaceState({}, document.title, `/events/${event_id}/register`);
    }, [event_id]);

    // Create stripe session and redirects user
    const navigateToStripeEventPayment = async (eventId: string, attendeeId: string) => {
        try {
            const resp = await paymentService.createStripeSessionEventUrl(eventId, attendeeId);
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

            const attendeeId = parsed.data.attendeeId;
            if (!attendeeId) {
                throw new Error('No attendeeId returned');
            }
            await navigateToStripeEventPayment(event.eventId, attendeeId);
        } catch (err) {
            console.error('Error submitting attendee form:', err);
            setError(true);
        }
    };

    // Updates button display
    const getButtonText = useCallback(() => {
        if (!event) return '';
        if (!isAuthenticated && isRegistered === undefined) return 'Please sign in to register.';
        if (isRegistered === undefined) return 'Loading...';
        if (event.registered === event.maxAttendees) return 'Sorry! This event is full';
        if (isRegistered) return "You're already registered.";
        return 'Register now!';
    }, [event, isRegistered]);

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
                            text={moment(event.startTime).format('dddd, Do MMMM yyyy')}
                            subtext={`${moment(event.startTime).format('h:mm a')} - ${moment(event.endTime).format('h:mm a')}`}
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
                            icon={<MdOutlinePeopleAlt size={30} />}
                            text={`${event.maxAttendees - event.registered}/${event.maxAttendees} spots left!`}
                            subtext={'Register now!'}
                        />
                        <Detail
                            icon={<FaDollarSign size={30} />}
                            text={`Member price: ${event.memberPrice === 0 ? 'Free!' : event.memberPrice + '$'}`}
                            subtext={`Non-member price: ${event.nonMemberPrice}$`}
                        />
                    </Details>
                    <RegisterButton
                        disabled={event.registered === event.maxAttendees || isRegistered}
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigateTo('/');
                            } else if (!isModalOpen) {
                                setIsModalOpen(true);
                            }
                        }}
                    >
                        {getButtonText()}
                    </RegisterButton>
                </DetailsContainer>
            </EventHeader>
            <EventRegistrationModal
                isModalOpen={isModalOpen}
                questions={parsedQuestions}
                onClose={() => setIsModalOpen(false)}
                onFormSubmit={onFormSubmit}
            />
            <Description>
                <h1>About the event</h1>
                {props.eventInfo ? props.eventInfo : <p>{event.description}</p>}
                <h1>Location</h1>
                <iframe
                    ref={mapRef}
                    width="100%"
                    height="250"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${event.location}`}
                />
            </Description>
        </>
    );
}
