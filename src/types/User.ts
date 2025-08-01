import { z } from 'zod/v4';

const Universities = [
    'University of British Columbia',
    'Simon Fraser University',
    'British Columbia Institute of Technology',
    'Other',
    "I'm not a university student",
] as const;

const years = ['1', '2', '3', '4', '5+'] as const;

const UserDataFromAuthSchema = z.object({
    id: z.string(),
    email: z.email(),
    pfp: z.url(),
    displayName: z.string(),
});

const UserDataFromUserSchema = z.object({
    firstName: z.string().min(1, {
        message: 'Please enter a first name.',
    }),

    lastName: z.string().min(1, {
        message: 'Please enter a last name.',
    }),

    pronouns: z.string().min(1, {
        message: 'Please enter your pronouns.',
    }),

    university: z.enum(Universities),

    studentId: z
        .string()
        .min(1, {
            message: 'Please enter your student ID.',
        })
        .max(8, {
            message: 'Student ID is too long. Maxiumum 8 characters.',
        })
        .regex(/^\d+/, {
            message: 'Please enter a valid student ID.',
        })
        .optional(),

    year: z
        .enum(years, {
            message: 'Please select a value.',
        })
        .optional(),

    faculty: z
        .string()
        .min(1, {
            message: 'Please enter a valid faculty.',
        })
        .optional(),

    major: z
        .string()
        .min(1, {
            message: 'Please enter a valid major.',
        })
        .optional(),

    whyPm: z
        .string()
        .min(1, {
            message: 'Why would you like to join PMC?',
        })
        .max(300, {
            message: 'Maximum 300 characters.',
        }),
});

const UserMetaInfoSchema = z.object({
    isPaymentVerified: z.boolean(),
});

const UserDocumentSchema = z.object({
    ...UserDataFromAuthSchema.shape,
    ...UserDataFromUserSchema.shape,
    ...UserMetaInfoSchema.shape,
});

const RawUserFromDatabase = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    display_name: z.string(),
    why_pm: z.string(),
    pronouns: z.string(),
    email: z.email(),
    pfp: z.url(),
    is_payment_verified: z.boolean(),
    university: z.enum(Universities).nullable(),
    faculty: z.string().nullable(),
    year: z.enum(years).nullable(),
    major: z.string().nullable(),
    student_id: z.string().nullable(),
});

const UserFromDatabaseSchema = RawUserFromDatabase.transform((user) => ({
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    displayName: user.display_name,
    whyPm: user.why_pm,
    pronouns: user.pronouns,
    university: user.university ?? undefined,
    faculty: user.faculty ?? undefined,
    email: user.email,
    year: user.year ?? undefined,
    major: user.major ?? undefined,
    pfp: user.pfp,
    isPaymentVerified: user.is_payment_verified,
    studentId: user.student_id ?? undefined,
}));

type UserDocumentSchema = z.infer<typeof UserDocumentSchema>;
type UserDataFromAuth = z.infer<typeof UserDataFromAuthSchema>;
type UserDataFromUser = z.infer<typeof UserDataFromUserSchema>;
type UserDocument = UserDataFromAuth & UserDataFromUser & UserDocumentSchema;
type UserFromDatabase = z.infer<typeof UserFromDatabaseSchema>;

export type { UserDataFromAuth, UserDataFromUser, UserDocument, UserFromDatabase };
export {
    Universities,
    years,
    UserDataFromAuthSchema,
    UserDataFromUserSchema,
    UserDocumentSchema,
    UserFromDatabaseSchema,
};
