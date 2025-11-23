import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAttendee } from '../../../hooks/useAttendee';
import { useUserData } from '../../../providers/UserData/UserDataProvider';
import { Link, useNavigate } from 'react-router-dom';
import gearyHeist from '../../../assets/gearyHeist.avif';
import PMCLogo from '../../../assets/pmclogo.svg';
import { TeamResponse } from '../../../types/Attendee';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PageContainer = styled.div`
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;

    @media (min-width: 768px) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
`;

const Container = styled.div`
    min-height: 100vh;
    background-color: var(--pmc-dark-blue);
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
`;

const Logo = styled.img`
    padding-top: 1rem;
    height: 2.5rem;
    cursor: pointer;
`;

const UserGreeting = styled.div`
    background-color: white;
    color: black;
    border-radius: 20px;
    padding: 0.5rem 2rem;
    font-weight: 600;
    font-size: 1rem;
`;

const Content = styled.div`
    margin: 0;
    padding: 2rem 0;

    @media (min-width: 768px) {
        padding: 3rem 0;
    }
`;

const Header = styled.div`
    text-align: left;
    margin-bottom: 1.5rem;
`;

const TeamName = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: -0.025em;
    color: #ffffff;
`;

const CardsWrapper = styled.div`
    display: flex;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Card = styled.div`
    flex: 1 1 300px;
    min-width: 0;
    border: 1px solid rgba(141, 155, 235, 0.2);
    border-radius: 0.75rem;
    background-color: var(--pmc-midnight-blue);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
`;

const CardHeader = styled.div`
    padding: 0.5rem 1.5rem 0 1.5rem;
`;

const CardTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: #7f838f;
    margin-bottom: 0;
`;

const CardContent = styled.div<{ center?: boolean }>`
    padding: 0 1.5rem 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    ${({ center }) =>
        center &&
        `
        align-items: center;  /* horizontal centering */
        text-align: center;   /* text centering */
        justify-content: center; /* vertical centering */
        height: 150px;        /* optional: adjust for visual centering */
    `}
`;

const MemberItem = styled.div`
    border-bottom: 1px solid rgba(141, 155, 235, 0.15);

    &:last-child {
        border-bottom: none;
    }
`;

const MemberContent = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const Avatar = styled.div`
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    border: 2px solid rgba(141, 155, 235, 0.3);
    flex-shrink: 0;
    overflow: hidden;
`;

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const UserInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const UserName = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
`;

const UserEmail = styled.p`
    font-size: 0.875rem;
    color: var(--pmc-light-grey);
    margin-top: -1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Spinner = styled.div`
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    border: 2px solid transparent;
    border-bottom-color: var(--pmc-light-blue);
    animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
    color: var(--pmc-light-grey);
    margin-top: 1rem;
`;

const CountdownNumbers = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
`;

const TimeBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`;

const TimeValue = styled.span`
    font-size: 4rem;
    font-weight: bold;
    color: #ffffff;
`;

const TimeLabel = styled.span`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    text-transform: uppercase;
`;

const SubmissionText = styled.p`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    margin-top: 3rem;
    text-align: center;
`;

const CountdownText = styled.p`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    text-align: center;
    margin: 0;
    margin-bottom: 1rem;
    font-weight: 500;
`;

export default function ProductHeist() {
    const attendeeService = useAttendee();
    const { user } = useUserData();
    const navigate = useNavigate();

    const [teamData, setTeamData] = useState<TeamResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const targetDate = new Date('2025-11-29T09:00:00');
    const isSubmissionOpen = new Date() >= targetDate;

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await attendeeService.getTeammates(
                    '550e8400-e29b-41d4-a716-446655440000'
                );
                setTeamData(data || null);
            } catch (e) {
                setTeamData(null);
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();
            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ hours, minutes, seconds });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const members = teamData?.Team?.Team_Member || [];
    const teamName = teamData?.Team?.team_name || 'Your Team';

    return (
        <PageContainer>
            <Container>
                {/* Top bar with logo and greeting */}
                <TopBar>
                    <Logo src={PMCLogo} alt="PMC Logo" onClick={() => navigate('/dashboard')} />
                    {user && (
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <UserGreeting>Hi, {user.firstName}!</UserGreeting>
                        </Link>
                    )}
                </TopBar>

                <Content>
                    <Header>
                        <TeamName>{teamName}</TeamName>
                    </Header>

                    <CardsWrapper>
                        {/* Team Members Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Meet Your Accomplices</CardTitle>
                            </CardHeader>
                            {/* ONLY center if loading or no members */}
                            <CardContent center={loading || members.length === 0}>
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <LoadingText>Loading team...</LoadingText>
                                    </>
                                ) : members.length > 0 ? (
                                    members.map((member) => {
                                        const user = member.Attendee.User;
                                        return (
                                            <MemberItem key={member.attendee_id}>
                                                <MemberContent>
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={gearyHeist}
                                                            alt={`${user.first_name} ${user.last_name}`}
                                                        />
                                                    </Avatar>
                                                    <UserInfo>
                                                        <UserName>
                                                            {user.first_name} {user.last_name}
                                                        </UserName>
                                                        <UserEmail>{user.email}</UserEmail>
                                                    </UserInfo>
                                                </MemberContent>
                                            </MemberItem>
                                        );
                                    })
                                ) : (
                                    <LoadingText>Event Starting Soon...</LoadingText>
                                )}
                            </CardContent>
                        </Card>

                        {/* Countdown Card (do NOT center) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Your Project</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!isSubmissionOpen ? (
                                    <>
                                        <CountdownText>Submission opens in...</CountdownText>
                                        <CountdownNumbers>
                                            <TimeBlock>
                                                <TimeValue>{timeLeft.hours}</TimeValue>
                                                <TimeLabel>hours</TimeLabel>
                                            </TimeBlock>
                                            <TimeBlock>
                                                <TimeValue>{timeLeft.minutes}</TimeValue>
                                                <TimeLabel>minutes</TimeLabel>
                                            </TimeBlock>
                                            <TimeBlock>
                                                <TimeValue>{timeLeft.seconds}</TimeValue>
                                                <TimeLabel>seconds</TimeLabel>
                                            </TimeBlock>
                                        </CountdownNumbers>
                                    </>
                                ) : null}
                                <SubmissionText>
                                    DUE: November 30, 2025 | 12:00 PM PST
                                </SubmissionText>
                            </CardContent>
                        </Card>
                    </CardsWrapper>
                </Content>
            </Container>
        </PageContainer>
    );
}
