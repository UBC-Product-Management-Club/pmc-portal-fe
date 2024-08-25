import "./OnboardingForm.css"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../FormInput/FormInput"
import { useNavigate } from "react-router-dom"
import { type User } from "firebase/auth"
import { loginBody } from "../../types/api"
import { useEffect } from "react"
import PMCLogo from "../../assets/pmclogo.svg"


const UserZodObj = z.object({
    first_name: z.string().min(1,{
        message: "Please enter a first name."
    }),

    last_name: z.string().min(1,{
        message: "Please enter a last name."
    }),

    pronouns: z.string().min(1,{
        message: "Please enter your pronouns."
    }),

    ubc_student: z.enum(["yes","no, other uni","no, other"],{
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
    }),

    year: z.enum(["1","2","3","4","5+"], {
        message: "Please select a value."
    }).optional(),

    faculty: z.string().min(1,{
        message: "Please enter a valid faculty."
    }).optional(),

    major: z.string().min(1,{
        message: "Please enter a valid major."
    }).optional(),

    why_pm: z.string().min(1,{
        message: "Why would you like to join PMC?"
    }).max(300, {
        message: "Maximum 300 characters."
    }),

    returning_member: z.enum(["yes","no"],{
        message: "Please select a value."
    })
})

type UserSchema = z.infer<typeof UserZodObj>

/**
 * 
 * @param user
 * The currently logged in user via Google SSO that needs to be onboarded 
 * 
 * @param creds
 * Login credentials such as userUID and idToken needed to exchange for session cookie. 
 * These credentials are needed as the login method is called after onboarding. 
 * This will log the user in after onboarding.
 * 
 */
export default function OnboardingForm({ user, creds }: { user: User, creds: loginBody }) {
    const {
        register,
        unregister,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<UserSchema>({
        resolver: zodResolver(UserZodObj)
      })

    const student_status = watch("ubc_student")

    useEffect(() => {
        if (student_status === "no, other uni") {
            // Other university student
            unregister("student_id")
        } else {
            // Not a university student
            unregister("student_id")
            unregister("year")
            unregister("faculty")
            unregister("major")
        }
    },[student_status])

    const onSubmit = async (data: UserSchema) => {
        // fetch onboarding endpoint
        const onboarding = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`,{
            method: "POST",
            credentials: "include",
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
                creds: creds,
                userDoc: {
                    displayName: user.displayName,
                    email: user.email,
                    pfp: user.photoURL,
                    ... data
                }
            })
        })
        
        if (onboarding.ok) {
            navigateTo("/dashboard")
        } else {
            // show error component
            const jsonresp = await onboarding.json()
            console.log(jsonresp)

        }
    }

    const navigateTo = useNavigate()

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <img className="onboarding-content--logo" src={PMCLogo}/>
                <h1 className="onboarding-content-header pmc-gradient-text">Create your account</h1>
                <form autoComplete="off" className="onboarding-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="onboarding-form-content">
                        <div className="onboarding-form-content--row">
                            <FormInput
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                register={register}
                                error={errors.first_name}
                            />
                            <FormInput
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                register={register}
                                error={errors.last_name}
                            />
                            <div style={{"width": "16rem"}}>
                            <FormInput
                                type={"text"}
                                placeholder={"Pronouns"}
                                name={"pronouns"}
                                register={register}
                                error={errors.pronouns}
                            />
                            </div>
                        </div>

                        <div className="onboarding-form-select--container">
                            <select required className="select-ubcstudent" {...register("ubc_student",{required: "please select a value"})}>
                                <option value="" hidden>Are you a UBC student?</option>
                                <option value={"yes"}>Yes, I'm a UBC student.</option>
                                <option value={"no, other uni"}>No, I'm from another university.</option>
                                <option value={"no, other"}>No, I'm not a university student.</option>
                            </select>
                            {errors.ubc_student && <span>{errors.ubc_student.message}</span>}
                        </div>

                        {student_status === "no, other uni" &&
                            <FormInput
                                type="text"
                                placeholder="University"
                                name="university"
                                register={register}
                                error={errors.university}
                            />
                        }

                        {student_status === "yes" && 
                            <div className="onboarding-form-content--row">
                                <FormInput
                                    type="text"
                                    placeholder="Student number"
                                    name="student_id"
                                    register={register}
                                    error={errors.student_id}
                                />
                            </div>

                        }

                        {student_status !== "no, other" && 
                            <div className="onboarding-form-content--row">
                                <div className="onboarding-form-select--container">
                                    <select style={{"width": "7rem"}} required {...register("year",{required: "please select a value"})}>
                                        <option value="" hidden>Year</option>
                                        <option value={"1"}>1</option>
                                        <option value={"2"}>2</option>
                                        <option value={"3"}>3</option>
                                        <option value={"4"}>4</option>
                                        <option value={"5+"}>5+</option>
                                    </select>
                                    {errors.year && <span>{errors.year.message}</span>}
                                </div>

                                <FormInput
                                    type="text"
                                    placeholder="Faculty"
                                    name="faculty"
                                    register={register}
                                    error={errors.faculty}
                                />
                                <FormInput
                                    type="text"
                                    placeholder="Major"
                                    name="major"
                                    register={register}
                                    error={errors.major}
                                />
                            </div>
                        }       
                        <div className="onboarding-form-select--container">
                            <select required {...register("returning_member",{required: "Please select a value."})}>
                                <option value="" hidden>Are you a returning member?</option>
                                <option value="yes">Yes, I'm a returning PMC member.</option>
                                <option value="no">No, I'm new to PMC.</option>
                            </select>
                            {errors.returning_member && <span>{errors.returning_member.message}</span>}
                        </div>

                        <div className="onboarding-form-content--row">
                            <FormInput
                                type="text"
                                placeholder="Why Product Management?"
                                name="why_pm"
                                register={register}
                                error={errors.major}
                            />
                        </div>
                    </div>
                    <button className="submit-button pmc-gradient-background" type="submit">Continue</button>
                </form>
            </div>
        </div>
    )
}