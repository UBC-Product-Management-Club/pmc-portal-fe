import { FieldError, UseFormRegister } from "react-hook-form";

// Types defined for the onboarding form.
// Possible inputs for the Onboarding Form
// Needs to match OnboardingFormSchema. Some fields are optional since
// they depend on previous answers. E.g. Not uni student -> no year/faculty
export type FormData = {
    first_name: string
    last_name: string
    pronouns: string
    ubc_student: "yes" | "no, other uni" | "no, other"
    student_id?: number | undefined
    university?: string | undefined
    year?: "1" | "2" | "3" | "4" | "5+" | undefined
    faculty?: string | undefined
    major?: string | undefined
    why_pm: string
    returning_member: "yes" | "no"
};

export type FormInputProps = {
    type: string
    placeholder: string
    name: ValidFieldNames
    register: UseFormRegister<FormData>
    error: FieldError | undefined
    valueAsNumber?: boolean
};
  

export type ValidFieldNames = "first_name" | "last_name" | "pronouns" | "student_id" | "university" |
                              "year" | "faculty" | "major" | "why_pm" | "returning_member";