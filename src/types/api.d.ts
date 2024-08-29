// STORE API REQUEST/RESPONSE TYPES HERE

type userDocument = {
  first_name: string;
  last_name: string;
  pronouns: string;
  email: string; // from google
  pfp: string; // from google
  displayName: string; // from Google
  university?: string;
  student_id?: number;
  year?: string; // "5+"
  faculty?: string;
  major?: string;
  why_pm: string;
  returning_member: string;
};

type loginBody = {
  userUID: string;
  idToken: string;
};

type onboardingBody = {
  creds: loginBody;
  userDoc: userDocument;
};

type eventType = {
  event_Id: string;
  name: string;
  date: Date;
  location: string;
  description: string;
  media: string[];
  member_price: number;
  non_member_price: number;
  attendees: AttendeeType[];
  member_only: boolean;
};

type attendeeType = {
  attendee_Id: string;
  is_member: boolean;
  member_Id: string;
  event_Id: string;
  first_name: string;
  last_name: string;
  student_num: number;
  email: string;
  year_level: number;
  major: string;
  faculty: string;
  familiarity: "beginner" | "intermediate" | "advanced" | "mentor";
  found_out: string;
  dietary: string;
};

type paymentIntentResponse = {
  payment_secret: string;
};

type paymentInfo = {
  id: string;
  amount: number;
  status: string;
  created: Timestamp;
};

type addTransactionBody = {
  type: "membership" | "event";
  member_id?: string;
  attendee_id?: string;
  payment: paymentInfo;
};

export {
  userDocument,
  loginBody,
  onboardingBody,
  eventType,
  attendeeType,
  paymentIntentResponse,
  addTransactionBody,
  paymentInfo,
};
