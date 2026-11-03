import { Navigate, useLocation, useParams } from 'react-router-dom';

// The old info page; keeps the query (e.g. ?success from Stripe)
export default function RegisterRedirect() {
    const { event_id } = useParams<{ event_id: string }>();
    const { search } = useLocation();
    return <Navigate to={`/events/${event_id}${search}`} replace />;
}
