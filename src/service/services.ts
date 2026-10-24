import { AttendeeService } from './AttendeeService';
import { EventService } from './EventService';
import { SubmissionService } from './SubmissionService';
import { TeamService } from './TeamService';
import { UserService } from './UserService';
import { MockAttendeeService } from './mocks/MockAttendeeService';
import { MockEventService } from './mocks/MockEventService';
import { MockSubmissionService } from './mocks/MockSubmissionService';
import { MockTeamService } from './mocks/MockTeamService';
import { MockUserService } from './mocks/MockUserService';

// The one place that picks real or placeholder services. Set VITE_USE_MOCKS=true in your
// local .env to build pages without the backend; never set it in a deployed environment.
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

type Api<T> = Pick<T, keyof T>;

export const createEventService = (): Api<EventService> =>
    useMocks ? new MockEventService() : new EventService();

export const createAttendeeService = (): Api<AttendeeService> =>
    useMocks ? new MockAttendeeService() : new AttendeeService();

export const createTeamService = (): Api<TeamService> =>
    useMocks ? new MockTeamService() : new TeamService();

export const createSubmissionService = (): Api<SubmissionService> =>
    useMocks ? new MockSubmissionService() : new SubmissionService();

export const createUserService = (): Api<UserService> =>
    useMocks ? new MockUserService() : new UserService();
