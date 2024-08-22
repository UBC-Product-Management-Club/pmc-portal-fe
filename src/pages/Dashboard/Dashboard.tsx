// import React from 'react';
// import ReactDOM from 'react-dom/client'

import "./Dashboard.css"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventType } from '../../types/api';


export default function Dashboard() {
    // Check if logged in or continued as non-member
    const [allEvents, setAllEvents] = useState<eventType[]>([]);
    const navigateTo = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberId, setMemberId] = useState<string | undefined>(undefined);
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const [welcomeMessage, setWelcomeMessage] = useState<string>('Welcome guest');

    function checkMember() {
        try {
            const loggedIn = localStorage.getItem('member_id') !== null;
            const id = localStorage.getItem('member_id') ?? undefined;
            const displayName = localStorage.getItem('member_name') ?? "guest";

            setIsLoggedIn(loggedIn);
            setMemberId(id);
            setDisplayName(displayName);

            const message = loggedIn ? `Welcome ${displayName}` : "Welcome guest";
            setWelcomeMessage(message);
        } catch (error) {
            console.error('Error checking user status (member/nonmember): ', error);
        }
    }
    async function dashboardComponents() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Fetching all events was not ok');
            }

            const allEvents = await response.json();
            setAllEvents(allEvents);

        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    }

    useEffect(() => {
        checkMember();
        dashboardComponents();
    }, []);

    return (
        <div className="background-dashboard">
            <div>
                <div className="header">
                    <div className="header-icon">
                        <a href="/"><img src="./src/assets/pmc_logo.svg" className="logo" ></img></a>
                    </div>
                    <nav className="header-nav">
                        <a href="#upcoming-events" className="header-link">Events</a>
                        <div>
                            {isLoggedIn ? (
                                <a href="/profile" className="header-link">Profile</a>
                            ) : (
                                <a href="/" className="header-link">Profile</a>
                            )}
                        </div>
                        {/* <a href="/" className="header-link">Profile</a> */}
                    </nav>
                </div>
            </div>

            <div id="upcoming-events">
                <h2 className="upcoming-events">Upcoming Events</h2>
            </div>
            <div className="welcome-message">
                <h3>{welcomeMessage}</h3>
            </div>
            <div className="events-container">
                <div className="card">
                    <div>
                        {allEvents.length > 0 ? (
                            allEvents.map(event => (
                                <div key={event.event_Id}>
                                    <div className="event-date">
                                        <h2>{new Date(event.date).toDateString()}</h2>
                                    </div>

                                    <div className="event">
                                        <h2>{event.name}</h2>
                                        <p>{event.description}</p>
                                        <img src={event.media[0]} alt="Event" className="event-image"></img>
                                        <button className="event-button" onClick={() => navigateTo(`/events/${event.event_Id}`)}>
                                            Register
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}


// MAIN PRIORITIES:
// 1. call Event page - DONE
// display Event page's details - DONE
// have a 'register' button - DONE
// 2. At CSS, button to hover to Events section + profile - DONE
// 3. Set persistance - check if logged in or continued as non-member
// 4. When clicked 'register':
//      if member, add member_id into eventDetails page (and do not display it in public!)
//      if non-member, ...? -- if there's no member_id, non-member price display