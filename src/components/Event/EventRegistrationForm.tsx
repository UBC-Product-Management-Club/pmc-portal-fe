import '../component-theme.css';
export default function EventRegistrationForm() {
    function handleSubmit() {

    }

    return (
        <form autoComplete="off" onSubmit={() => handleSubmit()}>
            <select required>
                <option value={""} hidden>How familiar are you with product management?</option>
                <option value={"beginner"}>Beginner; little to no knowledge</option>
                <option value={"intermediate"}>Intermediate; some knowledge from competitions, courses, self research</option>
                <option value={"advanced"}>Advanced; had formal experience, familiar with frameworks & applications</option>
                <option value={"mentor"}>Mentor; have mentored before</option>
            </select>
            <select required>
                <option value={""} hidden>How did you find out about this event?</option>
                <option value={"instagram"}>Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="newsletter">Newsletter</option>
                <option value="website">Website</option>
                <option value="friend-or-colleague">Friend or Colleague</option>
                <option value="partner-event">Partner Event (another club, company, etc.)</option>
                <option value="pmc-booth">PMC Booth</option>
                <option value="other">Other</option>
            </select>
            <input type={"text"} placeholder={"Dietary restrictions"}/>
            <input type={"text"} placeholder={"What do you hope to get out of this event?"}/>
            <button className="pmc-button pmc-button-white" type="submit">Sign Up</button>
        </form>
    )
}