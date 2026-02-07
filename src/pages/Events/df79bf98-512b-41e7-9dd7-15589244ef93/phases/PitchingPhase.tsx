import PhaseContent from '../components/PhaseContent';
import { PHASES } from '../types';

const pitchingPhase = PHASES.find((p) => p.id === 'pitching')!;

export default function PitchingPhase() {
    return <PhaseContent phase={pitchingPhase} />;
}
