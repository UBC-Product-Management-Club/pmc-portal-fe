import { UserDocument, UserDocumentSchema } from '../types/User';
import { RestClient } from './RestClient';

// The only Profile fields a student can change (the PATCH allowlist)
export type ProfileUpdate = Partial<{
    first_name: string;
    last_name: string;
    pronouns: string;
    year: string;
    major: string;
    why_pm: string;
}>;

class UserService {
    private client: RestClient;
    private profileClient: RestClient;

    constructor(client?: RestClient, profileClient?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/auth`);
        this.profileClient =
            profileClient ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/profile`);
    }

    create(userToCreate: Partial<UserDocument>) {
        const user: UserDocumentSchema = UserDocumentSchema.parse(userToCreate);
        this.client.post<UserDocument>('/onboard', JSON.stringify({ user: user }));
    }

    me(): Promise<UserDocument> {
        return this.client.get<UserDocument>('/me');
    }

    // Profile page endpoints
    getProfile(): Promise<UserDocument> {
        return this.profileClient.get<UserDocument>('/profile');
    }

    updateProfile(changes: ProfileUpdate): Promise<UserDocument> {
        return this.profileClient.patch<ProfileUpdate, UserDocument>('/profile', changes);
    }
}

export { UserService };
