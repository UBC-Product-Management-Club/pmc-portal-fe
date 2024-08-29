import { z } from "zod"

const UserZodObj = z.object({
    first_name: z.string().min(1, {
        message: "Please enter a first name."
    }),

    last_name: z.string().min(1, {
        message: "Please enter a last name."
    }),

    pronouns: z.string().min(1,{
        message: "Please enter your pronouns."
    }),

    ubc_student: z.enum(["yes", "no, other uni", "no, other"], {
        message: "Please select a value."
    }),
    
    student_id: z.number({
        coerce: true
    })
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

    university: z.string().min(1,{
        message: "Please enter the name of the university you go to."
    }).optional(),

    year: z.enum(["1", "2", "3", "4", "5+"], {
        message: "Please select a value."
    }).optional(),

    faculty: z.string().min(1, {
        message: "Please enter a valid faculty."
    }).optional(),

    major: z.string().min(1, {
        message: "Please enter a valid major."
    }).optional(),

    why_pm: z.string().min(1, {
        message: "Why would you like to join PMC?"
    }).max(300, {
        message: "Maximum 300 characters."
    }),

    returning_member: z.enum(["yes", "no"], {
        message: "Please select a value."
    })
})

type OnboardingFormSchema = z.infer<typeof UserZodObj>

export { UserZodObj, type OnboardingFormSchema }
