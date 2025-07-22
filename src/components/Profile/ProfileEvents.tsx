
export default function ProfileEvents() {
//   const { user } = useUserData()
//   const [isLoading, setIsLoading] = useState(true);
//   const [events, setEvents] = useState<EventCardType[]>([]);

//   useEffect(() => {
//     if (isLoading && user) {
//       const fetchEvent = async (eventId: string): Promise<eventType> => {
//         const eventResponse = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!eventResponse.ok) {
//           throw new Error(`Failed to fetch details for event ID: ${eventId}`);
//         }

//         return eventResponse.json();
//       };

//       const fetchEvents = async () => {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/v1/profile/${user?.id}/events`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const json = await response.json();
//         const eventIds: string[] = json.events;

//         const eventDetailsPromises = eventIds.map((eventId) =>
//           fetchEvent(eventId)
//         );
//         const eventsData: eventType[] = await Promise.all(eventDetailsPromises);

//         setEvents(eventsData); // This ensures setEvents is called with a proper EventType[] array
//       };

//       try {
//         fetchEvents();
//       } catch (e) {
//         console.error("Failed to retrieve registered events: ", e);
//       }
//       setIsLoading(false);
//     }
//   }, [user, isLoading]);

  return (
    <div>
      <h3>Events Registered</h3>
      {/* {!isLoading && events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            disabled={true}
          />
        ))
      ) : (
        <p style={{ color: "white" }}>No events found.</p>
      )} */}
    </div>
  );
}
