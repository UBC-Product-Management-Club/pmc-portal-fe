import { describe, it, expect } from "vitest"
import { act, render, screen } from "@testing-library/react"
import { ActionTypes, UserDataProvider, useUserData } from "./UserDataProvider"
import { userEvent } from "@testing-library/user-event"
import { UserDocument } from "../../types/User"

describe('useUserData', () => {

    const exampleUser: UserDocument = {
        id: "userId",
        firstName: "geary",
        lastName: "pmc",
        pronouns: "he/him",
        email: "geary@ubcpmc.com",
        university: "University of British Columbia",
        pfp: "newpfp",
        displayName: "geary is da goat",
        whyPm: "gear noises",
    }

    function renderComponent() {
        const TestComponent = () => {
            const { user, update } = useUserData()

            return(
                <div>
                    {user ? (
                        <>
                            <h1>{user?.displayName}</h1>
                            <h1>{user?.email}</h1>
                        </>
                    ) : <h1>user is undefined!</h1>}
                    <button onClick={() => update({ type: ActionTypes.CREATE, payload: {
                        id: "userId",
                        displayName: "geary",
                        pfp: "newpfp",
                        email: "geary@ubcpmc.com"
                    }})}>Create user</button>
                    <button onClick={() => update({ type: ActionTypes.LOAD, payload: exampleUser})}>Load user</button>
                    <button onClick={() => update({ type: ActionTypes.UPDATE,
                        payload: { displayName: "geary is still da goat" } })}>Update user</button>
                </div>
            )
        }
        return render(
            <UserDataProvider>
                <TestComponent />
            </UserDataProvider>
        )
    }

    it('user is initially undefined', () => {
        renderComponent()

        expect(screen.getByText("user is undefined!")).toBeInTheDocument()
    })

    it('returns undefined when updating an undefined user', async () => {
        const user = userEvent.setup()
        renderComponent()

        await act(() => user.click(screen.getByRole("button", { name : "Update user"})))

        expect(screen.getByText("user is undefined!")).toBeInTheDocument()
    })

    it('loads an existing user', async () => {
        const user = userEvent.setup();
        renderComponent()

        await act(() => user.click(screen.getByRole("button", { name: "Load user"})))

        expect(screen.getByText("geary is da goat")).toBeInTheDocument()
        expect(screen.getByText("geary@ubcpmc.com")).toBeInTheDocument()
    })

    it('updates user info', async () => {
        const user = userEvent.setup()
        renderComponent()

        await act(() => user.click(screen.getByRole("button", { name: "Load user"})))

        expect(screen.getByText('geary is da goat')).toBeInTheDocument()

        await act(() => user.click(screen.getByRole('button', { name : "Update user"})))

        expect(screen.getByText('geary is still da goat')).toBeInTheDocument()
        expect(screen.getByText("geary@ubcpmc.com")).toBeInTheDocument()
    })

    it('creates a new user', async () => {
        const user = userEvent.setup()
        renderComponent()

        await act(() => user.click(screen.getByRole("button", { name: "Create user"})))

        expect(screen.getByText("geary")).toBeInTheDocument()
        expect(screen.getByText("geary@ubcpmc.com")).toBeInTheDocument()
    })

})