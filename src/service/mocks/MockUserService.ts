import { UserDocument } from '../../types/User';
import type { ProfileUpdate, UserService } from '../UserService';
import { delay, mockError, mockUser } from './mockData';

const EDITABLE = ['first_name', 'last_name', 'pronouns', 'year', 'faculty', 'major', 'why_pm'];

let user = { ...mockUser };

// ?member=yes|no makes the student a PMC member or not; remembered for the tab
const MEMBER_KEY = 'mock_member';

export function isMockMember() {
    const fromUrl = new URLSearchParams(window.location.search).get('member');
    if (fromUrl) sessionStorage.setItem(MEMBER_KEY, fromUrl);
    return sessionStorage.getItem(MEMBER_KEY) === 'yes';
}

class MockUserService implements Pick<UserService, keyof UserService> {
    create() {}

    async me(): Promise<UserDocument> {
        await delay();
        return { ...user, is_payment_verified: isMockMember() } as unknown as UserDocument;
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
