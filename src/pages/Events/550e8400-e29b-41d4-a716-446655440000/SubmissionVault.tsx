import { memo } from 'react';
import { Phase } from '../../../hooks/useSubmissionWindow';
import { DeliverablesSection } from '../../../components/Deliverables/DeliverablesSection';
import { CardContent, CountdownText } from '../../../components/Deliverables/utils';
import gearyHeist from '../../../assets/gearyHeist.avif';

interface SubmissionVaultProps {
    phase: Phase;
    eventId: string;
}

function SubmissionVault({ phase, eventId }: SubmissionVaultProps) {
    const imageClass =
        'mb-4 h-[180px] w-[180px] rounded-xl object-cover opacity-60 [filter:grayscale(75%)_brightness(85%)]';
    const titleClass = 'mb-2 text-xl font-bold tracking-[0.5px] text-white';
    const subtitleClass = 'mb-5 text-sm text-pmc-light-grey';
    const dateClass = 'mt-2 text-base font-semibold text-[#8d9beb]';
    const messageClass = 'mx-auto max-w-[400px] text-center';
    if (phase === 'before') {
        return (
            <CardContent center>
                <div className={messageClass}>
                    <img className={imageClass} src={gearyHeist} alt="Vault Locked" />

                    <h2 className={titleClass}>🗝️ SUBMISSION VAULT OPENS SOON 🗝️</h2>
                    <p className={subtitleClass}>
                        The vault is sealed until the heist begins. Get your crew ready...
                    </p>

                    <CountdownText>Deliverables will be open until:</CountdownText>
                    <div className={dateClass}>November 30, 2025 — 12:00 PM PST</div>
                </div>
            </CardContent>
        );
    }

    if (phase === 'during') {
        return (
            <CardContent>
                <DeliverablesSection eventId={eventId} />
            </CardContent>
        );
    }

    return (
        <CardContent center>
            <div className={messageClass}>
                <img className={imageClass} src={gearyHeist} alt="Vault Locked" />

                <h2 className={titleClass}>🗝️ SUBMISSION VAULT CLOSED 🗝️</h2>
                <p className={subtitleClass}>
                    All files have been secured in the vault. Submissions are now closed.
                </p>

                <CountdownText>Deliverables were due:</CountdownText>
                <div className={dateClass}>November 30, 2025 — 12:00 PM PST</div>
            </div>
        </CardContent>
    );
}

export default memo(SubmissionVault);
