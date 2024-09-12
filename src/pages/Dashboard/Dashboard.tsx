import "./Dashboard.css";
import { useEffect, useState } from "react";
import { eventType } from "../../types/api";
import { useAuth } from "../../providers/Auth/AuthProvider";
import { EventCard } from "../../components/Event/EventCard";

export default function Dashboard() {
  const { currentUser, userData, isSignedIn } = useAuth();
  const [allEvents, setAllEvents] = useState<eventType[]>([]);

    async function dashboardComponents() {
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
        }
    }

    useEffect(() => {
        dashboardComponents();
    }, []);

  return (
    <div className="dashboard">
      <div className={"dashboard-container"}>
        {userData && !userData.paymentVerified && (
          <p className="dashboard-top-banner">
            We've noticed you have signed up as a member, 
            but your payment is not verified. If you haven't paid, 
            please visit our <a href="https://ubc-pmc.square.site" 
            target="_blank">checkout page</a>. If you've paid already, 
            we will notify you when we've verified your payment. Your 
            account will be activated once you are verified.
          </p>
        )}
        <div className="dashboard-header">
          <h2>Upcoming Events</h2>
          <h4 className={"welcome-message"}>
            {isSignedIn
              ? `Welcome ${currentUser!.displayName}`
              : "Welcome guest"}
          </h4>
        </div>
        <p className="dashboard-main-text">
        At PMC, our mission is to empower aspiring product managers 
        by providing valuable insights, hands-on experiences, and 
        opportunities to connect with industry leaders. Check out 
        our upcoming events to support you on your product journey 
        and help you grow your skills, expand your network, and 
        explore new opportunities in the field!
        </p>
      </div>

      <div className={"dashboard-container"}>
        <div>
          {allEvents.length > 0 ? (
            allEvents.map((event) => (
              <EventCard
                key={event.event_Id}
                isSignedIn={isSignedIn}
                event={event}
                showRegister={true}
              />
            ))
          ) : (
            <p className="dashboard-staytuned">Stay tuned for future events!</p>
          )}
        </div>
      </div>
    </div>
    );
}

// MAIN PRIORITIES:
// 1. Only display member_only pop-up events in dashboard (if they don't have a non-member price, its member-only!)
// 2. fix UI of event detail page
// 3. Change header Sign in UI + functionality to end session for signing out

// CURRENt ISSUES:
// if logged in as member -> all events are clickable, but some of the cards are still overlaid
// if not logged in as non-member -> all events are not clickable, but some of the cards are overlaid (which is what we want)

// member + non-member price available = CLICKABLE
// member + !non-member price = CLICKABLE
// non member + non-member price available = CLICKABLE
// non member + !non-member price = NOT CLICKABLE

// logged in as member -> can only see the member price
// logged in as non-member -> can see both member and non-member price
