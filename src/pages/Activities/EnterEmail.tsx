import EmailRaffleFormInput from '../../components/FormInput/EmailRaffleFormInput';
import { useForm } from 'react-hook-form';

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
    const formClass = 'flex w-full flex-col justify-center';
    const emailFormClass = 'mb-6';
    const submitClass =
        'rounded-lg bg-[linear-gradient(90deg,#DCE1FF_0%,#DDD7FF_23%,#DDD2FF_59%,#8D9BEB_87%)] px-4 py-2 text-base font-bold text-pmc-midnight-blue';

    return (
        <form className={formClass} onSubmit={handleSubmit(onSubmit)}>
            <h2>Start tracking your raffle by entering your email address</h2>
            <div className={emailFormClass}>
                <EmailRaffleFormInput
                    type="email"
                    name="email"
                    placeholder={'Enter your email'}
                    register={register}
                    error={errors.email}
                />
            </div>
            <button className={submitClass} type="submit">
                Submit
            </button>
        </form>
    );
}
