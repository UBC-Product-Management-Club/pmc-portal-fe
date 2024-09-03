import Payment from "../Payment/Payment";
import {PaymentProvider} from "../../providers/Payment/PaymentProvider";

type EventPaymentProps = {
    onPaymentSuccess: () => void;
    isGuest: boolean;
    eventId: string;
    memberPrice: number
    nonMemberPrice: number
}

export function EventPayment(props: EventPaymentProps) {
    const fee = props.isGuest ? props.nonMemberPrice : props.memberPrice;
    const prompt = props.isGuest
        ? `To participate in this event, non-members are required to pay a $${fee} fee.`
        : `To participate in this event, members are required to pay a $${fee} fee.`;

    return (
        <PaymentProvider
            FormOptions={{
                prompt: prompt,
                type: "event",
                eventId: props.eventId,
                onSuccess: props.onPaymentSuccess
            }} SuccessOptions={{
            heading: "Payment successful",
            subheading: `We've processed your $${fee} charge.`,
            continueBtnText: "Close"
        }}
        >
            <Payment />
        </PaymentProvider>
    )
}