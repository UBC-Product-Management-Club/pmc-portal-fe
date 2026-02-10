export type PhaseStatus = 'locked' | 'active' | 'completed';
export type PhaseId = 'discovery' | 'planning' | 'prototyping' | 'pitching';

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
}

export interface Deliverable {
    id: string;
    title: string;
    required: boolean;
}

export interface Resource {
    id: string;
    title: string;
    link: string;
    type: 'slides' | 'template' | 'material';
}

export interface Phase {
    id: PhaseId;
    name: string;
    description: string;
    color: string;
    glowColor: string;
    startDate: Date;
    endDate: Date;
    tasks: Task[];
    deliverables: Deliverable[];
    resources: Resource[];
}

export interface SubmittedFile {
    deliverableId: string;
    fileName: string;
}

export interface Submission {
    submittedAt: Date;
    files: SubmittedFile[];
}

// Map phase IDs to deliverable flag IDs from the backend
// Update these IDs to match your database flag IDs
export const PHASE_FLAG_MAP: Record<PhaseId, string> = {
    discovery: '64847f5c-1d1c-45b1-a185-4688abeaa42f', // Replace with actual flag ID
    planning: '3cbcf89e-e3a4-47a8-84d8-0fea6c0b5b5d', // Replace with actual flag ID
    prototyping: '5a544940-c2ca-4c56-9c2e-8afce5c3adb4', // Replace with actual flag ID
    pitching: 'fdb89c71-9e8a-45ba-b8db-1a9d84be1d5b', // Replace with actual flag ID
};

// Phase configuration with dates
export const PHASES: Phase[] = [
    {
        id: 'discovery',
        name: 'Discovery',
        description:
            'Research your market, understand your users, and identify the problem worth solving.',
        color: '#00D4FF',
        glowColor: 'rgba(0, 212, 255, 0.3)',
        startDate: new Date(2026, 2, 1), // Mar 1
        endDate: new Date(2026, 2, 3, 23, 59, 59), // Mar 3
        tasks: [
            { id: 'd1', title: 'Define your target user persona', completed: false },
            { id: 'd2', title: 'Conduct user research interviews (min 3)', completed: false },
            { id: 'd3', title: 'Identify key pain points and opportunities', completed: false },
            { id: 'd4', title: 'Analyze competitive landscape', completed: false },
        ],
        deliverables: [
            { id: 'dd1', title: 'User Research Summary', required: true },
            { id: 'dd2', title: 'Competitive Analysis Document', required: true },
        ],
        resources: [
            { id: 'dr1', title: 'Discovery Workshop Slides', link: '#', type: 'slides' },
            { id: 'dr2', title: 'User Interview Template', link: '#', type: 'template' },
            { id: 'dr3', title: 'Competitive Analysis Framework', link: '#', type: 'template' },
        ],
    },
    {
        id: 'planning',
        name: 'Product Planning',
        description: 'Define your product vision, prioritize features, and create a roadmap.',
        color: '#FF8C00',
        glowColor: 'rgba(255, 140, 0, 0.3)',
        startDate: new Date(2026, 2, 4), // Mar 4
        endDate: new Date(2026, 2, 7, 23, 59, 59), // Mar 7
        tasks: [
            { id: 'p1', title: 'Write product vision statement', completed: false },
            { id: 'p2', title: 'Create user stories for MVP features', completed: false },
            { id: 'p3', title: 'Prioritize features using MoSCoW method', completed: false },
            { id: 'p4', title: 'Define success metrics and KPIs', completed: false },
        ],
        deliverables: [
            { id: 'pd1', title: 'Product Requirements Document (PRD)', required: true },
            { id: 'pd2', title: 'Feature Prioritization Matrix', required: true },
        ],
        resources: [
            { id: 'pr1', title: 'Product Planning Workshop Slides', link: '#', type: 'slides' },
            { id: 'pr2', title: 'PRD Template', link: '#', type: 'template' },
            { id: 'pr3', title: 'User Story Writing Guide', link: '#', type: 'material' },
        ],
    },
    {
        id: 'prototyping',
        name: 'Prototyping',
        description: 'Design and build a functional prototype of your product.',
        color: '#A855F7',
        glowColor: 'rgba(168, 85, 247, 0.3)',
        startDate: new Date(2026, 2, 8), // Mar 8
        endDate: new Date(2026, 2, 10, 23, 59, 59), // Mar 10
        tasks: [
            { id: 'pt1', title: 'Create low-fidelity wireframes', completed: false },
            { id: 'pt2', title: 'Design high-fidelity mockups', completed: false },
            { id: 'pt3', title: 'Build interactive prototype', completed: false },
            { id: 'pt4', title: 'Conduct usability testing', completed: false },
        ],
        deliverables: [
            { id: 'ptd1', title: 'Figma Prototype Link', required: true },
            { id: 'ptd2', title: 'Usability Testing Report', required: false },
        ],
        resources: [
            { id: 'ptr1', title: 'Prototyping Workshop Slides', link: '#', type: 'slides' },
            { id: 'ptr2', title: 'Figma Design System Template', link: '#', type: 'template' },
            { id: 'ptr3', title: 'Usability Testing Guide', link: '#', type: 'material' },
        ],
    },
    {
        id: 'pitching',
        name: 'Pitching',
        description: 'Craft your story and present your product to the judges.',
        color: '#EC4899',
        glowColor: 'rgba(236, 72, 153, 0.3)',
        startDate: new Date(2026, 2, 11), // Mar 11
        endDate: new Date(2026, 2, 14, 23, 59, 59), // Mar 14
        tasks: [
            { id: 'pi1', title: 'Create pitch deck (max 10 slides)', completed: false },
            { id: 'pi2', title: 'Prepare product demo', completed: false },
            { id: 'pi3', title: 'Practice pitch presentation', completed: false },
            { id: 'pi4', title: 'Prepare for Q&A session', completed: false },
        ],
        deliverables: [
            { id: 'pid1', title: 'Pitch Deck (PDF)', required: true },
            { id: 'pid2', title: 'Demo Video (optional)', required: false },
        ],
        resources: [
            { id: 'pir1', title: 'Pitching Workshop Slides', link: '#', type: 'slides' },
            { id: 'pir2', title: 'Pitch Deck Template', link: '#', type: 'template' },
            { id: 'pir3', title: 'Storytelling Framework', link: '#', type: 'material' },
        ],
    },
];

// Helper functions
export function getPhaseStatus(phase: Phase, now: Date = new Date()): PhaseStatus {
    if (now < phase.startDate) return 'locked';
    if (now > phase.endDate) return 'completed';
    return 'active';
}

export function getResourceIcon(type: Resource['type']): string {
    switch (type) {
        case 'slides':
            return '📊';
        case 'template':
            return '📋';
        case 'material':
            return '📚';
        default:
            return '📄';
    }
}

export function formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDateRange(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
