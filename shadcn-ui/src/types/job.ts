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
}

export interface JobFormData {
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
}

export interface Customer {
  id: number;
  name: string;
  sites: string[];
}