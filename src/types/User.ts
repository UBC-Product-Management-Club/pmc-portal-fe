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

    studentId: z.coerce.number()
        .int({
            message: "Student IDs must not have decimal points!"
        })
        .gte(10000000, {
            message: "Please enter a valid 8-digit student ID."
        })
        .lte(99999999, {
            message: "Please enter a valid 8-digit student ID."
        })
        .optional(),

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

type UserDocumentSchema = z.infer<typeof UserDocumentSchema>
type UserDataFromAuth = z.infer<typeof UserDataFromAuthSchema>
type UserDataFromUser = z.infer<typeof UserDataFromUserSchema>
type UserDocument = UserDataFromAuth & UserDataFromUser 

export type { UserDataFromAuth, UserDataFromUser, UserDocument }
export { Universities, years, UserDataFromAuthSchema, UserDataFromUserSchema, UserDocumentSchema}