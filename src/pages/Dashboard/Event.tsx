import React from 'react';
// import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventType } from '../../types/api';
// import { db } from "../../config/firebase";


const Event: React.FC = () => {
    const [event, setEvent] = useState<eventType | null>(null);
    const { event_id } = useParams<{ event_id: string }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/events/${event_id}`, {
                    method: 'GET',
                    // credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                // console.log('Origin:', process.env.ORIGIN);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: eventType = await response.json();
                setEvent({
                    ...data,
                    date: new Date(data.date),
                });
                console.log(data);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [event_id]);
    if (loading) return <p>Loading...</p>;
    if (!event) return <p>No event details available.</p>;

    return (
        <div>
            {event ? (
                <EventDetails event={event} />
            ) : (
                <p>loading event details...</p>
            )}
        </div>
    );
}




const EventDetails: React.FC<{ event: eventType }> = ({ event }) => {
    return (
        <div>
            <h1>{event.name}</h1>
            <p><strong>Date:</strong> {event.date.toDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Member Price:</strong> ${event.member_price !== undefined ? event.member_price.toFixed(2) : "N/A"}</p>
            <p><strong>Non-Member Price:</strong> ${event.non_member_price !== undefined ? event.non_member_price.toFixed(2) : "N/A"}</p>
            <p><strong>Member Only:</strong> {event.member_only ? "Yes" : "No"}</p>

            <div>
                <h2>Media</h2>
                {event.media.length > 0 ? (
                    <ul>
                        {event.media.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">Media {index + 1}</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No media available</p>
                )}
            </div>

            <div>
                <h2>Attendees</h2>
                {event && event.attendees && event.attendees.length > 0 ? (
                    <ul>
                        {event.attendees.map((attendee) => (
                            <li key={attendee.id}>{attendee.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>There are no attendees in this event...</p>
                )}
            </div>
        </div>
    );
};



export default Event;