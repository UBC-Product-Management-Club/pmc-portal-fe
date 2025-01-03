import { useEffect, useState } from 'react';
import { eventType } from '../../../types/api';
import { EventCard } from '../../../components/Event/EventCard';
import { useNavigate } from 'react-router-dom';
const AllEvents = () => {
  const [allEvents, setAllEvents] = useState<eventType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/events/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Fetching all events was not ok");
        }

        const allEvents = await response.json();
        setAllEvents(allEvents);
    } catch (error) {
        console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h1 style={{color: 'white'}}>All Events</h1>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {allEvents.map((event) => (
            <EventCard 
              key={event.event_Id}
              event={event}
              isSignedIn={true}
              showRegister={true}
              handleClick={() => {
                navigateTo(`/admin/events/${event.event_Id}/attendees`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
