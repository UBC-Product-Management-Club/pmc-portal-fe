// src/pages/EventDashboard/EventDashboard.tsx
import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAttendee } from '../../hooks/useAttendee';
import { loadComponent } from './EventUtils';

import.meta.glob('./pages/Events/**/main.tsx');

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
`;

const Content = styled.div`
    width: 36rem;
    height: 27rem;
    margin: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background: var(--pmc-blue);
    @media screen and (max-width: 768px) {
        width: 100%;
        height: 100;
        border-radius: 0rem;
    }
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--pmc-light-grey);
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 400px;
    color: var(--pmc-light-grey);
`;

const HomeLink = styled(Link)`
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    color: white;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s ease;
`;

function EventNotFound() {
    return (
        <Container>
            <Content>
                <Title>Event Not Found!</Title>
                <Subtitle>
                    We couldn’t find the event you’re looking for. It may have been removed or is
                    under construction!
                </Subtitle>
                <HomeLink to="/dashboard">Go Back Home</HomeLink>
            </Content>
        </Container>
    );
}

function NoEventAccess() {
    return (
        <Container>
            <Content>
                <Title>Access denied!</Title>
                <Subtitle>
                    You don't have access to this page yet. If you think this is a mistake, contact
                    tech@ubcpmc.com.
                </Subtitle>
                <HomeLink to="/dashboard">Go Back Home</HomeLink>
            </Content>
        </Container>
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
                try {
                    const module = await loadComponent(`./${eventId}/main.tsx`);
                    setEventComponent(() => module.default);
                } catch (error) {
                    console.error(error);
                    setEventComponent(() => EventNotFound);
                }
            } else if (attendee?.status === 'ACCEPTED') {
                const module = await loadComponent(`./Paywall`);
                setEventComponent(() => module.default);
            } else {
                setEventComponent(() => NoEventAccess);
            }
        }
        if (event_id) {
            route(event_id);
        }
    }, [event_id]);

    if (!EventComponent) return <h1>Loading...</h1>;

    return (
        <Suspense fallback={<h1>loading...</h1>}>
            <EventComponent />
        </Suspense>
    );
}
