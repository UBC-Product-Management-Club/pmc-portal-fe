import { ApiError } from '../../service/RestClient';

const APPLICATION_MESSAGES: Record<string, string> = {
    EVENT_FULL: 'This event filled up before you submitted.',
    CLOSED: 'Applications closed before you submitted.',
    NOT_OPEN: "Applications aren't open yet.",
    ALREADY_APPLIED: "You've already applied to this event.",
};

const PAYMENT_MESSAGES: Record<string, string> = {
    HOLD_EXPIRED:
        'Your payment window has closed. Contact the organizers if you still want to attend.',
    NOT_ACCEPTED: "There's nothing to pay for yet.",
    ALREADY_REGISTERED: "You're already registered.",
    PAYMENT_PROCESSING: 'Your payment is still processing. Give it a minute before trying again.',
    EVENT_FULL: 'This event is full.',
};

const messageFor = (messages: Record<string, string>, error: unknown, fallback: string) => {
    const code = error instanceof ApiError ? error.code : undefined;
    return (code && messages[code]) ?? fallback;
};

export const applicationErrorMessage = (error: unknown) =>
    messageFor(APPLICATION_MESSAGES, error, "Couldn't submit. Please try again.");

export const paymentErrorMessage = (error: unknown) =>
    messageFor(PAYMENT_MESSAGES, error, "Couldn't start checkout. Please try again.");
