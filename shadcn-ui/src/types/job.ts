export interface Contact {
  name: string;
  number: string;
  email: string;
  relationship: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  site: string;
  engineer: string;
  contact: Contact;
  status: 'green' | 'amber' | 'red';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dateLogged: Date;
  dateAccepted: Date | null;
  dateOnSite: Date | null;
  dateCompleted: Date | null;
  description: string;
  jobType: 'Maintenance' | 'Repair' | 'Installation' | 'Emergency' | 'Inspection';
  category: 'Electrical' | 'Mechanical' | 'Plumbing' | 'HVAC' | 'General';
  targetCompletionTime: number; // minutes
  reason: string | null;
  // Additional JobLogic fields
  primaryJobTrade?: string;
  secondaryJobTrades?: string[];
  customerOrderNumber?: string;
  referenceNumber?: string;
  jobOwner?: string;
  tags?: string[];
  jobRef1?: string;
  jobRef2?: string;
  requiresApproval?: boolean;
  preferredAppointmentDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  lockVisitDateTime?: boolean;
  deployToMobile?: boolean;
  isRecurringJob?: boolean;
  completionTimeFromEngineerOnsite?: boolean;
}

export interface JobFormData {
  jobNumber: string;
  dateLogged: Date;
  status: 'green' | 'amber' | 'red';
  customer: string;
  site: string;
  contact: Contact;
  description: string;
  jobType: Job['jobType'];
  category: Job['category'];
  priority: Job['priority'];
  targetCompletionTime: number;
  engineer: string;
  project: string;
  // Additional fields
  primaryJobTrade: string;
  secondaryJobTrades: string[];
  customerOrderNumber: string;
  referenceNumber: string;
  jobOwner: string;
  tags: string[];
  jobRef1: string;
  jobRef2: string;
  requiresApproval: boolean;
  preferredAppointmentDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  lockVisitDateTime: boolean;
  deployToMobile: boolean;
  isRecurringJob: boolean;
  completionTimeFromEngineerOnsite: boolean;
}

export interface Customer {
  id: number;
  name: string;
  sites: string[];
}

export interface Engineer {
  name: string;
  status: 'available' | 'busy' | 'holiday' | 'offline';
  avatar?: string;
}