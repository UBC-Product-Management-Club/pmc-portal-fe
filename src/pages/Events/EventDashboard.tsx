import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAttendee } from '../../hooks/useAttendee';

import.meta.glob('./*/main.tsx');
const containerClass = 'flex flex-col items-center justify-center p-8 text-center';
const contentClass =
    'mx-auto flex w-full flex-col items-center justify-center rounded-none bg-pmc-blue p-8 md:h-[27rem] md:w-[36rem] md:rounded-2xl';
const titleClass = 'mb-4 text-[2.5rem] font-bold text-pmc-light-grey';
const subtitleClass = 'mb-8 max-w-[400px] text-[1.1rem] text-pmc-light-grey';
const homeLinkClass = 'inline-block rounded-lg px-6 py-3 font-semibold text-white no-underline';

function EventNotFound() {
    return (
        <div className={containerClass}>
            <div className={contentClass}>
                <h1 className={titleClass}>Event Not Found!</h1>
                <p className={subtitleClass}>
                    We couldn’t find the event you’re looking for. It may have been removed or is
                    under construction!
                </p>
                <Link className={homeLinkClass} to="/dashboard">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

function NoEventAccess() {
    return (
        <div className={containerClass}>
            <div className={contentClass}>
                <h1 className={titleClass}>Access denied!</h1>
                <p className={subtitleClass}>
                    You don't have access to this page yet. If you think this is a mistake, contact
                    tech@ubcpmc.com.
                </p>
                <Link className={homeLinkClass} to="/dashboard">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

export default function EventDashboard() {
    const { getAttendee } = useAttendee();
    const { event_id } = useParams<{ event_id: string }>();
    const [EventComponent, setEventComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        async function route(eventId: string) {
            const attendee = await getAttendee(eventId);
            if (attendee?.status === 'REGISTERED') {
                console.log(`./${eventId}/main.tsx`);
                try {
                    const module = await import(`./${eventId}/main.tsx`);
                    setEventComponent(() => module.default);
                } catch (error) {
                    console.error(error);
                    setEventComponent(() => EventNotFound);
                }
            } else if (attendee?.status === 'ACCEPTED') {
                try {
                    const module = await import(`./Paywall.tsx`);
                    setEventComponent(() => module.default);
                } catch (error) {
                    console.error(error);
                    setEventComponent(() => EventNotFound);
                }
            } else {
                setEventComponent(() => NoEventAccess);
            }
        }
        if (event_id) {
            route(event_id);
        }
    }, [event_id, getAttendee]);

    if (!EventComponent) return <h1>Loading...</h1>;

    return (
        <Suspense fallback={<h1>loading...</h1>}>
            <EventComponent />
        </Suspense>
    );
}
