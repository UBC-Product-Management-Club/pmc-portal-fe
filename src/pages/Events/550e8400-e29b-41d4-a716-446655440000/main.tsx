import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserData } from '../../../providers/UserData/UserDataProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gearyHeist from '../../../assets/gearyHeist.avif';
import PMCLogo from '../../../assets/pmclogo.svg';
import type { TeamResponse } from '../../../types/Team';
import { useTeam } from '../../../hooks/useTeam';
import { DeliverablesSection } from '../../../components/Deliverables/DeliverablesSection';

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
    height: calc(100vh * 2 / 3);
    display: flex;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CardVerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: #7f838f;
`;

const CardContent = styled.div<{ center?: boolean }>`
    padding: 0 1.5rem 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;

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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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

const CountdownText = styled.p`
    font-size: 1rem;
    color: var(--pmc-light-grey);
    text-align: center;
    margin: 0;
    margin-bottom: 0.25rem;
    font-weight: 500;
`;

const TeamContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
`;

const TeamSetupContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 1.5rem;
    width: 100%;
    align-items: center;
`;

const TeamSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const TeamSetupTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
`;

const TeamSetupText = styled.p`
    font-size: 0.875rem;
    color: var(--pmc-light-grey);
    margin: 0;
    line-height: 1.5;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: 640px) {
        flex-direction: row;
    }
`;

const Input = styled.input`
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(141, 155, 235, 0.3);
    background-color: var(--pmc-dark-blue);
    color: #ffffff;
    font-size: 0.875rem;
    box-sizing: border-box;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: var(--pmc-light-blue);
        box-shadow: 0 0 0 3px rgba(141, 155, 235, 0.1);
    }

    &::placeholder {
        color: var(--pmc-light-grey);
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    background: linear-gradient(135deg, var(--pmc-light-blue) 0%, #6b7bcf 100%);
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 6px -1px rgba(141, 155, 235, 0.2);

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 12px -1px rgba(141, 155, 235, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: rgba(141, 155, 235, 0.3);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const ErrorMessage = styled.div`
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    &:before {
        content: '⚠';
        font-size: 1rem;
        flex-shrink: 0;
    }
`;

const VerticalDivider = styled.div`
    width: 1px;
    align-self: stretch;
    background: linear-gradient(
        to bottom,
        rgba(141, 155, 235, 0) 0%,
        rgba(141, 155, 235, 0.3) 15%,
        rgba(141, 155, 235, 0.3) 85%,
        rgba(141, 155, 235, 0) 100%
    );
`;

const Count = styled.div`
    background-color: rgba(141, 155, 235, 0.2);
    color: #8d9beb;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
`;

const VaultImage = styled.img`
    width: 180px;
    height: 180px;
    object-fit: cover;
    filter: grayscale(75%) brightness(85%);
    opacity: 0.6;
    margin-bottom: 1rem;
    border-radius: 12px;
`;

const LockedTitle = styled.h2`
    color: #ffffff;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
`;

const LockedSubtitle = styled.p`
    color: var(--pmc-light-grey);
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
`;

const LockedDate = styled.div`
    color: #8d9beb;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.5rem;
`;

export default function ProductHeist() {
    const teamService = useTeam();
    const { event_id } = useParams();
    const { user } = useUserData();
    const navigate = useNavigate();

    const [teamData, setTeamData] = useState<TeamResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const targetDate = new Date('2025-11-29T09:00:00');
    // const dueDate = new Date('2025-11-30T12:00:00');
    // const isSubmissionOpen = new Date() >= targetDate;
    const isSubmissionOpen = true;

    const [formTeamCode, setFormTeamCode] = useState('');
    const [formTeamName, setFormTeamName] = useState('');
    const [joinError, setJoinError] = useState('');
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        const fetchTeam = async (eventId: string) => {
            try {
                const data = await teamService.getTeam(eventId);
                setTeamData(data || null);
                console.log(data);
            } catch (e) {
                setTeamData(null);
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (event_id) {
            fetchTeam(event_id);
        }
    }, [event_id]);

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
    const teamName = teamData?.Team?.team_name;
    const teamCode = teamData?.Team?.team_code;

    const handleJoinTeam = async () => {
        try {
            if (!event_id) return;

            setJoinError('');
            const data = await teamService.joinTeam(event_id, formTeamCode);
            setTeamData(data);
            setFormTeamCode('');
        } catch (e) {
            console.log(e);
            setJoinError('Unable to join team. Please check the code and try again.');
        }
    };

    const handleCreateTeam = async () => {
        try {
            if (!event_id) return;

            setCreateError('');
            const data = await teamService.createTeam(event_id, formTeamName);
            setTeamData(data);
            setFormTeamName('');
        } catch (e) {
            console.log(e);
            setCreateError('Unable to create team. Please try again.');
        }
    };

    const handleLeaveTeam = async () => {
        try {
            if (!event_id) return;

            await teamService.leaveTeam(event_id);
            setTeamData(null);
        } catch (e) {
            console.log(e);
        }
    };

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
                        <TeamName>
                            {teamName
                                ? `Team: ${teamName} (Code: ${teamCode})`
                                : 'No Team Assigned'}
                        </TeamName>
                    </Header>

                    <CardsWrapper>
                        {/* Team Members Card */}
                        <CardVerticalWrapper>
                            {/* Countdown Card (do NOT center) */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CountdownText>Heist starts in...</CountdownText>
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Meet Your Accomplices</CardTitle>
                                    {members.length > 0 && <Count>{members.length}/4</Count>}
                                </CardHeader>
                                {/* ONLY center if loading or no members */}
                                <CardContent center={loading || members.length === 0}>
                                    {loading ? (
                                        <>
                                            <Spinner />
                                            <LoadingText>Loading team...</LoadingText>
                                        </>
                                    ) : members.length > 0 ? (
                                        <TeamContainer>
                                            <div>
                                                {members.map((member) => {
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
                                                                        {user.first_name}{' '}
                                                                        {user.last_name}
                                                                    </UserName>
                                                                    <UserEmail>
                                                                        {user.email}
                                                                    </UserEmail>
                                                                </UserInfo>
                                                            </MemberContent>
                                                        </MemberItem>
                                                    );
                                                })}
                                            </div>
                                            <Button onClick={handleLeaveTeam}>Leave</Button>
                                        </TeamContainer>
                                    ) : (
                                        <TeamSetupContainer>
                                            <TeamSection>
                                                <TeamSetupTitle>Join a Team</TeamSetupTitle>
                                                <TeamSetupText>
                                                    Enter team code below to join your crew and
                                                    start planning the heist.
                                                </TeamSetupText>
                                                <InputGroup>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g. J1C8V"
                                                        value={formTeamCode}
                                                        onChange={(e) =>
                                                            setFormTeamCode(
                                                                e.target.value.toUpperCase()
                                                            )
                                                        }
                                                        maxLength={5}
                                                    />
                                                    <Button
                                                        onClick={handleJoinTeam}
                                                        disabled={!formTeamCode.trim()}
                                                    >
                                                        Join
                                                    </Button>
                                                </InputGroup>
                                                {joinError && (
                                                    <ErrorMessage>{joinError}</ErrorMessage>
                                                )}
                                            </TeamSection>

                                            <VerticalDivider />

                                            <TeamSection>
                                                <TeamSetupTitle>Create a Team</TeamSetupTitle>
                                                <TeamSetupText>
                                                    Start your own crew and get a unique code to
                                                    share with your teammates.
                                                </TeamSetupText>
                                                <InputGroup>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter team name"
                                                        value={formTeamName}
                                                        onChange={(e) =>
                                                            setFormTeamName(e.target.value)
                                                        }
                                                        maxLength={50}
                                                    />
                                                    <Button
                                                        onClick={handleCreateTeam}
                                                        disabled={!formTeamName.trim()}
                                                    >
                                                        Create
                                                    </Button>
                                                </InputGroup>
                                                {createError && (
                                                    <ErrorMessage>{createError}</ErrorMessage>
                                                )}
                                            </TeamSection>
                                        </TeamSetupContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </CardVerticalWrapper>
                        <Card>
                            <CardHeader>
                                <CardTitle>Submission Vault</CardTitle>
                            </CardHeader>

                            {!isSubmissionOpen ? (
                                <CardContent center>
                                    <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                                        <VaultImage src={gearyHeist} alt="Vault Locked" />

                                        <LockedTitle>🗝️ SUBMISSION VAULT LOCKED 🗝️</LockedTitle>
                                        <LockedSubtitle>
                                            All files are secured and hidden for now...
                                        </LockedSubtitle>

                                        <CountdownText>Deliverable are due:</CountdownText>
                                        <LockedDate>November 30, 2025 — 12:00 PM PST</LockedDate>
                                    </div>
                                </CardContent>
                            ) : (
                                <CardContent>
                                    <DeliverablesSection />
                                </CardContent>
                            )}
                        </Card>
                    </CardsWrapper>
                </Content>
            </Container>
        </PageContainer>
    );
}
