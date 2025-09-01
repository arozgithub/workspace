import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import { getPriorityColor } from '@/lib/jobUtils';
import StatusBadge from './StatusBadge';
import { MapPin, User, Phone, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (jobId: string, status: Job['status'], reason?: string) => void;
}

export default function JobCard({ job, onUpdateStatus }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {job.jobNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {job.customer}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={job.status} reason={job.reason} />
            <Badge className={getPriorityColor(job.priority)}>
              {job.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span>{job.site}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <span>{job.engineer || 'Unassigned'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-muted-foreground" />
            <span>{job.contact.name} - {job.contact.number}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span>Logged: {format(job.dateLogged, 'HH:mm')}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Wrench size={16} className="text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">{job.jobType} - {job.category}</p>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        </div>
        
        {job.status !== 'green' && (
          <div className="flex gap-2 pt-2 border-t">
            {job.status === 'red' && !job.dateAccepted && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(job.id, 'amber')}
                className="text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                Accept Job
              </Button>
            )}
            
            {job.status === 'amber' && job.dateAccepted && !job.dateOnSite && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(job.id, 'green')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                Mark On Site
              </Button>
            )}
            
            {job.dateOnSite && !job.dateCompleted && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(job.id, 'green')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                Complete Job
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}