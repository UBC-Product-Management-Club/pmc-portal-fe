import { describe, it, expect } from "vitest"
import { act, render, screen } from "@testing-library/react"
import { ActionTypes, UserDataContext, UserDataProvider } from "./UserDataProvider"
import { UserDocument } from "../../types/api"
import { userEvent } from "@testing-library/user-event"
import { useContext } from "react"

describe('UserDataProvider', () => {

    const exampleUser: UserDocument = {
        firstName: "geary",
        lastName: "",
        pronouns: "he/him",
        email: "geary@ubcpmc.com",
        pfp: "newpfp",
        displayName: "geary is da goat",
        onboarded: false,
        whyPm: "gear noises",
        paymentVerified: false,
        returningMember: undefined
    }

    function renderComponent() {
        const TestComponent = () => {
            const { user, update } = useContext(UserDataContext)

            return(
                <div>
                    <h1>{user?.displayName}</h1>
                    <h1>{user?.email}</h1>
                    {user?.paymentVerified && <h1>is a member</h1>}
                    <button onClick={() => update({ type: ActionTypes.LOAD, payload: exampleUser})}>Load user</button>
                    <button onClick={() => update({ type: ActionTypes.UPDATE,
                        payload: { displayName: "geary is still da goat", paymentVerified: true  } })}>Update user</button>
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

        expect(screen.queryByText("is a member")).not.toBeInTheDocument();
        screen.getAllByRole("heading").forEach((heading) => expect(heading).toHaveTextContent(""));
    })

    it('returns undefined when updating an undefined user', async () => {
        const user = userEvent.setup()
        renderComponent()

        await act(() => user.click(screen.getByRole("button", { name : "Update user"})))

        expect(screen.queryByText("is a member")).not.toBeInTheDocument();
        screen.getAllByRole("heading").forEach((heading) => expect(heading).toHaveTextContent(""));
    })

    describe('provides user data to children', () => {
        it('when loading user', async () => {
            const user = userEvent.setup();
            renderComponent()

            await act(() => user.click(screen.getByRole("button", { name: "Load user"})))

            expect(screen.queryByText("is a member")).not.toBeInTheDocument()
            expect(screen.getByText("geary is da goat")).toBeInTheDocument()
            expect(screen.getByText("geary@ubcpmc.com")).toBeInTheDocument()
        })

        it('after updating user info', async () => {
            const user = userEvent.setup()
            renderComponent()

            await act(() => user.click(screen.getByRole("button", { name: "Load user"})))

            expect(screen.queryByText("is a member")).not.toBeInTheDocument()
            expect(screen.getByText('geary is da goat')).toBeInTheDocument()

            await act(() => user.click(screen.getByRole('button', { name : "Update user"})))

            expect(screen.getByText("is a member")).toBeInTheDocument()
            expect(screen.getByText('geary is still da goat')).toBeInTheDocument()
            expect(screen.getByText("geary@ubcpmc.com")).toBeInTheDocument()
        })
    })
})