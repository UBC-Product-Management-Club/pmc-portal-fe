import { UserDocument } from '../../types/User';
import type { ProfileUpdate, UserService } from '../UserService';
import { delay, mockError, mockUser } from './mockData';

const EDITABLE = ['first_name', 'last_name', 'pronouns', 'year', 'major', 'why_pm'];

let user = { ...mockUser };

class MockUserService implements Pick<UserService, keyof UserService> {
    create() {}

    async me(): Promise<UserDocument> {
        await delay();
        return user as unknown as UserDocument;
    }

    async getProfile(): Promise<UserDocument> {
        return this.me();
    }

    // Mirrors the PATCH allowlist: any other key is a 400 and nothing is saved
    async updateProfile(changes: ProfileUpdate): Promise<UserDocument> {
        await delay();
        const keys = Object.keys(changes);
        if (keys.length === 0 || keys.some((key) => !EDITABLE.includes(key))) {
            throw mockError(400, 'VALIDATION_ERROR');
        }
        user = { ...user, ...changes } as typeof user;
        return user as unknown as UserDocument;
    }
}

export { MockUserService };
