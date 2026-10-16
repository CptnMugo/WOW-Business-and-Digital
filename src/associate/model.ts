import type {
  Opportunity,
  AssociateEligibility,
} from "../../server/associatePortalRules";
export type Member = {
  accessVersion?: number;
  id: string;
  name: string;
  email: string;
  eligibility: AssociateEligibility;
  onboardingApproved: boolean;
  inductionRead: boolean;
  inductionEvidence: string;
  inductionRsvp: string;
  profile: string;
  invitedAt: string;
  version: number;
};
export type Work = Opportunity & {
  title: string;
  summary: string;
  outputs: string;
  hours: string;
  duration: string;
  fee: string;
  version: number;
};
export type Proposal = {
  id: string;
  memberId: string;
  workId: string;
  kind: "eoi" | "bid";
  text: string;
  createdAt: string;
  status: "submitted" | "awarded" | "unsuccessful" | "withdrawn";
};
export type Message = {
  id: string;
  actor: string;
  text: string;
  createdAt: string;
};
export type PrivateFile = {
  id: string;
  name: string;
  storageName: string;
  size: number;
  actor: string;
  createdAt: string;
};
export type Task = { id: string; title: string; due: string; done: boolean };
export type Assignment = {
  id: string;
  workId: string;
  memberId: string;
  title: string;
  fee: string;
  startsAt: string;
  finishesAt: string;
  status: "assigned" | "in-progress" | "submitted" | "completed";
  messages: Message[];
  files: PrivateFile[];
  tasks: Task[];
  deliverables: Message[];
  invoice?: {
    number: string;
    amount: string;
    submittedAt: string;
    status: "submitted" | "accepted" | "disputed" | "paid";
    dueAt?: string;
    note: string;
  };
  version: number;
};
export type Notice = {
  id: string;
  memberId: string;
  subject: string;
  text: string;
  createdAt: string;
  key: string;
  email: "queued" | "sending" | "accepted" | "failed";
  attempts: number;
  lastAttempt?: number;
};
