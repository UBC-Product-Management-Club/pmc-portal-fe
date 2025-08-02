import { UserService } from '../service/UserService';
import { UserDocument, UserFromDatabase, UserFromDatabaseSchema } from '../types/User';

function useUserService() {
    const userService = new UserService();

    async function get(userId: string): Promise<UserFromDatabase> {
        return UserFromDatabaseSchema.parse(await userService.fetch(userId));
    }

    async function create(user: Partial<UserDocument>) : Promise<void> {
        userService.create(user)
    }

    return { get, create };
}

export { useUserService };
