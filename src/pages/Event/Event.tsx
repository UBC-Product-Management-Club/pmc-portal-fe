import {useParams} from "react-router-dom";
import {eventBody} from "../../types/api";
import {useEffect, useState} from "react";

export default function Event() {
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
            ? <div>
                <div>
                    {eventDetails.media.map(e =>
                        <img src={e}/>)}
                </div>
                <h1>{eventDetails.name}</h1>
                <p>{eventDetails.date.toLocaleString()}</p>
                <p>{eventDetails.location}</p>
                <p>{eventDetails.member_price}</p>
                <button>Sign up</button>
                <h2>About the event</h2>
                <p>{eventDetails.description}</p>
            </div>
            : <div>
                <h1>Event not found</h1>
            </div>
    )
}