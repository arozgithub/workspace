import { Job } from '@/types/job';
import { differenceInMinutes } from 'date-fns';

export const updateJobStatus = (job: Job): Job => {
  const now = new Date();
  
  // If job is completed, keep it green
  if (job.dateCompleted) {
    return { ...job, status: 'green' };
  }
  
  // If engineer accepted but not on site yet
  if (job.dateAccepted && !job.dateOnSite) {
    const timeSinceAccepted = differenceInMinutes(now, job.dateAccepted);
    
    if (timeSinceAccepted > 60) {
      return {
        ...job,
        status: 'red',
        reason: 'Engineer not on site within 1 hour of acceptance'
      };
    } else if (timeSinceAccepted > 20) {
      return {
        ...job,
        status: 'amber',
        reason: 'Engineer traveling - over 20 minutes since acceptance'
      };
    }
  }
  
  // If engineer is on site but work not completed
  if (job.dateOnSite && !job.dateCompleted) {
    const timeSinceOnSite = differenceInMinutes(now, job.dateOnSite);
    
    if (timeSinceOnSite > job.targetCompletionTime) {
      return {
        ...job,
        status: 'red',
        reason: 'Work not completed within target time'
      };
    } else {
      return { ...job, status: 'green' };
    }
  }
  
  return job;
};

export const getStatusColor = (status: Job['status']) => {
  switch (status) {
    case 'green':
      return 'bg-green-500';
    case 'amber':
      return 'bg-amber-500';
    case 'red':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPriorityColor = (priority: Job['priority']) => {
  switch (priority) {
    case 'Critical':
      return 'text-red-600 bg-red-50';
    case 'High':
      return 'text-orange-600 bg-orange-50';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'Low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const generateJobNumber = (): string => {
  return `JL-${Date.now()}`;
};

export const mockCustomers = [
  { id: 1, name: 'Acme Ltd', sites: ['Site A - Manchester', 'Site B - Birmingham'] },
  { id: 2, name: 'Beta Corp', sites: ['Site C - London', 'Site D - Edinburgh'] },
  { id: 3, name: 'Gamma Inc', sites: ['Site E - Bristol', 'Site F - Leeds'] },
  { id: 4, name: 'Delta Solutions', sites: ['Site G - Cardiff', 'Site H - Glasgow'] },
  { id: 5, name: 'Echo Systems', sites: ['Site I - Liverpool', 'Site J - Newcastle'] },
];

export const mockEngineers = [
  'John Doe', 'Tom Brown', 'Sara Lee', 'Ali Hamza', 'Jane Smith', 'Mike Johnson'
];