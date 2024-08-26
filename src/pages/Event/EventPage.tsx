import {useParams} from "react-router-dom";
import {eventBody} from "../../types/api";
import {useEffect, useState} from "react";
import EventComponent from "../../components/Event/EventComponent";

export default function EventPage() {
    // Check if logged in or continued as non-member
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState<eventBody>();

    useEffect(() => {
        const getEventDetails = async () => {
            const eventResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                }
            });
            setEventDetails(await eventResponse.json());
        }

        getEventDetails()
            .catch(console.error);
    }, []);

    return (
        eventDetails
            ? <EventComponent
                media={eventDetails.media}
                name={eventDetails.name}
                date={eventDetails.date}
                location={eventDetails.location}
                price={eventDetails.member_price}
                description={eventDetails.description}
            />
            : <div>
                <h1>Event not found</h1>
            </div>
    )
}