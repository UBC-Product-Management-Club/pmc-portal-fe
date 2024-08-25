// STORE API REQUEST/RESPONSE TYPES HERE

type userDocument = {
    displayName?: string
    email?: string
    pfp?: string
    first_name: string;
    last_name: string;
    ubc_student: "yes" | "no, other uni" | "no, other";
    why_pm: string;
    returning_member: "yes" | "no";
    student_id?: number | undefined;
    year?: "1" | "2" | "3" | "4" | "4+" | undefined;
    faculty?: string | undefined;
    major?: string | undefined;
}

type loginBody = {
    userUID: string
    idToken: string
}

type onboardingBody = {
    creds: loginBody
    userDoc: userDocument
}

type eventType = {
    event_Id: string
    name: string
    date: Date
    location: string
    description: string
    media: string[]
    member_price: number
    non_member_price: number
    attendees: AttendeeType[]
    member_only: boolean
}

type attendeeType = {
    attendee_Id: string
    is_member: boolean
    member_Id: string
    event_Id: string
    first_name: string
    last_name: string
    student_num: number
    email: string
    year_level: number
    major: string
    faculty: string
    familiarity: 'beginner' | 'intermediate' | 'advanced' | 'mentor'
    found_out: string
    dietary: string
}

type paymentIntentResponse = {
    payment_secret: string
}

type paymentInfo = {
    id: string
    amount: number
    status: string
    created: Timestamp
}

type addTransactionBody = {
    type: "membership" | "event"
    member_id?: string
    attendee_id?: string
    payment: paymentInfo
}

export { userDocument, loginBody, onboardingBody, eventType, attendeeType, paymentIntentResponse, addTransactionBody, paymentInfo }