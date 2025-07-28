import EmailRaffleFormInput from '../../components/FormInput/EmailRaffleFormInput';
import { useForm } from 'react-hook-form';
import '../Activities/EnterEmail.css';

export const localEmail = localStorage.getItem('email');

export type RaffleFormData = {
    email: string;
};

interface enterEmailPropType {
    onSubmit: (data: RaffleFormData) => void;
}

export default function EnterEmail({ onSubmit }: enterEmailPropType) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RaffleFormData>();

    return (
        <form className="raffle-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Start tracking your raffle by entering your email address</h2>
            <div className="raffle-email-form">
                <EmailRaffleFormInput
                    type="email"
                    name="email"
                    placeholder={'Enter your email'}
                    register={register}
                    error={errors.email}
                />
            </div>
            <button className="submit-button pmc-gradient-background raffle-button" type="submit">
                Submit
            </button>
        </form>
    );
}
