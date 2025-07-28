import { PaymentType } from '../../service/PaymentService';
import { Payment } from '../Payment/Payment';
import { PaymentIntent } from '@stripe/stripe-js';

type EventPaymentProps = {
    onPaymentSuccess: (paymentIntent: PaymentIntent | null) => void;
    isGuest: boolean;
    eventId: string;
    memberPrice: number;
    nonMemberPrice: number;
};

export function EventPayment(props: EventPaymentProps) {
    // const fee = props.isGuest ? props.nonMemberPrice : props.memberPrice;
    // const prompt = props.isGuest
    //     ? `To participate in this event, non-members are required to pay a $${fee} fee.`
    //     : `To participate in this event, members are required to pay a $${fee} fee.`;

    return (
        <Payment
            onPayment={() => {}}
            onError={() => {}}
            options={{
                type: PaymentType.EVENT,
                eventId: props.eventId,
            }}
        />
    );
}
