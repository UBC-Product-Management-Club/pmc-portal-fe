// STORE API REQUEST/RESPONSE TYPES HERE

import { User } from "firebase/auth"

type userDocument = {
    first_name: string
    last_name: string
    pronouns: string
    email: string // from google
    displayName: string // from Google
    university: string
    student_id: number
    year: string // "5+"
    faculty: string
    major: string
    why_PM: string
    returning_member: boolean
}

type loginBody = {
    userUID: string
    idToken: string
}

type onboardingBody = {
   creds: loginBody
   userDoc: userDocument
}

type eventBody = {
    event_Id: string,
    date: Date,
    name: string,
    description: string,
    location: string,
    member_price: number,
    non_member_price: number,
    media: string[],
    member_only: boolean,
    attendees: string[]
}