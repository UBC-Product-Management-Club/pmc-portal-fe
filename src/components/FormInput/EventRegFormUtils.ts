import { z } from "zod"
import { FieldError, UseFormRegister } from "react-hook-form";

// Types defined for the onboarding form.
// Possible inputs for the Onboarding Form
// Needs to match OnboardingFormSchema. Some fields are optional since
// they depend on previous answers. E.g. Not uni student -> no year/faculty
export type EventRegFormData = {
    familiarity: "beginner" | "intermediate" | "advanced" | "mentor"
    found_out: "instagram" | "linkedin" | "newsletter" | "website" | "friend-or-colleague" | "partner-event" | "pmc-booth" | "other"
    dietary: string
    expectation: string
};

export type EventRegFormInputProps = {
    type: string
    placeholder: string
    name: EventRegValidFieldNames
    register: UseFormRegister<EventRegFormData>
    error: FieldError | undefined
    valueAsNumber?: boolean
};


export type EventRegValidFieldNames = "familiarity" | "found_out" | "dietary" | "expectation";

const EventRegZodObj = z.object({
    familiarity: z.enum(["beginner", "intermediate", "advanced", "mentor"], {
        message: "Please select a value."
    }),
    found_out: z.enum(["instagram", "linkedin", "newsletter", "website",
    "friend-or-colleague", "partner-event", "pmc-booth", "other"], {
        message: "Please select a value."
    }),
    dietary: z.string().min(1, {
        message: "Dietary restrictions"
    }).max(300, {
        message: "Maximum 300 characters."
    }),
    expectation: z.string().min(1, {
        message: "What do you hope to get out of this event?"
    }).max(300, {
        message: "Maximum 300 characters."
    })
})

type EventRegFormSchema = z.infer<typeof EventRegZodObj>

export { EventRegZodObj, type EventRegFormSchema }
