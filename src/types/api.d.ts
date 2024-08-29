// STORE API REQUEST/RESPONSE TYPES HERE

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