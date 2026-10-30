import { ApiError } from '../RestClient';

// Placeholder data for building pages without the backend (VITE_USE_MOCKS=true).
// Shapes match the API responses; names, mentors, location and the cap are placeholders.

export const MOCK_EVENT_ID = 'b7e3c9a2-4f1d-4c8e-9a6b-2d5f8e1c3a70';
export const MOCK_PHASE_ID = 'submission';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const fromNow = (ms: number) => new Date(Date.now() + ms).toISOString();

// Pick the registration and submission windows with ?window=open|before|closed|real.
// open (the default) keeps every page usable; real uses the event's actual dates in Pacific time.
const windows = () => ({
    open: {
        registration: [fromNow(-DAY), fromNow(7 * DAY)],
        submission: [fromNow(-HOUR), fromNow(2 * HOUR)],
    },
    before: {
        registration: [fromNow(DAY), fromNow(8 * DAY)],
        submission: [fromNow(HOUR), fromNow(3 * HOUR)],
    },
    closed: {
        registration: [fromNow(-8 * DAY), fromNow(-DAY)],
        submission: [fromNow(-3 * HOUR), fromNow(-HOUR)],
    },
    real: {
        registration: ['2026-11-02T08:00:00.000Z', '2026-11-16T07:59:59.000Z'],
        submission: ['2026-11-21T18:00:00.000Z', '2026-11-22T20:00:00.000Z'],
    },
});

type WindowMode = keyof ReturnType<typeof windows>;
const WINDOW_KEY = 'mock_window';

function getWindows() {
    const fromUrl = new URLSearchParams(window.location.search).get('window');
    if (fromUrl) sessionStorage.setItem(WINDOW_KEY, fromUrl);
    const mode = sessionStorage.getItem(WINDOW_KEY);
    const all = windows();
    return all[mode && mode in all ? (mode as WindowMode) : 'open'];
}

// Move the event with ?timing=live|ended; without it the real Nov 21-22 dates are used
const TIMING_KEY = 'mock_timing';

function eventTimes() {
    const fromUrl = new URLSearchParams(window.location.search).get('timing');
    if (fromUrl) sessionStorage.setItem(TIMING_KEY, fromUrl);
    const timing = sessionStorage.getItem(TIMING_KEY);
    if (timing === 'live') return { start_time: fromNow(-3 * HOUR), end_time: fromNow(DAY) };
    if (timing === 'ended') return { start_time: fromNow(-2 * DAY), end_time: fromNow(-HOUR) };
    return { start_time: '2026-11-21T17:00:00.000Z', end_time: '2026-11-23T00:00:00.000Z' };
}

export const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export function mockError(status: number, code: string, body?: object): ApiError {
    return new ApiError(`HTTP error ${status}: ${code}`, status, code, undefined, {
        error: { code, message: code },
        ...body,
    });
}

export const mockEvent = () => ({
    event_id: MOCK_EVENT_ID,
    name: 'Product Jackpot',
    date: '2026-11-21',
    registration_opens: getWindows().registration[0],
    registration_closes: getWindows().registration[1],
    ...eventTimes(),
    location: 'TBA',
    blurb: "PMC's 24 hour product challenge: understand users, bet on an idea and pitch it to industry judges.",
    // Admin-written markdown, taken from the public Product Jackpot page
    description: [
        "Product Jackpot is PMC's product competition where students turn ideas into solutions. Participants go through the full PM process: understanding users, brainstorming solutions, creating a product strategy, and pitching their ideas.",
        "It's a beginner-friendly, 24 hour challenge built around a real-world product case from an industry sponsor, with guidance from experienced mentors along the way. Every successful product starts with a bet. Compete to find the strongest opportunity and build the next winning solution.",
        '### How it works',
        [
            "1. **Understand users.** Dig into who you're building for and what they actually need.",
            '2. **Brainstorm solutions.** Generate ideas, then place your bet on the strongest one.',
            '3. **Create a product strategy.** Turn the idea into a plan, a mockup, and a reason to win.',
            '4. **Pitch your idea.** Take the final hand to a panel of industry judges.',
        ].join('\n'),
        '### Why join?',
        [
            '- Learn product management fundamentals',
            '- Build a project for your portfolio',
            '- Connect with industry mentors',
            '- Network with other students',
            '- Compete for prizes',
        ].join('\n'),
    ].join('\n\n'),
    media: [],
    member_price: 9,
    non_member_price: 15,
    max_attendees: 52,
    event_form_questions: {
        questions: [
            { id: 'phone', type: 'short-answer', label: 'Phone number', required: true },
            {
                id: 'why_event',
                type: 'long-answer',
                label: 'Why are you interested in participating in Product Jackpot?',
                required: true,
                maxWords: 300,
            },
            {
                id: 'why_pm',
                type: 'long-answer',
                label: 'What interests you about product management, and why do you want to pursue it?',
                required: true,
                maxWords: 300,
            },
            {
                id: 'experience',
                type: 'long-answer',
                label: 'Tell us about your experience with case competitions, hackathons, or similar projects.',
                required: true,
                maxWords: 300,
            },
            {
                id: 'resume',
                type: 'file',
                label: 'Resume (PDF)',
                required: true,
                accept: ['application/pdf'],
                maxSizeMB: 5,
            },
        ],
    },
    is_disabled: false,
    registered: 12,
    needs_review: true,
    external_page: null,
    waitlist_form: null,
    thumbnail: '/mock/product-jackpot.png',
    icon: '/mock/product-jackpot-icon.png',
    schedule: {
        days: [
            {
                date: '2026-11-21',
                label: 'Day 1 · Saturday, November 21',
                items: [
                    { time: '09:00', title: 'Registration' },
                    { time: '09:30', title: 'Opening Ceremonies' },
                    { time: '10:00', title: 'Kickoff' },
                    { time: '12:00', title: 'Lunch' },
                    { time: '15:00', title: 'Workshop' },
                    { time: '16:00', title: 'Mentorship' },
                ],
            },
            {
                date: '2026-11-22',
                label: 'Day 2 · Sunday, November 22',
                items: [
                    { time: '10:00', title: 'Check-In Deadline' },
                    { time: '12:00', title: 'Submission Deadline' },
                    { time: '12:30', title: 'Preliminary Announcement' },
                    { time: '12:45', title: 'Preliminary Round' },
                    { time: '14:00', title: 'Grand Finals + Closing Ceremonies' },
                    { time: '15:15', title: 'Post Event Social' },
                    { time: '16:00', title: 'End of Event' },
                ],
            },
        ],
    },
});

export const mockRegisteredContent = () => ({
    page_content: {
        mentors: [
            { name: 'Mentor name', role: 'Product Manager, Company' },
            { name: 'Mentor name', role: 'Senior PM, Company' },
            { name: 'Mentor name', role: 'Product Designer, Company' },
        ],
        prep: ['Join the Product Jackpot Discord', 'Bring your laptop, charger and student ID'],
        faq: [
            {
                q: 'Who can join?',
                a: 'Product Jackpot is open to students of all years, faculties, and experience levels who are interested in Product Management, technology, startups, or innovation.',
            },
            {
                q: 'Do I need coding experience?',
                a: 'No coding experience is required! Product Jackpot focuses on product thinking, problem-solving and user needs rather than building a fully functional product.',
            },
            {
                q: 'Do I need a team?',
                a: "No, you do not need a team before registering! Once you're registered, you can create a team or join one with a team code, compete on your own, or come find us in the room after opening remarks and we'll help you find a team.",
            },
            {
                q: 'What should I bring?',
                a: 'Bring your laptop, charger, student ID, and anything else you need to work comfortably with your team.',
            },
            {
                q: 'How does judging work?',
                a: 'Teams pitch their final product solutions to judges at the end of the challenge, judged on user impact, creativity, feasibility, product thinking and presentation.',
            },
        ],
    },
    discord_url: 'https://discord.gg/placeholder',
    max_team_size: 4,
});

export const mockUser = {
    user_id: 'auth0|mock-user',
    first_name: 'Simoon',
    last_name: 'Song',
    display_name: 'Simoon Song',
    why_pm: 'I want to learn how teams turn an idea into a product.',
    pronouns: 'she/her',
    email: 'simoon@example.com',
    pfp: 'https://placehold.co/96x96',
    is_payment_verified: false,
    university: 'University of British Columbia' as const,
    faculty: 'Science',
    year: '3' as const,
    major: 'Computer Science',
    student_id: '12345678',
};

const member = (attendeeId: string, first: string, last: string, email: string) => ({
    attendee_id: attendeeId,
    Attendee: {
        user_id: `auth0|${first.toLowerCase()}`,
        User: { email, first_name: first, last_name: last },
    },
});

export const mockTeam = () => ({
    team_id: '5d2a8c41-9e3b-4f7a-8c1d-6b0e2f4a9c13',
    Team: {
        team_name: 'Royal Flush',
        team_code: 'R4827',
        Team_Member: [
            {
                ...member(
                    '8f3c2a1e-4b7d-4c1a-9e2f-0d5b6a7c8e91',
                    'Simoon',
                    'Song',
                    'simoon@example.com'
                ),
                Attendee: {
                    user_id: mockUser.user_id,
                    User: { email: mockUser.email, first_name: 'Simoon', last_name: 'Song' },
                },
            },
            member('6b8d0f2a-4c6e-4a1b-9d3f-5e7a9c1b3d5f', 'Alex', 'Kim', 'alex@example.com'),
            member('3e5a9c1b-7d2f-4b8e-a0c6-9f1e2d3c4b5a', 'Priya', 'Shah', 'priya@example.com'),
        ],
    },
});

export const mockPhase = () => ({
    id: MOCK_PHASE_ID,
    event_id: MOCK_EVENT_ID,
    starttime: getWindows().submission[0],
    deadline: getWindows().submission[1],
    is_enabled: true,
    fields: [
        {
            id: 'deck',
            type: 'file' as const,
            label: 'Slide deck',
            required: true,
            accept: ['application/pdf'],
            maxSizeMB: 25,
        },
        { id: 'prototype', type: 'url' as const, label: 'Prototype / demo link', required: true },
        {
            id: 'video',
            type: 'url' as const,
            label: 'Video link (YouTube or Google Drive recommended)',
            required: true,
        },
        {
            id: 'description',
            type: 'long-answer' as const,
            label: 'Short product description',
            required: true,
            maxWords: 150,
        },
    ],
    extended_until: null,
    server_time: new Date().toISOString(),
});

export const mockAnnouncements = [
    {
        announcement_id: 'welcome',
        title: 'Product Jackpot applications are open',
        body: 'Apply by Nov 15. Teams of 1 to 4, beginners welcome.',
    },
    {
        announcement_id: 'membership',
        title: 'Become a member for discounted events',
        body: 'Members pay less for every PMC event this year.',
        audience: 'non_members' as const,
    },
];
