import "../AllUsers/AllUsers.css";
import { useEffect, useState } from "react";
import { FaSync, FaFileDownload, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

export default function AttendeeList() {
    const [attendees, setAttendees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { event_id } = useParams();
    const navigate = useNavigate();

    const fetchAttendees = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/attendee/${event_id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            setAttendees(data);
        } catch (error) {
            console.log("Error fetching attendees.");
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = getAllUniqueHeaders();
        
        const csvData = attendees.map((attendee: any) => 
            headers.map(header => {
                const value = attendee[header];
                // If value is undefined or null, return empty string
                if (value === undefined || value === null) {
                    return '';
                }
                // Handle arrays
                if (Array.isArray(value)) {
                    return `"${value.join('; ')}"`;
                }
                // For non-array values, wrap in quotes if they contain commas or quotes
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
        );
        
        // Create CSV content
        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendees-${event_id}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getAllUniqueHeaders = () => {
        const uniqueHeaders = new Set();
        attendees.forEach(attendee => {
            Object.keys(attendee)
                .filter(key => 
                    typeof attendee[key] !== 'function' &&
                    !['attendee_Id', 'is_member', 'member_Id', 'event_Id', 'paymentVerified', 'exists', 'onboarded'].includes(key)
                )
                .forEach(key => uniqueHeaders.add(key));
        });
        return Array.from(uniqueHeaders) as string[];
    };

    useEffect(() => {
        fetchAttendees();
    }, []);

    return (
        <div>
            <div 
                onClick={() => navigate('/admin/events')}
                style={{ 
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                <FaArrowLeft size={20} />
            </div>
            <div className="header-section">
                <div className="header-group">
                    <h1>Attendee List</h1>
                    <FaSync
                        className={`refresh-icon ${isLoading ? "spinning" : ""}`}
                        onClick={() => !isLoading && fetchAttendees()}
                        size={20}
                        style={{
                            cursor: isLoading ? "default" : "pointer",
                            color: "#666",
                        }}
                    />
                    <FaFileDownload
                        onClick={exportToCSV}
                        size={20}
                        style={{
                            cursor: "pointer",
                            color: "#666",
                            marginLeft: "10px"
                        }}
                    />
                </div>
                <div>Total attendees: {attendees.length}</div>
            </div>

            <div className="users-table" style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 'max-content' }}>
                    <div className="table-header" style={{
                        display: 'grid',
                        gridTemplateColumns: attendees.length ? 
                            `repeat(${getAllUniqueHeaders().length}, 200px)` : 'none'
                    }}>
                        {attendees.length > 0 && getAllUniqueHeaders().map(header => (
                            <div key={header} className="header-cell">
                                {header.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </div>
                        ))}
                    </div>

                    <div className="table-body">
                        {attendees.map((attendee: any) => (
                            <div key={attendee.id} className="table-row" style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${getAllUniqueHeaders().length}, 200px)`
                            }}>
                                {getAllUniqueHeaders().map(header => (
                                    <div key={header} className="table-cell">
                                        {attendee[header] !== undefined
                                            ? (Array.isArray(attendee[header])
                                                ? attendee[header].join(', ')
                                                : attendee[header])
                                            : ''}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
