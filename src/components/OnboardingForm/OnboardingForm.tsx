import "./OnboardingForm.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import FormInput from "../FormInput/FormInput"
import { OnboardingFormSchema, UserZodObj } from "./types"
import { OnboardingContext } from "./Context"

export default function OnboardingForm() {
    const {
        register,
        unregister,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<OnboardingFormSchema>({
        resolver: zodResolver(UserZodObj)
    })

    const student_status = watch("ubc_student")
    const { setUserInfo, setCurrPage } = useContext(OnboardingContext)

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
    }, [student_status])

    const submit = async (data: OnboardingFormSchema) => {
        // update parent state to save user input
        console.log()
        setUserInfo(data)
        setCurrPage("payment")
        // fetch onboarding endpoint
        // save state of current user info
        // const onboarding = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: {
        //         'Content-type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         creds: creds,
        //         userDoc: {
        //             displayName: user.displayName,
        //             email: user.email,
        //             pfp: user.photoURL,
        //             ...data
        //         }
        //     })
        // })


        // if (onboarding.ok) {
        //     // continue to payment
        //     // navigateTo("/dashboard")
        //     console.log("Go to PaymentForm")
        // } else {
        //     // show error component
        //     const jsonresp = await onboarding.json()
        //     console.log(jsonresp)

        // }
    }

    // const navigateTo = useNavigate()

    return (
        <form autoComplete="off" className="onboarding-form" onSubmit={handleSubmit(submit)}>
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
                    <select required {...register("returning_member", { required: "Please select a value." })}>
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
    )
}