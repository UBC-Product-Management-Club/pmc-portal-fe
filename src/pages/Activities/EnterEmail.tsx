import { useParams } from "react-router-dom";
import PMCLogo from "../../assets/pmclogo.svg";
import EmailRaffleFormInput from "../../components/FormInput/EmailRaffleFormInput";
import { useForm } from "react-hook-form";
import '../Activities/EnterEmail.css';

export const localEmail = localStorage.getItem("email");

type RaffleFormData = {
    email: string;
};


export default function EnterEmail() {
    const { email } = useParams<{ email: string }>(); // takes value of email - not used?
    const { register, handleSubmit, formState: { errors } } = useForm<RaffleFormData>();
    const onSubmit = (data: any) => {
        localStorage.setItem("email", data.email);
        console.log("Email sent to main raffle page to continue");
    };

    return (
        <form className="raffle-form" onSubmit={handleSubmit(onSubmit)}>
            <img src={PMCLogo} className="logo" alt={"PMC Logo"} />
            <h2>Enter your email address</h2>
            <div className="raffle-email-form">
                <EmailRaffleFormInput
                    type="email"
                    name="email"
                    placeholder={"Enter your email"}
                    register={register}
                    error={errors.email}
                />
            </div>
        </form>
    );
}
