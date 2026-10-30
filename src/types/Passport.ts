// One stamp in the Event Passport: an event the student attended
type PassportBadge = {
    eventId: string;
    name: string;
    icon: string | null;
    date: string;
};

export type { PassportBadge };
