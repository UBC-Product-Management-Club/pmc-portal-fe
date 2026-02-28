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
    due?: string;
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
    discovery: '64847f5c-1d1c-45b1-a185-4688abeaa42f',
    planning: '3cbcf89e-e3a4-47a8-84d8-0fea6c0b5b5d',
    prototyping: '5a544940-c2ca-4c56-9c2e-8afce5c3adb4',
    pitching: 'fdb89c71-9e8a-45ba-b8db-1a9d84be1d5b',
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
        endDate: new Date(2026, 2, 4, 23, 59, 59), // Mar 4
        tasks: [
            { id: 'd1', title: 'Define target user', completed: false },
            { id: 'd2', title: 'Define the problem', completed: false },
            { id: 'd3', title: 'Conduct primary research', completed: false },
            { id: 'd4', title: 'Explore different user research methods', completed: false },
            { id: 'd5', title: 'Identify competitors', completed: false },
            { id: 'd6', title: 'Draft User Insights One-Pager deliverable', completed: false },
            { id: 'd7', title: 'Schedule a meeting with your mentor this week', completed: false },
        ],
        deliverables: [
            {
                id: 'dd1',
                title: 'Draft User Insights One-Pager (PDF)',
                required: true,
                due: 'Mar 4, 11:59PM PST',
            },
        ],
        resources: [
            {
                id: 'dr1',
                title: 'User Insights One-Pager Template',
                link: 'https://docs.google.com/document/d/10kyrSEyViMPFkP6jgOU9lj02rzGRsIxUg1v9AvZfjq0/edit?tab=t.0',
                type: 'template',
            },
            {
                id: 'dr2',
                title: 'Judging Rubric',
                link: 'https://docs.google.com/document/d/1gmN9fDvHBbjMZ83xcKHdM8JLKdxp96YHmhqR0gaY69s/edit?tab=t.0',
                type: 'material',
            },
        ],
    },
    {
        id: 'planning',
        name: 'Product Planning',
        description: 'Define your product vision, prioritize features, and create a roadmap.',
        color: '#FF8C00',
        glowColor: 'rgba(255, 140, 0, 0.3)',
        startDate: new Date(2026, 2, 5), // Mar 5
        endDate: new Date(2026, 2, 7, 23, 59, 59), // Mar 7
        tasks: [
            { id: 'p1', title: 'Define clear goals and metrics', completed: false },
            { id: 'p2', title: 'Define MVP scope', completed: false },
            { id: 'p3', title: 'Experiment and select a prioritization method', completed: false },
            { id: 'p4', title: 'Identify risks and constraints', completed: false },
            { id: 'p5', title: 'Draft PRD deliverable', completed: false },
            { id: 'p6', title: 'Schedule a meeting with your mentor this week', completed: false },
        ],
        deliverables: [
            {
                id: 'pd1',
                title: 'Draft PRD Document (PDF)',
                required: true,
                due: 'Mar 7, 11:59PM PST',
            },
        ],
        resources: [
            {
                id: 'pr1',
                title: 'Product Requirements Document Template',
                link: 'https://docs.google.com/document/d/1Tm-k1COmBhWO0hZyo6kYiLPmfu61z21no6Ca0aYPOss/edit?tab=t.0',
                type: 'template',
            },
            {
                id: 'pr2',
                title: 'Judging Rubric',
                link: 'https://docs.google.com/document/d/1gmN9fDvHBbjMZ83xcKHdM8JLKdxp96YHmhqR0gaY69s/edit?tab=t.0',
                type: 'material',
            },
        ],
    },
    {
        id: 'prototyping',
        name: 'Prototyping',
        description: 'Design and build a functional prototype of your product.',
        color: '#A855F7',
        glowColor: 'rgba(168, 85, 247, 0.3)',
        startDate: new Date(2026, 2, 8), // Mar 8
        endDate: new Date(2026, 2, 11, 23, 59, 59), // Mar 11
        tasks: [
            {
                id: 'pt1',
                title: 'Experiment with Lovable or any other prototyping platform',
                completed: false,
            },
            { id: 'pt2', title: 'Create functional MVP', completed: false },
            { id: 'pt3', title: 'Perform user testing', completed: false },
            { id: 'pt4', title: 'Schedule a meeting with your mentor this week', completed: false },
            {
                id: 'pt5',
                title: 'Schedule a meeting with a UX/technical mentor (optional)',
                completed: false,
            },
        ],
        deliverables: [
            {
                id: 'ptd1',
                title: 'Draft Prototype Link',
                required: true,
                due: 'Mar 11, 11:59PM PST',
            },
        ],
        resources: [
            {
                id: 'ptr1',
                title: 'Lovable',
                link: 'https://lovable.dev/?utm_device=c&utm_source=google&utm_medium=paid_search_branded&utm_campaign=google-global-b2c-prospecting-evergreen-subscription-XX+-+Search+-+Lovable+-+CORE&campaignid=23078175989&gad_source=1&gad_campaignid=23078175989&gbraid=0AAAAA-iIxGcGU3VgNdVqiXyVVEakoXiqj&gclid=CjwKCAiA2PrMBhA4EiwAwpHyC5LIoXJ-x2CXQ95hcyYl7B3qLys1c62Leg6zylfmK-54uB_sEweA5xoCyMoQAvD_BwE',
                type: 'material',
            },
            {
                id: 'ptr2',
                title: 'Judging Rubric',
                link: 'https://docs.google.com/document/d/1gmN9fDvHBbjMZ83xcKHdM8JLKdxp96YHmhqR0gaY69s/edit?tab=t.0',
                type: 'material',
            },
        ],
    },
    {
        id: 'pitching',
        name: 'Pitching',
        description: 'Craft your story and present your product to the judges.',
        color: '#EC4899',
        glowColor: 'rgba(236, 72, 153, 0.3)',
        startDate: new Date(2026, 2, 12), // Mar 12
        endDate: new Date(2026, 2, 13, 23, 59, 59), // Mar 13
        tasks: [
            { id: 'pi1', title: 'Storyboard your presentation', completed: false },
            { id: 'pi2', title: 'Create slide deck', completed: false },
            { id: 'pi3', title: 'Review judging rubric', completed: false },
            { id: 'pi4', title: 'Finalize all deliverables', completed: false },
            { id: 'pi5', title: 'Practice, Practice, Practice!', completed: false },
            {
                id: 'pi6',
                title: 'Brainstorm potential Q&A questions from judges',
                completed: false,
            },
            { id: 'pi7', title: 'Schedule a meeting with your mentor this week', completed: false },
            {
                id: 'pi8',
                title: 'Schedule a meeting with a UX/technical mentor (optional)',
                completed: false,
            },
        ],
        deliverables: [
            {
                id: 'pid1',
                title: 'Final User Insights One-Pager (PDF)',
                required: true,
                due: 'Mar 13, 11:59PM PST',
            },
            {
                id: 'pid2',
                title: 'Final PRD Document (PDF)',
                required: true,
                due: 'Mar 13, 11:59PM PST',
            },
            {
                id: 'pid3',
                title: 'Final Prototype Link',
                required: true,
                due: 'Mar 13, 11:59PM PST',
            },
            {
                id: 'pid4',
                title: 'Final Presentation Slides (PDF or PPTX)',
                required: true,
                due: 'Mar 13, 11:59PM PST',
            },
        ],
        resources: [
            {
                id: 'pir1',
                title: 'Judging Rubric',
                link: 'https://docs.google.com/document/d/1gmN9fDvHBbjMZ83xcKHdM8JLKdxp96YHmhqR0gaY69s/edit?tab=t.0',
                type: 'material',
            },
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
