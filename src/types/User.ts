import { z } from 'zod/v4'

const Universities = ["University of British Columbia", "Simon Fraser University", "British Columbia Institute of Technology", "Other", "I'm not a university student"] as const

const years = ["1", "2" ,"3", "4", "5+"] as const

const UserDataFromAuthSchema = z.object({
  id: z.string(),
  email: z.email(),
  pfp: z.url(),
  displayName: z.string(),
})

const UserDataFromUserSchema = z.object({
    firstName: z.string().min(1, {
        message: "Please enter a first name."
    }),

    lastName: z.string().min(1, {
        message: "Please enter a last name."
    }),

    pronouns: z.string().min(1,{
        message: "Please enter your pronouns."
    }),
    
    university: z.enum(Universities),

    studentId: z.string().max(8).optional(),

    year: z.enum(years, {
        message: "Please select a value."
    }).optional(),

    faculty: z.string().min(1, {
        message: "Please enter a valid faculty."
    }).optional(),

    major: z.string().min(1, {
        message: "Please enter a valid major."
    }).optional(),

    whyPm: z.string().min(1, {
        message: "Why would you like to join PMC?"
    }).max(300, {
        message: "Maximum 300 characters."
    }),
})

const UserDocumentSchema = z.object({
    ...UserDataFromAuthSchema.shape,
    ...UserDataFromUserSchema.shape,
})

const RawUserFromDatabase = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    display_name: z.string(),
    why_pm: z.string(),
    pronouns: z.string(),
    university: z.string(),
    faculty: z.string(),
    email: z.email(),
    year: z.string(),
    major: z.string(),
    pfp: z.url(),
    is_payment_verified: z.boolean(),
    student_id: z.string()
})

const UserFromDatabase = RawUserFromDatabase.transform((user) => ({
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    displayName: user.display_name,
    whyPm : user.why_pm,
    email: user.email,
    pronouns: user.pronouns,
    pfp: user.pfp,
    university: user.university,
    faculty: user.faculty,
    year: user.year,
    major: user.major,
    isPaymentVerified: user.is_payment_verified,
    studentId: user.student_id
}))

type UserDocumentSchema = z.infer<typeof UserDocumentSchema>
type UserDataFromAuth = z.infer<typeof UserDataFromAuthSchema>
type UserDataFromUser = z.infer<typeof UserDataFromUserSchema>
type UserDocument = (UserDataFromAuth & UserDataFromUser) | z.infer<typeof UserFromDatabase>

export type { UserDataFromAuth, UserDataFromUser, UserDocument }
export { Universities, years, UserDataFromAuthSchema, UserDataFromUserSchema, UserDocumentSchema, UserFromDatabase}