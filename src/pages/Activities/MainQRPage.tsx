import { useEffect, useState } from 'react';
import './MainQrPage.css';
import EnterEmail, { RaffleFormData } from './EnterEmail';
import { useSearchParams } from 'react-router-dom';

export default function MainQRPage() {
    const [error, setError] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState(localStorage.getItem('attendee-email') || '');
    const [raffleTickets, setRaffleTickets] = useState(0);
    const [searchParams] = useSearchParams();
    const event_id = 'xUIGbhL9btd9Pn0kdda2'; // Product sprint event ID
    const qrCodeId = searchParams.get('qrid');

    const submit = (emailData: RaffleFormData) => {
        localStorage.setItem('attendee-email', emailData.email);
        setEmail(emailData.email);
        setError(false);
    };

    useEffect(() => {
        if (!email) return;

        (async () => {
            setLoading(true);
            try {
                let url = `${import.meta.env.VITE_API_URL}/api/v1/attendee/${event_id}/${email}/qr`;
                if (qrCodeId) {
                    url += `/${qrCodeId}`;
                }

                const response = await fetch(url, {
                    method: qrCodeId ? 'PUT' : 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();

                if (response.status !== 200) {
                    if (data.message !== 'You have already scanned this QR code.') {
                        setEmail('');
                        localStorage.removeItem('attendee-email');
                    }
                    throw new Error(data.message);
                }

                setRaffleTickets(data.totalPoints); // Use totalPoints from backend
                setError(false); // Reset error state on success
            } catch (err: unknown) {
                setError(true);
                setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        })();
    }, [email, qrCodeId]); // Ensure useEffect runs when email changes

    if (!email) {
        return (
            <div className="qr-page-container">
                <EnterEmail onSubmit={submit} />
            </div>
        );
    }
    if (loading) {
        return (
            <div className="qr-page-container">
                <p className="raffle-subtext">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="qr-page-container">
                <div className="error-x-container">
                    <div className="error-x-circle">
                        <div className="error-x"></div>
                    </div>
                </div>
                <p className="raffle-name"> Oooops... something went wrong! </p>
                <h3 className="raffle-name">{errorMsg}</h3>
            </div>
        );
    }

    return (
        <div className="qr-page-container">
            {qrCodeId && (
                <>
                    <div className="checkmark-container">
                        <div className="checkmark-circle">
                            <div className="checkmark-stroke"></div>
                        </div>
                    </div>
                    <p className="raffle-name"> 🎉 CONGRATULATIONS! 🎉 </p>
                </>
            )}
            <h3 className="raffle-subtext"> You have {raffleTickets} raffle tickets. </h3>
        </div>
    );
}
