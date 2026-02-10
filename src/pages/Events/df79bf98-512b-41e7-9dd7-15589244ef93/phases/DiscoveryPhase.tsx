import PhaseContent from '../components/PhaseContent';
import { PHASES } from '../types';

const discoveryPhase = PHASES.find((p) => p.id === 'discovery')!;

export default function DiscoveryPhase() {
    return <PhaseContent phase={discoveryPhase} />;
}
