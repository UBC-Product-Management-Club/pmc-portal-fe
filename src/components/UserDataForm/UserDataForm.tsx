import { UserSchema, UserZodObj } from "../OnboardingForm/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import FormInput from "../FormInput/FormInput";
import "./UserDataForm.css";

type UserDataFormProps = {
  onSubmit: (data: UserSchema) => Promise<void>;
  excludeReturningAndWhyPM?: boolean;
  includeEmail?: boolean;
  hasWaiver?: boolean;
};

export function UserDataForm({
  onSubmit,
  excludeReturningAndWhyPM,
  includeEmail,
  hasWaiver,
}: UserDataFormProps) {
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSchema>({
    defaultValues: excludeReturningAndWhyPM
      ? {
          why_pm: "-",
          returning_member: "no",
        }
      : {},
    resolver: zodResolver(UserZodObj),
  });

  const student_status = watch("ubc_student");
  useEffect(() => {
    if (student_status === "no, other uni") {
      // Other university student
      unregister("student_id");
    } else {
      // Not a university student
      unregister("student_id");
      unregister("year");
      unregister("faculty");
      unregister("major");
    }
  }, [student_status]);

  const handleFormSubmit = (data: UserSchema) => {
    onSubmit(data);
  };

  return (
    <form
      autoComplete="off"
      className="onboarding-form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="form-content">
        <div className="form-group">
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
          <div className={"form-group-sm"}>
            <FormInput
              type={"text"}
              placeholder={"Pronouns"}
              name={"pronouns"}
              register={register}
              error={errors.pronouns}
            />
          </div>
        </div>

        {includeEmail && (
          <FormInput
            type={"text"}
            placeholder={"Email"}
            name={"email"}
            register={register}
            error={errors.email}
          />
        )}

        <div>
          <select
            required
            className="form-select select-ubcstudent"
            {...register("ubc_student", { required: "please select a value" })}
          >
            <option value="" hidden>
              Are you a UBC student?
            </option>
            <option value={"yes"}>Yes, I'm a UBC student.</option>
            <option value={"no, other uni"}>
              No, I'm from another university.
            </option>
            <option value={"no, other"}>
              No, I'm not a university student.
            </option>
          </select>
          {errors.ubc_student && <span>{errors.ubc_student.message}</span>}
        </div>

        {student_status === "no, other uni" && (
          <FormInput
            type="text"
            placeholder="University"
            name="university"
            register={register}
            error={errors.university}
          />
        )}

        {student_status === "yes" && (
          <div className="form-group">
            <FormInput
              type="text"
              placeholder="Student number"
              name="student_id"
              register={register}
              error={errors.student_id}
            />
          </div>
        )}

        {student_status !== "no, other" && (
          <div className="form-group">
            <div className="form-group-sm">
              <select
                className={"form-select"}
                required
                {...register("year", { required: "please select a value" })}
              >
                <option value="" hidden>
                  Year
                </option>
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
        )}

        {!excludeReturningAndWhyPM && (
          <>
            <div>
              <select
                className={"form-select"}
                required
                {...register("returning_member", {
                  required: "Please select a value.",
                })}
              >
                <option value="" hidden>
                  Are you a returning member?
                </option>
                <option value="yes">Yes, I'm a returning PMC member.</option>
                <option value="no">No, I'm new to PMC.</option>
              </select>
              {errors.returning_member && (
                <span>{errors.returning_member.message}</span>
              )}
            </div>

            <div className="form-group">
              <FormInput
                type="text"
                placeholder="Why Product Management?"
                name="why_pm"
                register={register}
                error={errors.major}
              />
            </div>
          </>
        )}

        {hasWaiver && student_status == "yes" && (
          <div className="onboarding-waiver">
            <h3>
              Please sign the following form:
              <a
                href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                target="_blank"
                className="onboarding-waiver-link"
              >
                {" "}
                Insurance/Liability Waiver.
              </a>
            </h3>

            <div className="waiver-checkbox-row">
              <h3>I have signed the Insurance/Liability Waiver form.</h3>
              <input
                type="checkbox"
                className="onboarding-waiver-checkbox"
                required
              />
            </div>
          </div>
        )}

        <button className="submit-button pmc-gradient-background" type="submit">
          Continue
        </button>
      </div>
    </form>
  );
}
