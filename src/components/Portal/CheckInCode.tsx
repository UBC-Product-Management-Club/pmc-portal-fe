import { QRCodeSVG } from 'qrcode.react';

// The member's code for checking in at any PMC event. It encodes User.user_id, which
// the check-in app (qr-check-in) looks up against the event's attendee list, so the
// same code works for every event the member is registered for.
export function CheckInCode({ userId }: { userId: string }) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-xl leading-7 font-medium">Your check-in code</h2>
            <div className="glass glass-soft flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-6">
                {/* Dark on white with a margin, so scanners read it on any background */}
                <div className="rounded-[10px] bg-white p-3">
                    <QRCodeSVG
                        value={userId}
                        size={180}
                        marginSize={1}
                        level="M"
                        title="Your check-in QR code"
                    />
                </div>
                <p className="text-center text-lg leading-snug sm:text-left">
                    Show this at check-in for any PMC event you're registered for.
                </p>
            </div>
        </section>
    );
}
