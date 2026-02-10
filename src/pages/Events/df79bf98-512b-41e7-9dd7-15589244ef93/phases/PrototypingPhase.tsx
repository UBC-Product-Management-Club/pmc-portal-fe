import PhaseContent from '../components/PhaseContent';
import { PHASES } from '../types';

const prototypingPhase = PHASES.find((p) => p.id === 'prototyping')!;

export default function PrototypingPhase() {
    return <PhaseContent phase={prototypingPhase} />;
}
