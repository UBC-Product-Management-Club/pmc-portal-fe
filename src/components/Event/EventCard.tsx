import './EventCard.css';
import moment from 'moment';
import { type EventCard } from '../../types/Event';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type EventCardProps = {
    event: EventCard;
    disabled: boolean;
    isEventDashboard: boolean;
};

const Container = styled.div<{ disabled: boolean }>`
    width: inherit;
    display: flex;
    height: 280px;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 2rem;
    box-sizing: border-box;
    border-radius: 1rem;
    gap: 1rem;
    color: white;
    background-color: ${({ disabled }) =>
        disabled ? 'var(--pmc-black)' : 'var(--pmc-dark-purple)'};
    opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
    overflow: hidden;

    @media screen and (max-width: 600px) {
        flex-direction: column-reverse;
        align-items: start;
        gap: 2rem;
    }
`;

const Column = styled.div`
    max-width: 50%;
    box-sizing: border-box;
    align-self: center;
`;

const EventTimeAndLocation = styled.p`
    font-style: normal;
    font-weight: 510;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

const EventName = styled.p`
    font-size: x-large;
    font-weight: bold;
`;

const EventDescription = styled.p`
    word-wrap: break-word;
    height: 4.5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    box-sizing: border-box;
    text-overflow: ellipsis;
`;

const Thumbnail = styled.img`
    width: 100%;
    max-width: 15rem;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 13px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    align-self: center;

    @media screen and (max-width: 768px) {
        max-width: 100%;
    }
`;

export function EventCard({ event, disabled, isEventDashboard }: EventCardProps) {
    const contents = (
        <Container disabled={disabled}>
            <Column>
                <EventTimeAndLocation>
                    {moment(event.startTime).format('HH.mm A')} | {event.location}
                </EventTimeAndLocation>
                <EventName>{event.name}</EventName>
                <EventDescription>{event.description}</EventDescription>
            </Column>
            <Column>
                <Thumbnail src={event.thumbnail} alt="Event thumbnail" />
            </Column>
        </Container>
    );

    return (
        <>
            <h3>{moment(event.date).format('MMMM D, YYYY')}</h3>
            {disabled ? (
                contents
            ) : isEventDashboard ? (
                <Link to={`/events/${event.eventId}`} style={{ textDecoration: 'none' }}>
                    {contents}
                </Link>
            ) : (
                <Link to={`/events/${event.eventId}/register`} style={{ textDecoration: 'none' }}>
                    {contents}
                </Link>
            )}
        </>
    );
}
