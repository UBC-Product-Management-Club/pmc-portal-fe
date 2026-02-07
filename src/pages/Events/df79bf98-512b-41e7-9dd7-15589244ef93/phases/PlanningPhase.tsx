import PhaseContent from '../components/PhaseContent';
import { PHASES } from '../types';

const planningPhase = PHASES.find((p) => p.id === 'planning')!;

export default function PlanningPhase() {
    return <PhaseContent phase={planningPhase} />;
}
