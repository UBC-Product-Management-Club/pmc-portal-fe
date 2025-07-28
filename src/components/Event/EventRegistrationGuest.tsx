import { UserDataFromUser } from '../../types/User';
import { UserDataForm } from '../UserDataForm/UserDataForm';

export default function EventRegistrationGuest({
    onSubmit,
}: {
    onSubmit: (data: UserDataFromUser) => Promise<void>;
}) {
    return (
        <div className={'form-bg-dark-blue'}>
            <UserDataForm onSubmit={onSubmit} buttonText="Continue" responses={{}} />
        </div>
    );
}
