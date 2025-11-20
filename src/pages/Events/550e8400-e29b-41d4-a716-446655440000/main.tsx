import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAttendee } from '../../../hooks/useAttendee';
import gearyHeist from '../../../assets/gearyHeist.avif';
import { TeamResponse } from '../../../types/Attendee';
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
    min-height: 100vh;
    background-color: var(--pmc-dark-blue);
`;

const Content = styled.div`
    max-width: 56rem;
    margin: 0; // remove centering
    padding: 2rem 1rem;

    @media (min-width: 768px) {
        padding: 3rem 1rem;
    }
`;

const Header = styled.div`
    text-align: left;
    margin-bottom: 1.5rem;
`;

const TeamName = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: -0.025em;
    color: #ffffff;

    @media (min-width: 768px) {
        font-size: 2rem;
    }
`;

const Card = styled.div`
    border: 1px solid rgba(141, 155, 235, 0.2);
    border-radius: 0.75rem;
    background-color: var(--pmc-midnight-blue);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
`;

const CardHeader = styled.div`
    padding: 1.25rem 1.5rem;
    padding-bottom: 0.75rem;
`;

const CardTitle = styled.h2`
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
`;

const CardContent = styled.div`
    padding: 0 1.5rem 1.25rem;
`;

const MemberList = styled.div`
    border-top: 1px solid rgba(141, 155, 235, 0.15);
`;

const MemberItem = styled.div<{ $isFirst: boolean }>`
    padding: 0.75rem 0;
    padding-top: ${({ $isFirst }) => ($isFirst ? '0' : '0.75rem')};
    border-bottom: 1px solid rgba(141, 155, 235, 0.15);
    transition: background-color 0.3s ease;

    &:last-child {
        border-bottom: none;
    }
`;

const MemberContent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const Avatar = styled.div`
    height: 3rem;
    width: 3rem;
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
    margin-top: -0.5rem; // move it slightly upward
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--pmc-dark-blue);
`;

const LoadingContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
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
`;

export default function ProductHeist() {
    const attendeeService = useAttendee();
    const [teamData, setTeamData] = useState<TeamResponse>();

    useEffect(() => {
        const fetchTeam = async () => {
            const data = await attendeeService.getTeammates('550e8400-e29b-41d4-a716-446655440000');
            setTeamData(data);
        };
        fetchTeam();
    }, [attendeeService]);

    if (!teamData || !teamData.Team) {
        return (
            <LoadingContainer>
                <LoadingContent>
                    <Spinner />
                    <LoadingText>Loading team...</LoadingText>
                </LoadingContent>
            </LoadingContainer>
        );
    }

    const members = teamData.Team.Team_Member;
    const teamName = teamData.Team.team_name;

    return (
        <Container>
            <Content>
                {/* Header Section */}
                <Header>
                    <TeamName>{teamName}</TeamName>
                </Header>

                {/* Team Members Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Accomplices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MemberList>
                            {members.map((member, index: number) => {
                                const user = member.Attendee.User;

                                return (
                                    <MemberItem key={member.attendee_id} $isFirst={index === 0}>
                                        <MemberContent>
                                            {/* Avatar */}
                                            <Avatar>
                                                <AvatarImage
                                                    src={gearyHeist}
                                                    alt={`${user.first_name} ${user.last_name}`}
                                                />
                                            </Avatar>

                                            {/* User Info */}
                                            <UserInfo>
                                                <UserName>
                                                    {user.first_name} {user.last_name}
                                                </UserName>
                                                <UserEmail>{user.email}</UserEmail>
                                            </UserInfo>
                                        </MemberContent>
                                    </MemberItem>
                                );
                            })}
                        </MemberList>
                    </CardContent>
                </Card>
            </Content>
        </Container>
    );
}
