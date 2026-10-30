import { createUserService } from '../service/services';
import { ProfileUpdate } from '../service/UserService';
import { UserDocument, UserFromDatabaseSchema } from '../types/User';

function useUserService() {
    const userService = createUserService();

    async function create(user: Partial<UserDocument>): Promise<void> {
        userService.create({ ...user, isPaymentVerified: false });
    }

    async function me() {
        const user = await userService.me();
        if (user) {
            return UserFromDatabaseSchema.parse(user);
        } else {
            throw new Error('Current user not found');
        }
    }

    async function getProfile() {
        return UserFromDatabaseSchema.parse(await userService.getProfile());
    }

    async function updateProfile(changes: ProfileUpdate) {
        return UserFromDatabaseSchema.parse(await userService.updateProfile(changes));
    }

    return { create, me, getProfile, updateProfile };
}

export { useUserService };
