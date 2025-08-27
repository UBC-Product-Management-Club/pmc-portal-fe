import { UserDocument, UserDocumentSchema } from '../types/User';
import { RestClient } from './RestClient';

class UserService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v2/auth`);
    }

    create(userToCreate: Partial<UserDocument>) {
        const user: UserDocumentSchema = UserDocumentSchema.parse(userToCreate);
        this.client.post<UserDocument>('/onboard', JSON.stringify({ user: user }));
    }

    me(): Promise<UserDocument> {
        return this.client.get<UserDocument>('/me');
    }
}

export { UserService };
