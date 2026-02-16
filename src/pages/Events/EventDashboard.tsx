import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAttendee } from '../../hooks/useAttendee';
import { Attendee } from '../../types/Attendee.ts';
import Paywall from './Paywall.tsx';

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

function RegisteredView({ eventId }: { eventId: string }) {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const mod = await import(`./${eventId}/main.tsx`);
                if (mounted) setComponent(() => mod.default);
            } catch {
                if (mounted) setComponent(() => EventNotFound);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [eventId]);

    if (!Component) return <h1>loading...</h1>;

    return <Component />;
}

function LoadingSpinner({ text }: { text?: string }) {
    return (
        <div className={containerClass}>
            <div className={contentClass}>
                <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></span>
                    {text || 'Loading...'}
                </span>
            </div>
        </div>
    );
}

function Verifying({
    attendee,
    fetchAttendee,
}: {
    attendee: Attendee;
    fetchAttendee: () => Promise<void>;
}) {
    useEffect(() => {
        const interval = setInterval(async () => {
            console.log('verifying payment..');
            await fetchAttendee();
            if (attendee?.status === 'REGISTERED') {
                clearInterval(interval);
                window.location.reload();
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return <LoadingSpinner text={'Verifying...'} />;
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
    const [attendee, setAttendee] = useState<Attendee | undefined>();

    async function fetchAttendee() {
        const attendee = await getAttendee(event_id!);
        if (attendee) {
            setAttendee(attendee);
        }
    }

    useEffect(() => {
        if (event_id) {
            fetchAttendee();
        }
    }, []);

    if (!attendee) return <h1>Loading...</h1>;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {(() => {
                switch (attendee.status) {
                    case 'REGISTERED':
                        return <RegisteredView eventId={event_id!} />;
                    case 'PROCESSING':
                        return <Verifying attendee={attendee} fetchAttendee={fetchAttendee} />;
                    case 'ACCEPTED':
                        return <Paywall />;
                    default:
                        return <NoEventAccess />;
                }
            })()}
        </Suspense>
    );
}
