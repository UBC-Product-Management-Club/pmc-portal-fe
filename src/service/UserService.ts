import { PaymentIntent } from '@stripe/stripe-js';
import { UserDocument, UserDocumentSchema } from '../types/User';
import { RestClient } from './RestClient';

class UserService {
    private client: RestClient;

    constructor(client?: RestClient) {
        this.client = client ?? new RestClient(`${import.meta.env.VITE_API_URL}/api/v1/auth`);
    }

    create(userToCreate: Partial<UserDocument>, payment: PaymentIntent) {
        const user: UserDocumentSchema = UserDocumentSchema.parse(userToCreate);
        this.client.post<UserDocument>(
            '/onboard',
            JSON.stringify({ user: user, payment: payment })
        );
    }

    fetch(userId: string): Promise<UserDocument> {
        return this.client.post<UserDocument>('/login', JSON.stringify({ userId: userId }));
    }
}

export { UserService };
