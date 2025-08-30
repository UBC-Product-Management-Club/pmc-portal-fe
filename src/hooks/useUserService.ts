import { UserService } from '../service/UserService';
import { UserDocument, UserFromDatabaseSchema } from '../types/User';

function useUserService() {
    const userService = new UserService();

    async function create(user: Partial<UserDocument>): Promise<void> {
        userService.create({ ...user, isPaymentVerified: false });
    }

    async function me() {
        const user = await userService.me();
        console.log(user);
        if (user) {
            return UserFromDatabaseSchema.parse(user);
        } else {
            throw new Error('Current user not found');
        }
    }

    return { create, me };
}

export { useUserService };
