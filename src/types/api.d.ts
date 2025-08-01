// STORE API REQUEST/RESPONSE TYPES HERE

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
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  media: string[];
  member_price: number;
  non_member_price: number;
  attendee_Ids: string[];
  member_only: boolean;
  maxAttendee: number;
  eventFormId: string;
};

type attendeeType = {
  attendee_Id: string;
  is_member: boolean;
  member_Id: string;
  event_Id: string;
  first_name: string;
  last_name: string;
  student_id?: number;
  email: string;
  year?: string;
  major?: string;
  faculty?: string;
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
  loginBody,
  onboardingBody,
  eventType,
  attendeeType,
  paymentIntentResponse,
  addTransactionBody,
  paymentInfo,
};
