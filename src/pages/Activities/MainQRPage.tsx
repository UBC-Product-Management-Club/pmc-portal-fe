import { useEffect, useState } from 'react';
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
    const containerClass = 'flex w-[90vw] max-w-[64vw] flex-col items-center gap-4';
    const raffleNameClass =
        'text-center text-xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#DCE1FF_0%,#DDD7FF_23%,#DDD2FF_59%,#8D9BEB_87%)]';
    const raffleSubtextClass = 'text-center text-white';
    const checkmarkContainerClass = 'flex h-[100px] w-[100px] items-center justify-center mb-4';
    const checkmarkCircleClass =
        'flex h-[80px] w-[80px] items-center justify-center rounded-full border-[5px] border-[#4CAF50] opacity-0 animate-[drawCircle_0.5s_ease-out_forwards]';
    const checkmarkStrokeClass =
        'h-[40px] w-[20px] rotate-45 border-b-[5px] border-r-[5px] border-[#4CAF50] opacity-0 animate-[drawCheck_0.3s_ease-out_0.5s_forwards]';
    const errorContainerClass = 'flex h-[100px] w-[100px] items-center justify-center mb-4';
    const errorCircleClass =
        'relative flex h-[80px] w-[80px] items-center justify-center rounded-full border-[5px] border-red-500 opacity-0 animate-[drawCircle_0.5s_ease-out_forwards]';
    const errorXClass = 'relative h-[50px] w-[50px]';
    const errorLineClass =
        'absolute left-0 top-1/2 h-[5px] w-[50px] origin-center bg-red-500 opacity-0 animate-[drawX_0.3s_ease-out_0.5s_forwards]';

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
            <div className={containerClass}>
                <EnterEmail onSubmit={submit} />
            </div>
        );
    }
    if (loading) {
        return (
            <div className={containerClass}>
                <p className={raffleSubtextClass}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={containerClass}>
                <div className={errorContainerClass}>
                    <div className={errorCircleClass}>
                        <div className={errorXClass}>
                            <div className={`${errorLineClass} rotate-45 scale-0`} />
                            <div className={`${errorLineClass} -rotate-45 scale-0`} />
                        </div>
                    </div>
                </div>
                <p className={raffleNameClass}> Oooops... something went wrong! </p>
                <h3 className={raffleNameClass}>{errorMsg}</h3>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            {qrCodeId && (
                <>
                    <div className={checkmarkContainerClass}>
                        <div className={checkmarkCircleClass}>
                            <div className={checkmarkStrokeClass}></div>
                        </div>
                    </div>
                    <p className={raffleNameClass}> 🎉 CONGRATULATIONS! 🎉 </p>
                </>
            )}
            <h3 className={raffleSubtextClass}> You have {raffleTickets} raffle tickets. </h3>
        </div>
    );
}
