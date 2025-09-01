
import React, { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Wrench } from 'lucide-react';
import { JobFormData, Contact } from '@/types/job';
import { mockEngineers, mockJobTrades, mockTags } from '@/lib/jobUtils';

interface JobLogFormProps {
  customerData: {
    customer: string;
    site: string;
    contact: Contact;
  };
  onSave: (jobData: JobFormData) => Promise<void> | void;
  onBack: () => void;
}

const JobLogForm: React.FC<JobLogFormProps> = ({ customerData, onSave, onBack }) => {
  const [jobData, setJobData] = useState<Partial<JobFormData>>({
    description: '',
    jobType: 'Maintenance',
    category: 'Electrical',
    priority: 'Medium',
    targetCompletionTime: 60,
    engineer: '',
    project: '',
    primaryJobTrade: '',
    secondaryJobTrades: [],
    customerOrderNumber: '',
    referenceNumber: '',
    jobOwner: '',
    tags: [],
    jobRef1: '',
    jobRef2: '',
    requiresApproval: false,
    preferredAppointmentDate: null,
    startDate: null,
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [engineerOpen, setEngineerOpen] = useState(false);
  const [primaryTradeOpen, setPrimaryTradeOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const isFormValid = jobData.description?.trim() !== '' && jobData.jobOwner?.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Please fill all required fields (Description, Job Owner).');
      return;
    }
    setSubmitting(true);
    try {
      const completeJobData: JobFormData = {
        ...customerData,
        ...jobData as JobFormData
      };
      await onSave(completeJobData);
      toast.success('Job logged successfully!');
    } catch (err) {
      toast.error('Failed to log job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean | Date | null | string[]
  ) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = jobData.tags || [];
    if (currentTags.includes(tag)) {
      handleInputChange('tags', currentTags.filter(t => t !== tag));
    } else {
      handleInputChange('tags', [...currentTags, tag]);
    }
  };

  const handleSecondaryTradeToggle = (trade: string) => {
    const currentTrades = jobData.secondaryJobTrades || [];
    if (currentTrades.includes(trade)) {
      handleInputChange('secondaryJobTrades', currentTrades.filter(t => t !== trade));
    } else {
      handleInputChange('secondaryJobTrades', [...currentTrades, trade]);
    }
  };

  const selectedEngineer = mockEngineers.find(eng => eng.name === jobData.engineer);

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Log New Job
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {customerData.customer} - {customerData.site}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Job Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    value={jobData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    required
                    className="h-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-sm font-medium">Job Type *</Label>
                  <Select
                    value={jobData.jobType}
                    onValueChange={value => handleInputChange('jobType', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Installation">Installation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <Select
                    value={jobData.category}
                    onValueChange={value => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">Priority *</Label>
                  <Select
                    value={jobData.priority}
                    onValueChange={value => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineer" className="text-sm font-medium">Engineer</Label>
                  <Select
                    value={jobData.engineer}
                    onValueChange={value => handleInputChange('engineer', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEngineers.map(eng => (
                        <SelectItem key={eng.name} value={eng.name}>{eng.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project" className="text-sm font-medium">Project</Label>
                  <Input
                    id="project"
                    value={jobData.project}
                    onChange={e => handleInputChange('project', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryJobTrade" className="text-sm font-medium">Primary Job Trade</Label>
                  <Select
                    value={jobData.primaryJobTrade}
                    onValueChange={value => handleInputChange('primaryJobTrade', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockJobTrades.map(trade => (
                        <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Secondary Job Trades</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockJobTrades.map(trade => (
                      <Badge
                        key={trade}
                        variant={jobData.secondaryJobTrades?.includes(trade) ? 'default' : 'outline'}
                        onClick={() => handleSecondaryTradeToggle(trade)}
                        className="cursor-pointer"
                      >
                        {trade}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerOrderNumber" className="text-sm font-medium">Customer Order Number</Label>
                  <Input
                    id="customerOrderNumber"
                    value={jobData.customerOrderNumber}
                    onChange={e => handleInputChange('customerOrderNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber" className="text-sm font-medium">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={jobData.referenceNumber}
                    onChange={e => handleInputChange('referenceNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobOwner" className="text-sm font-medium">Job Owner *</Label>
                  <Input
                    id="jobOwner"
                    value={jobData.jobOwner}
                    onChange={e => handleInputChange('jobOwner', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={jobData.tags?.includes(tag) ? 'default' : 'outline'}
                        onClick={() => handleTagToggle(tag)}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobRef1" className="text-sm font-medium">Job Ref 1</Label>
                  <Input
                    id="jobRef1"
                    value={jobData.jobRef1}
                    onChange={e => handleInputChange('jobRef1', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobRef2" className="text-sm font-medium">Job Ref 2</Label>
                  <Input
                    id="jobRef2"
                    value={jobData.jobRef2}
                    onChange={e => handleInputChange('jobRef2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCompletionTime" className="text-sm font-medium">Target Completion Time (mins)</Label>
                  <Input
                    id="targetCompletionTime"
                    type="number"
                    value={jobData.targetCompletionTime}
                    onChange={e => handleInputChange('targetCompletionTime', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredAppointmentDate" className="text-sm font-medium">Preferred Appointment Date</Label>
                  <Input
                    id="preferredAppointmentDate"
                    type="date"
                    value={jobData.preferredAppointmentDate ? jobData.preferredAppointmentDate.toString().slice(0,10) : ''}
                    onChange={e => handleInputChange('preferredAppointmentDate', e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={jobData.startDate ? jobData.startDate.toString().slice(0,10) : ''}
                    onChange={e => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={jobData.endDate ? jobData.endDate.toString().slice(0,10) : ''}
                    onChange={e => handleInputChange('endDate', e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Requires Approval</Label>
                  <Checkbox
                    checked={jobData.requiresApproval}
                    onCheckedChange={checked => handleInputChange('requiresApproval', !!checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lock Visit Date/Time</Label>
                  <Checkbox
                    checked={jobData.lockVisitDateTime}
                    onCheckedChange={checked => handleInputChange('lockVisitDateTime', !!checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Deploy to Mobile</Label>
                  <Checkbox
                    checked={jobData.deployToMobile}
                    onCheckedChange={checked => handleInputChange('deployToMobile', !!checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Is Recurring Job</Label>
                  <Switch
                    checked={jobData.isRecurringJob}
                    onCheckedChange={checked => handleInputChange('isRecurringJob', !!checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Completion Time From Engineer Onsite</Label>
                  <Checkbox
                    checked={jobData.completionTimeFromEngineerOnsite}
                    onCheckedChange={checked => handleInputChange('completionTimeFromEngineerOnsite', !!checked)}
                  />
                </div>
              </div>
            </div>
            {/* ...existing code... */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={!isFormValid || submitting} className="px-6 py-2 text-base font-semibold">
                {submitting ? 'Logging...' : 'Log Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobLogForm;
                       