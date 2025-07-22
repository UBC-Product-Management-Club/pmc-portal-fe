import { PaymentIntent } from "@stripe/stripe-js"
import { UserService } from "../service/UserService"
import { UserDocument, UserFromDatabase } from "../types/User"

function useUserService() {
    const userService = new UserService()

    async function get(userId: string) : Promise<UserDocument> {
        const user: UserDocument = UserFromDatabase.parse(await userService.fetch(userId))
        return user
    }

    async function create(user: Partial<UserDocument>, payment: PaymentIntent) : Promise<void> {
        userService.create(user, payment)
    }

    return { get, create }

}

export { useUserService }