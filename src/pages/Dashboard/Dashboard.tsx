import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useEvents } from '../../hooks/useEvents';
import { useEffect, useState } from 'react';
import type { EventCard as EventCardType } from '../../types/Event';
import { EventCard } from '../../components/Event/EventCard';
import moment from 'moment';
import { Carousel } from '../../components/Dashboard/Carousel';
import { usePaymentService } from '../../hooks/usePaymentService';

export default function Dashboard() {
    const { user, isMember } = useUserData();
    const paymentService = usePaymentService();
    const { getAll, getUserCurrentEvents } = useEvents();
    const [userEvents, setUserEvents] = useState<EventCardType[] | undefined>();
    const [events, setEvents] = useState<EventCardType[] | undefined>();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        getAll()
            .then(setEvents)
            .catch((e) => {
                console.error(e);
                setError(true);
            });
    }, []);

    useEffect(() => {
        if (user && user.userId) {
            getUserCurrentEvents()
                .then(setUserEvents)
                .catch((e) => {
                    console.error(e);
                    setError(true);
                });
        }
    }, [user]);

    const navigateToStripeMembershipPayment = async () => {
        if (user && user.userId) {
            const resp = await paymentService.createStripeSessionUrl();
            window.location.href = resp.url;
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 text-white">
            {/* Hero Section */}
            <section className="w-full">
                {/* Membership CTA Banner */}
                {isMember === false && (
                    <div className="mb-6 rounded-xl border border-gray-300 bg-gradient-to-r from-[var(--pmc-dark-purple)] to-[var(--pmc-purple)] p-5 text-white shadow-lg">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                    <span className="text-xl">✨</span>
                                </div>
                                <p className="text-base font-medium">
                                    Become a member and enjoy discounted event prices!
                                </p>
                            </div>
                            <button
                                onClick={navigateToStripeMembershipPayment}
                                className="cursor-pointer rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--pmc-dark-purple)] transition-all duration-200 hover:scale-105 hover:bg-gray-100"
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                    <h2 className="text-3xl font-bold tracking-tight">PMC Dashboard</h2>
                    <p className="text-lg italic text-[var(--pmc-light-blue)]">
                        Welcome, {user ? user.firstName : '...'}
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="mt-4 rounded-lg bg-[var(--pmc-midnight-blue)]/50 p-5">
                    <p className="leading-relaxed text-gray-200">
                        At PMC, our mission is to empower aspiring product managers by providing
                        valuable insights, hands-on experiences, and opportunities to connect with
                        industry leaders. Check out our upcoming events to support you on your
                        product journey and help you grow your skills, expand your network, and
                        explore new opportunities in the field!
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--pmc-light-blue)]">
                        All times listed are in Vancouver time (PST).
                    </p>
                </div>
            </section>

            {/* User's Registered Events Section */}
            {userEvents && userEvents.length > 0 && (
                <section className="w-full">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-1 w-8 rounded-full bg-[var(--pmc-purple)]"></div>
                        <h2 className="text-2xl font-bold">Your Events</h2>
                    </div>
                    <Carousel
                        items={userEvents}
                        showArrows={false}
                        renderItem={(event) => (
                            <EventCard
                                data-testid={`registered-${event.eventId}`}
                                event={event}
                                disabled={event.isDisabled}
                                link={event.externalPage ?? `/events/${event.eventId}`}
                            />
                        )}
                    />
                </section>
            )}

            {/* Upcoming Events Section */}
            <section className="w-full">
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>

                {events === undefined ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        {error ? (
                            <div className="text-center">
                                <p className="text-xl font-semibold text-[var(--pmc-red)]">
                                    An error occurred fetching events
                                </p>
                                <p className="mt-2 text-gray-400">Please try again later</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pmc-light-blue)] border-t-transparent"></div>
                                <p className="text-lg text-gray-300">Loading events...</p>
                            </div>
                        )}
                    </div>
                ) : events.length > 0 ? (
                    <Carousel
                        items={events}
                        renderItem={(event) => (
                            <EventCard
                                data-testid={event.eventId}
                                event={event}
                                disabled={event.isDisabled || moment().isAfter(moment(event.date))}
                                link={`/events/${event.eventId}/register`}
                            />
                        )}
                    />
                ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-500 bg-[var(--pmc-midnight-blue)]/30 p-8">
                        <p className="text-center text-xl font-bold text-white">
                            Stay tuned for future events!
                        </p>
                        <p className="mt-2 text-gray-400">
                            We're working on exciting new events for you
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
