import './AllUsers.css';
import { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';

export default function AllUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setAllUsers(data);
        } catch {
            console.log('Error fetching all users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div>
            <div className="header-section">
                <div className="header-group">
                    <h1>All Users</h1>
                    <FaSync
                        className={`refresh-icon ${isLoading ? 'spinning' : ''}`}
                        onClick={() => !isLoading && fetchAllUsers()}
                        size={20}
                        style={{
                            cursor: isLoading ? 'default' : 'pointer',
                            color: '#666',
                        }}
                    />
                </div>
                <div>Total member count: {allUsers.length}</div>
            </div>

            <div className="users-table">
                <div className="table-header">
                    <div className="header-cell">Display Name</div>
                    <div className="header-cell">First Name</div>
                    <div className="header-cell">Last Name</div>
                    <div className="header-cell">Email</div>
                </div>

                <div className="table-body">
                    {allUsers.map(
                        (user: {
                            id: string;
                            displayName: string;
                            first_name: string;
                            last_name: string;
                            email: string;
                        }) => (
                            <div key={user.id} className="table-row">
                                <div className="table-cell">{user.displayName}</div>
                                <div className="table-cell">{user.first_name}</div>
                                <div className="table-cell">{user.last_name}</div>
                                <div className="table-cell">{user.email}</div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
