import { FieldError, UseFormRegister } from "react-hook-form";

export type FormData = {
    first_name: string
    last_name: string
    pronouns?: string
    ubc_student: "yes" | "no, other uni" | "no, other"
    university?: string
    student_id?: number
    year?: "1" | "2" | "3" | "4" | "5+"
    faculty?: string
    major?: string
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