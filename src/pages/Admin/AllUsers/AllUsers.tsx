import { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';

export default function AllUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const headerClass = 'flex items-center justify-between gap-4 text-white';
    const headerGroupClass = 'flex items-center gap-4';
    const tableClass = 'w-full overflow-hidden rounded border border-[#ddd] text-white';
    const headerRowClass =
        'grid grid-cols-[2fr_1fr_1fr_2fr] border-b-2 border-[#ddd] bg-[#f5f5f5] font-bold';
    const rowClass = 'grid grid-cols-[2fr_1fr_1fr_2fr] border-b border-[#ddd]';
    const cellClass = 'break-words px-4 py-3 text-left';
    const bodyClass = 'max-h-[600px] overflow-y-auto';

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
            <div className={headerClass}>
                <div className={headerGroupClass}>
                    <h1>All Users</h1>
                    <FaSync
                        className={`${isLoading ? 'animate-spin' : ''} text-[#666]`}
                        onClick={() => !isLoading && fetchAllUsers()}
                        size={20}
                        style={{
                            cursor: isLoading ? 'default' : 'pointer',
                        }}
                    />
                </div>
                <div>Total member count: {allUsers.length}</div>
            </div>

            <div className={tableClass}>
                <div className={headerRowClass}>
                    <div className={cellClass}>Display Name</div>
                    <div className={cellClass}>First Name</div>
                    <div className={cellClass}>Last Name</div>
                    <div className={cellClass}>Email</div>
                </div>

                <div className={bodyClass}>
                    {allUsers.map(
                        (user: {
                            id: string;
                            displayName: string;
                            first_name: string;
                            last_name: string;
                            email: string;
                        }) => (
                            <div key={user.id} className={rowClass}>
                                <div className={cellClass}>{user.displayName}</div>
                                <div className={cellClass}>{user.first_name}</div>
                                <div className={cellClass}>{user.last_name}</div>
                                <div className={cellClass}>{user.email}</div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
