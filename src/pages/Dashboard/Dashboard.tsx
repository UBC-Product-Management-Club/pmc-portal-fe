import styled from 'styled-components';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useEvents } from '../../hooks/useEvents';
import { useEffect, useState } from 'react';
import type { EventCard as EventCardType } from '../../types/Event';
import { EventCard } from '../../components/Event/EventCard';
import moment from 'moment';
import { Carousel } from '../../components/Dashboard/Carousel';

const DashboardContainer = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const DashboardSection = styled.div`
    width: 100%;
`;

const DashboardHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

const WelcomeMessage = styled.h4`
    font-style: italic;
    margin-left: 'auto';
`;

const DashboardStayTuned = styled.p`
    text-align: center;
    color: white;
    font-weight: bold;
    margin-top: 5rem;
`;

const Membership = styled.div`
    background-color: #f9fafb;
    padding: 20px 24px;
    border-radius: 10px;
    border: 1px solid #d1d1d1;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
    }
    a:hover {
        text-decoration: underline;
    }
`;

export default function Dashboard() {
    const { user, isMember } = useUserData();
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
    }, [getAll]);

    useEffect(() => {
        if (!user || typeof user !== 'object' || !('userId' in user) || !user.userId) return;

        getUserCurrentEvents(user.userId)
            .then(setUserEvents)
            .catch((e) => {
                console.error(e);
                setError(true);
            });
    }, [getUserCurrentEvents]);

    return (
        <DashboardContainer>
            <DashboardSection>
                {!isMember && (
                    <Membership>
                        Want to become a member and enjoy discounted event prices? Click{' '}
                        <a href="LINK TO PAYMENT">here</a> to join.
                    </Membership>
                )}
                <DashboardHeader>
                    <h2>PMC Dashboard</h2>
                    <WelcomeMessage>{`Welcome ${user?.firstName}`}</WelcomeMessage>
                </DashboardHeader>
                <p>
                    At PMC, our mission is to empower aspiring product managers by providing
                    valuable insights, hands-on experiences, and opportunities to connect with
                    industry leaders. Check out our upcoming events to support you on your product
                    journey and help you grow your skills, expand your network, and explore new
                    opportunities in the field!
                </p>
            </DashboardSection>

            <DashboardSection>
                <DashboardHeader>
                    <h2>Your Events</h2>
                </DashboardHeader>
                {userEvents === undefined || userEvents.length == 0 ? (
                    <>Register below</>
                ) : (
                    <Carousel
                        items={userEvents}
                        showArrows={false}
                        renderItem={(event) => (
                            <EventCard
                                event={event}
                                disabled={event.isDisabled || moment().isAfter(moment(event.date))}
                                isEventDashboard={true}
                            />
                        )}
                    />
                )}
            </DashboardSection>

            <DashboardSection>
                <DashboardHeader>
                    <h2>Upcoming Events</h2>
                </DashboardHeader>
                {events === undefined ? (
                    <>{error ? <h1>An error occurred fetching events :( </h1> : <h1>Loading</h1>}</>
                ) : (
                    <>
                        {events.length > 0 ? (
                            <Carousel
                                items={events}
                                renderItem={(event) => (
                                    <EventCard
                                        event={event}
                                        disabled={
                                            event.isDisabled || moment().isAfter(moment(event.date))
                                        }
                                        isEventDashboard={false}
                                    />
                                )}
                            />
                        ) : (
                            <DashboardStayTuned>Stay tuned for future events!</DashboardStayTuned>
                        )}
                    </>
                )}
            </DashboardSection>
        </DashboardContainer>
    );
}
