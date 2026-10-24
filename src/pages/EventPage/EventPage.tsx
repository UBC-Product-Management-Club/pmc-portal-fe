import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAttendee } from '../../hooks/useAttendee';
import { useTeam } from '../../hooks/useTeam';
import { usePaymentService } from '../../hooks/usePaymentService';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { Attendee } from '../../types/Attendee';
import { Event } from '../../types/Event';
import { RegisteredContent } from '../../types/EventDay';
import { showToast } from '../../utils';
import { Button, ButtonLink } from '../../components/Portal/Button';
import { EventHeader } from '../../components/Event/EventHeader';
import {
    AboutSection,
    EventLinkCards,
    ScheduleSection,
} from '../../components/Event/EventSections';
import { GettingReady } from '../../components/Event/GettingReady';
import { TeamFormation } from '../../components/Event/TeamFormation';
import {
    EventStatus,
    formatPacific,
    formatPrice,
    getEventStatus,
} from '../../components/Event/eventStatus';

// Past events with their own registered dashboard (src/pages/Events/<id>/main.tsx)
const legacyDashboards = Object.keys(import.meta.glob('../Events/*/main.tsx'));

const POLL_MS = 3000;

export default function EventPage() {
    const { event_id: eventId = '' } = useParams<{ event_id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isMember } = useUserData();
    const { getById, loadDraft, getRegisteredContent } = useEvents();
    const { getAttendee } = useAttendee();
    const { getTeam } = useTeam();
    const paymentService = usePaymentService();

    const [event, setEvent] = useState<Event>();
    const [attendee, setAttendee] = useState<Attendee | null>(null);
    const [hasDraft, setHasDraft] = useState(false);
    const [onTeam, setOnTeam] = useState(false);
    const [content, setContent] = useState<RegisteredContent | null>(null);
    const [error, setError] = useState(false);
    const [paying, setPaying] = useState(false);

    const isSignedIn = !!user;
    const returnedFromStripe = searchParams.has('success');

    const fetchAttendee = useCallback(async () => {
        const result = await getAttendee(eventId).catch(() => null);
        setAttendee(result);
        return result;
    }, [eventId, getAttendee]);

    useEffect(() => {
        getById(eventId)
            .then(setEvent)
            .catch(() => setError(true));
    }, [eventId, getById]);

    useEffect(() => {
        if (!isSignedIn) return;
        fetchAttendee();
        loadDraft(eventId)
            .then((draft) => setHasDraft(!!draft))
            .catch(() => setHasDraft(false));
    }, [eventId, isSignedIn, fetchAttendee, loadDraft]);

    const status: EventStatus | undefined =
        event && getEventStatus({ event, attendee, hasDraft, isSignedIn });

    // Payment processing (or just back from Stripe): poll until the webhook has registered them
    useEffect(() => {
        if (status !== 'PAYMENT_PROCESSING' && !(returnedFromStripe && status !== 'REGISTERED')) {
            return;
        }
        const timer = setInterval(fetchAttendee, POLL_MS);
        return () => clearInterval(timer);
    }, [status, returnedFromStripe, fetchAttendee]);

    useEffect(() => {
        if (status !== 'REGISTERED') return;
        getTeam(eventId)
            .then(() => setOnTeam(true))
            .catch(() => setOnTeam(false));
        getRegisteredContent(eventId)
            .then(setContent)
            .catch(() => setContent(null));
    }, [status, eventId, getTeam, getRegisteredContent]);

    if (error) {
        return (
            <div className="glass p-6 text-center">
                <h1 className="mb-2 text-2xl font-medium">Event not found</h1>
                <p className="mb-4">It may have been removed. Check the events in the sidebar.</p>
                <ButtonLink to="/dashboard">Back to Dashboard</ButtonLink>
            </div>
        );
    }
    if (!event || !status) return <p className="text-center">Loading…</p>;

    const yourPrice = isMember ? event.memberPrice : event.nonMemberPrice;
    const amountDue = attendee?.amountDue ?? yourPrice;

    const pay = async () => {
        setPaying(true);
        try {
            const { url } = await paymentService.getOrCreateRSVPCheckoutSession(eventId);
            window.location.href = url;
        } catch {
            showToast('error', "Couldn't start checkout. Please try again.");
            setPaying(false);
        }
    };

    const becomeMember = async () => {
        const { url } = await paymentService.createStripeSessionUrl();
        window.location.href = url;
    };

    const applyPath = `/events/${eventId}/apply`;
    const wide = 'w-full';
    const actions: Partial<Record<EventStatus, ReactNode>> = {
        SIGNED_OUT: (
            <Button className={wide} onClick={() => navigate('/')}>
                RSVP
            </Button>
        ),
        NOT_APPLIED: (
            <ButtonLink to={applyPath} className={wide}>
                RSVP
            </ButtonLink>
        ),
        DRAFT: (
            <ButtonLink to={applyPath} className={wide}>
                Continue application
            </ButtonLink>
        ),
        NOT_OPEN_YET: (
            <Button className={wide} disabled>
                Registration opens {formatPacific(event.registrationOpens)}
            </Button>
        ),
        CLOSED: (
            <Button className={wide} disabled>
                Registration closed
            </Button>
        ),
        FULL: event.waitlistForm ? (
            <a href={event.waitlistForm} className={`${wide} text-center underline`}>
                Event full · join the waitlist
            </a>
        ) : (
            <Button className={wide} disabled>
                Event full
            </Button>
        ),
        UNDER_REVIEW: (
            <Button className={wide} disabled>
                Application submitted, under review
            </Button>
        ),
        PAYMENT_WINDOW_OPEN: attendee?.paymentDueAt && (
            <Button className={wide} onClick={pay} disabled={paying}>
                Pay {formatPrice(amountDue)} by {formatPacific(attendee.paymentDueAt)}
            </Button>
        ),
        PAYMENT_PROCESSING: (
            <Button className={wide} disabled>
                Checking your payment
            </Button>
        ),
        REGISTERED: (
            <ButtonLink to={`/events/${eventId}/team`} className={wide}>
                {onTeam ? 'Go to your team' : 'Create / join a team'}
            </ButtonLink>
        ),
    };

    const messages: Partial<Record<EventStatus, string>> = {
        PAYMENT_WINDOW_OPEN: "You're in! Pay to confirm your spot.",
        PAYMENT_WINDOW_PASSED:
            "Contact the organizers if you still want to attend. If you paid before the deadline and this page hasn't updated, don't pay again: refresh shortly or contact us.",
        PAYMENT_PROCESSING:
            "We're confirming your payment with Stripe. This page updates on its own.",
        REGISTERED: 'Your spot is confirmed. See you there!',
        NOT_SELECTED:
            "Thanks for applying. We couldn't offer you a spot this time, but we'd love to see you at our next event.",
    };

    const showPrice = ![
        'REGISTERED',
        'NOT_SELECTED',
        'PAYMENT_WINDOW_PASSED',
        'PAYMENT_PROCESSING',
    ].includes(status);
    const priceLine = showPrice && (
        <p className="text-base">
            <span className="font-semibold">Your price: {formatPrice(amountDue)}</span>
            {!isMember && event.memberPrice < event.nonMemberPrice && (
                <>
                    {' · '}
                    {isSignedIn ? (
                        <button type="button" onClick={becomeMember} className="underline">
                            Become a member to pay {formatPrice(event.memberPrice)}
                        </button>
                    ) : (
                        <span className="text-slate-600">
                            Members pay {formatPrice(event.memberPrice)}
                        </span>
                    )}
                </>
            )}
        </p>
    );

    const action = actions[status];
    const hasLegacyDashboard = legacyDashboards.some((path) => path.includes(`/${eventId}/`));

    return (
        <div className="flex flex-col gap-12 pb-24 md:pb-0">
            <EventHeader
                event={event}
                status={status}
                message={messages[status]}
                priceLine={priceLine}
                action={
                    action && (
                        // Phone: the main button stays visible at the bottom while scrolling
                        <div className="fixed inset-x-0 bottom-0 z-20 bg-white/80 p-4 backdrop-blur md:static md:bg-transparent md:p-0 md:backdrop-blur-none">
                            {action}
                        </div>
                    )
                }
            />
            {status === 'REGISTERED' && hasLegacyDashboard && (
                <Link to={`/events/${eventId}/dashboard`} className="underline">
                    Open the event dashboard
                </Link>
            )}
            <AboutSection description={event.description} />
            {event.schedule && <ScheduleSection schedule={event.schedule} />}
            <EventLinkCards registered={status === 'REGISTERED'} />
            {status === 'REGISTERED' && (
                <>
                    <GettingReady eventId={eventId} content={content?.pageContent ?? null} />
                    <TeamFormation
                        eventId={eventId}
                        discordUrl={content?.discordUrl ?? null}
                        maxTeamSize={content?.maxTeamSize ?? 4}
                        onTeam={onTeam}
                    />
                </>
            )}
        </div>
    );
}
