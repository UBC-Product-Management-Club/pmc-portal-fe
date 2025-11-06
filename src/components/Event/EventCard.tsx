import './EventCard.css';
import { type EventCard } from '../../types/Event';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderDate, renderTime, useInAppBrowser } from '../../utils';
import ReactMarkdown from 'react-markdown';

type EventCardProps = {
    event: EventCard;
    disabled: boolean;
    link: string;
};

const Content = styled.div<{ disabled: boolean }>`
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

    @media screen and (max-width: 768px) {
        justify-content: space-evenly;
        height: 500px;
        padding: 1rem 0;
        flex-direction: column-reverse;
        align-items: start;
    }
`;

const Group = styled.div`
    width: 80%;
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

const Thumbnail = styled.img`
    width: 15rem;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 13px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    align-self: center;

    @media screen and (max-width: 768px) {
        width: 17rem;
    }
`;

export function EventCard({ event, disabled, link }: EventCardProps) {
    const { isMobile } = useInAppBrowser();
    const contents = (
        <Content disabled={disabled}>
            <Group>
                <EventTimeAndLocation>
                    {renderTime(event.startTime, event.endTime)} | {event.location}
                </EventTimeAndLocation>
                <EventName>{event.name}</EventName>
                {!isMobile && <ReactMarkdown>{event.blurb}</ReactMarkdown>}
            </Group>
            <Thumbnail src={event.thumbnail} alt="Event thumbnail" />
        </Content>
    );
    const isExternal = link.startsWith('https://');
    const navigateTo = isExternal ? (
        <a href={link} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            {contents}
        </a>
    ) : (
        <Link to={link} style={{ textDecoration: 'none' }}>
            {contents}
        </Link>
    );

    return (
        <>
            <h3>{renderDate(event.startTime, event.endTime)}</h3>
            {disabled ? contents : navigateTo}
        </>
    );
}
