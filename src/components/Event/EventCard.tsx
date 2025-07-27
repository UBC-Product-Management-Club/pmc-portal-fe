import "./EventCard.css";
import moment from "moment";
import { type EventCard } from "../../types/Event";
import { Link } from "react-router-dom";
import styled from "styled-components";

type EventCardProps = {
    event: EventCard
    disabled: boolean
};

const Container = styled.div<{disabled: boolean}>`
    width: inherit;
    max-height: 18rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 2rem;
    box-sizing: border-box;
    border-radius: 1rem;
    gap: 1rem;
    color: white;
    background-color: ${({disabled}) => (disabled ? "var(--pmc-black)" : "var(--pmc-dark-purple)")};
    opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
    @media screen and (max-width: 600px) {
        flex-direction: column-reverse;
        align-items: start;
        gap: 2rem;
    }
`

const Column = styled.div`
    max-width: 50%;
    box-sizing: border-box;
    align-self: center;
`

const EventTimeAndLocation = styled.p`
    font-style: normal;
    font-weight: 510;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    flex: none;
    order: 0;
    flex-grow: 0;
`

const EventName = styled.p`
    font-size: x-large;
    font-weight: bold;
`

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
`

const Thumbnail = styled.img`
    margin-left: 10px;
    border-radius: 13px;
    width: 15rem;
    height: 15rem;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    margin-left: 0;
    align-self: center;

    @media screen and (max-width: 768px) {
        width: 16rem;
    }
`

export function EventCard({ event, disabled }: EventCardProps) {

    const contents = (
                <Container disabled={disabled}>
                    <Column>
                        <EventTimeAndLocation>{moment(event.startTime).format("HH.mm A")} | {event.location}</EventTimeAndLocation>
                        <EventName>{event.name}</EventName>
                        <EventDescription>{event.description}</EventDescription>
                    </Column>
                    <Column>
                        <Thumbnail
                            src={event.thumbnail}
                            alt="Event thumbnail"
                        />
                    </Column>
                </Container>)

    return (
        <>
            <h2>{moment(event.date).format('MMMM D, YYYY')}</h2>
            {disabled ? contents : (
                    <Link to={`/events/${event.eventId}`} style={{ textDecoration: "none" }}>
                        {contents}
                    </Link>
                )
            }
        </>
    );
}
