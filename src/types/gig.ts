// TypeScript types for Rozgar Chain dApp

export type GigStatus = 'Waiting' | 'In Progress' | 'Submitted' | 'Completed';

export type UserRole = 'Client' | 'Freelancer' | 'None';

export interface Gig {
  id: string;
  title: string;
  description: string;
  clientAddress: string;
  freelancerAddress: string;
  paymentAmount: string; // in ETH
  paymentAmountWei: string;
  status: GigStatus;
  createdAt: number;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  action: string;
  description: string;
}

export interface CreateGigFormData {
  title: string;
  description: string;
  freelancerAddress: string;
  paymentAmount: string;
}
