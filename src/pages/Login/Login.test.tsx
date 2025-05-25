import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Login from "./Login";


describe('login', () => {

    function renderComponent() {
        render(
            <Login />
        )
    }

    it('shows text and logo', () => {
        renderComponent();
        
        screen.debug()
        expect(screen.getByText("PMC Membership Portal")).toBeInTheDocument();
        expect(screen.getByTestId("logo")).toBeInTheDocument();
    })

    it('buttons are clickable', async () => {
        renderComponent()

        const logInBtn = screen.getByRole("button", { name: "Log in / sign up"});
        const guestBtn = screen.getByRole("button", { name: "Continue as a non-member"});

        expect(logInBtn).toBeInTheDocument();
        expect(guestBtn).toBeInTheDocument();

    }) 
    
})