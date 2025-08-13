import styled from 'styled-components';
import { useUserData } from '../../providers/UserData/UserDataProvider';
import { useEvents } from '../../hooks/useEvents';
import { useEffect, useState } from 'react';
import type { EventCard as EventCardType } from '../../types/Event';
import { EventCard } from '../../components/Event/EventCard';
import moment from 'moment';
import { EventQuestionRenderer } from '../../components/EnvironmentWrappers/EventQuestionRenderer';
import { Question } from '../../types/Question';

// Test questions
const testQuestions: Question[] = [
  {
    id: "q1",
    label: "What is your name?",
    required: true,
    type: "short-answer",
  },
  {
    id: "q2",
    label: "Tell us about yourself",
    required: false,
    type: "long-answer",
  },
  {
    id: "q3",
    label: "Select your favorite fruit",
    required: true,
    type: "dropdown",
    options: ["Apple", "Banana", "Cherry"],
  },
  {
    id: "q4",
    label: "Upload your profile picture",
    required: false,
    type: "file",
  },
];

// Test onSubmit
const handleSubmit = (data: any) => {
  console.log("Form submission data:", data);
};

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
`;

const DashboardStayTuned = styled.p`
    text-align: center;
    color: white;
    font-weight: bold;
    margin-top: 5rem;
`;

export default function Dashboard() {
    const { user } = useUserData();
    const { getAll } = useEvents();
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

    return (
        <DashboardContainer>
            <DashboardSection>
                <DashboardHeader>
                    <h2>Upcoming Events</h2>
                    <WelcomeMessage>
                        {user ? `Welcome ${user.firstName}` : 'Welcome guest'}
                    </WelcomeMessage>
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
                {events === undefined ? (
                    <>{error ? <h1>An error occurred fetching events :(</h1> : <h1>Loading</h1>} </>
                ) : (
                    <>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <EventCard
                                    key={event.eventId}
                                    event={event}
                                    disabled={
                                        event.isDisabled || moment().isAfter(moment(event.date))
                                    }
                                />
                            ))
                        ) : (
                            <DashboardStayTuned>Stay tuned for future events!</DashboardStayTuned>
                        )}
                    </>
                )}
            </DashboardSection>
            <DashboardSection>
                <EventQuestionRenderer
                    onSubmit={handleSubmit}
                    questions={testQuestions}
                />
            </DashboardSection>
        </DashboardContainer>
    );
}
