import { UserDataFromUser } from '../../types/User';
import { UserDataForm } from '../UserDataForm/UserDataForm';

export default function EventRegistrationGuest({
    onSubmit,
}: {
    onSubmit: (data: UserDataFromUser) => Promise<void>;
}) {
    return (
        <div>
            <UserDataForm onSubmit={onSubmit} buttonText="Continue" responses={{}} />
        </div>
    );
}
