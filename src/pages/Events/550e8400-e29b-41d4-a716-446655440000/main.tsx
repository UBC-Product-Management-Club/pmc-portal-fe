import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserData } from '../../../providers/UserData/UserDataProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gearyHeist from '../../../assets/gearyHeist.avif';
import PMCLogo from '../../../assets/pmclogo.svg';
import type { TeamResponse } from '../../../types/Team';
import { useTeam } from '../../../hooks/useTeam';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardVerticalWrapper,
    CardsWrapper,
} from '../../../components/Deliverables/utils';
import { TimelineCard } from '../../../components/Deliverables/TimelineCard';
import { useSubmissionWindow } from '../../../hooks/useSubmissionWindow';
import SubmissionVault from './SubmissionVault';

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
        font-style: italic;
        opacity: 0.5;
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

const TeamCode = styled.span`
    font-size: 0.5em;
    font-weight: 400;
    opacity: 0.7;
`;

export default function ProductHeist() {
    const { getTeam, joinTeam, leaveTeam, createTeam } = useTeam();
    const { event_id } = useParams();
    const { user } = useUserData();
    const navigate = useNavigate();

    const [teamData, setTeamData] = useState<TeamResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const phase = useSubmissionWindow();

    const [formTeamCode, setFormTeamCode] = useState('');
    const [formTeamName, setFormTeamName] = useState('');
    const [joinError, setJoinError] = useState('');
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        const fetchTeam = async (eventId: string) => {
            try {
                const data = await getTeam(eventId);
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
    }, [event_id, getTeam]);

    const members = teamData?.Team?.Team_Member || [];
    const teamName = teamData?.Team?.team_name;
    const teamCode = teamData?.Team?.team_code;

    const handleJoinTeam = async () => {
        try {
            if (!event_id) return;

            setJoinError('');
            const data = await joinTeam(event_id, formTeamCode);
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
            const data = await createTeam(event_id, formTeamName);
            setTeamData(data);
            setFormTeamName('');
            /* eslint-disable  @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            console.log(e);
            if (e.message.endsWith('Conflict')) {
                // just gonna assume team name taken. I don't think any other error is possible really
                setCreateError('Team name unavailable!');
            } else {
                setCreateError('Unable to create team!');
            }
        }
    };

    const handleLeaveTeam = async () => {
        try {
            if (!event_id) return;

            await leaveTeam(event_id);
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
                            {teamName || 'No Team Assigned'}{' '}
                            {teamCode && <TeamCode>#{teamCode}</TeamCode>}
                        </TeamName>
                    </Header>

                    <CardsWrapper>
                        {/* Team Members Card */}
                        <CardVerticalWrapper>
                            {/* Countdown Card (do NOT center) */}
                            <TimelineCard />

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
                                            <Button
                                                onClick={handleLeaveTeam}
                                                // disabled={phase !== 'before'}
                                            >
                                                Leave
                                            </Button>
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
                            <SubmissionVault phase={phase} eventId={event_id!} />
                        </Card>
                    </CardsWrapper>
                </Content>
            </Container>
        </PageContainer>
    );
}
