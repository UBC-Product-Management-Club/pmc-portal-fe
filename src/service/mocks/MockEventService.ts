import { Event, EventCard } from '../../types/Event';
import type {
    AddAttendeeResponse,
    EventService,
    JsonValue,
    RawAnnouncement,
    RawEventStatusRow,
    RawRegisteredContent,
} from '../EventService';
import {
    getMockState,
    MockAttendeeService,
    setMockAnswers,
    setMockState,
} from './MockAttendeeService';
import {
    delay,
    MOCK_EVENT_ID,
    mockAnnouncements,
    mockError,
    mockEvent,
    mockRegisteredContent,
} from './mockData';

// Drafts live in memory for the tab, with a version for the STALE_DRAFT check
let draft: { draft: Record<string, JsonValue>; version: number } | null = null;

class MockEventService implements Pick<EventService, keyof EventService> {
    async getAll(): Promise<EventCard[]> {
        await delay();
        return [mockEvent()] as unknown as EventCard[];
    }

    async getUserCurrentEvents(): Promise<EventCard[]> {
        await delay();
        return (getMockState() ? [mockEvent()] : []) as unknown as EventCard[];
    }

    async getById(): Promise<Event> {
        await delay();
        return mockEvent() as unknown as Event;
    }

    async addAttendee(eventId: string, answers: FormData): Promise<AddAttendeeResponse> {
        await delay(800);
        if (getMockState()) throw mockError(409, 'ALREADY_APPLIED');
        const text: Record<string, string> = {};
        answers.forEach((value, key) => {
            text[key] = value instanceof File ? value.name : value;
        });
        setMockAnswers(text);
        setMockState('applied');
        draft = null;
        const attendee = await new MockAttendeeService().getAttendee(eventId);
        return { message: 'Application submitted', attendee };
    }

    async loadDraft(): Promise<Record<string, JsonValue> | null> {
        await delay();
        return draft ? { draft: draft.draft, version: draft.version } : null;
    }

    async saveDraft(
        _eventId: string,
        nextDraft: Record<string, JsonValue>,
        version?: number
    ): Promise<void> {
        await delay();
        if (version !== undefined && draft && version !== draft.version) {
            throw mockError(409, 'STALE_DRAFT', { draft: draft.draft, version: draft.version });
        }
        draft = { draft: nextDraft, version: (draft?.version ?? 0) + 1 };
    }

    async deleteDraft(): Promise<void> {
        await delay();
        draft = null;
    }

    async getStatuses(): Promise<RawEventStatusRow[]> {
        const attendee = await new MockAttendeeService().getAttendee(MOCK_EVENT_ID);
        const raw = attendee as unknown as { status: string; payment_due_at: string | null } | null;
        if (!raw && !draft) return [];
        return [
            {
                event_id: MOCK_EVENT_ID,
                status: (raw?.status ?? null) as RawEventStatusRow['status'],
                has_draft: !!draft,
                payment_due_at: raw?.payment_due_at ?? null,
            },
        ];
    }

    async getAnnouncements(): Promise<RawAnnouncement[]> {
        await delay();
        return mockAnnouncements;
    }

    async getRegisteredContent(): Promise<RawRegisteredContent> {
        await delay();
        if (getMockState() !== 'registered') throw mockError(403, 'NOT_REGISTERED');
        return mockRegisteredContent();
    }
}

export { MockEventService };
