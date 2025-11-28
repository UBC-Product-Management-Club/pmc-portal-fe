import { memo } from 'react';
import { Phase } from '../../../hooks/useSubmissionWindow';
import { DeliverablesSection } from '../../../components/Deliverables/DeliverablesSection';
import { CardContent, CountdownText } from '../../../components/Deliverables/utils';
import gearyHeist from '../../../assets/gearyHeist.avif';
import { styled } from 'styled-components';

interface SubmissionVaultProps {
    phase: Phase;
    eventId: string;
}

const VaultImage = styled.img`
    width: 180px;
    height: 180px;
    object-fit: cover;
    filter: grayscale(75%) brightness(85%);
    opacity: 0.6;
    margin-bottom: 1rem;
    border-radius: 12px;
`;

const LockedTitle = styled.h2`
    color: #ffffff;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
`;

const LockedSubtitle = styled.p`
    color: var(--pmc-light-grey);
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
`;

const LockedDate = styled.div`
    color: #8d9beb;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.5rem;
`;

function SubmissionVault({ phase, eventId }: SubmissionVaultProps) {
    if (phase === 'before') {
        return (
            <CardContent center>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <VaultImage src={gearyHeist} alt="Vault Locked" />

                    <LockedTitle>🗝️ SUBMISSION VAULT OPENS SOON 🗝️</LockedTitle>
                    <LockedSubtitle>
                        The vault is sealed until the heist begins. Get your crew ready...
                    </LockedSubtitle>

                    <CountdownText>Deliverables will be open until:</CountdownText>
                    <LockedDate>November 30, 2025 — 12:00 PM PST</LockedDate>
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
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <VaultImage src={gearyHeist} alt="Vault Locked" />

                <LockedTitle>🗝️ SUBMISSION VAULT CLOSED 🗝️</LockedTitle>
                <LockedSubtitle>
                    All files have been secured in the vault. Submissions are now closed.
                </LockedSubtitle>

                <CountdownText>Deliverables were due:</CountdownText>
                <LockedDate>November 30, 2025 — 12:00 PM PST</LockedDate>
            </div>
        </CardContent>
    );
}

export default memo(SubmissionVault);
