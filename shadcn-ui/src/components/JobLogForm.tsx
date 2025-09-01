import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Wrench, Clock, AlertTriangle } from 'lucide-react';
import { JobFormData, Contact } from '@/types/job';
import { mockEngineers } from '@/lib/jobUtils';

interface JobLogFormProps {
  customerData: {
    customer: string;
    site: string;
    contact: Contact;
  };
  onSave: (jobData: JobFormData) => void;
  onBack: () => void;
}

export default function JobLogForm({ customerData, onSave, onBack }: JobLogFormProps) {
  const [jobData, setJobData] = useState({
    description: '',
    jobType: 'Maintenance' as JobFormData['jobType'],
    category: 'Electrical' as JobFormData['category'],
    priority: 'Medium' as JobFormData['priority'],
    targetCompletionTime: 60,
    engineer: '',
    project: ''
  });

  const isFormValid = jobData.description.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const completeJobData: JobFormData = {
        ...customerData,
        ...jobData
      };
      onSave(completeJobData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
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
            {/* Job Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wrench size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Job Details</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue or work required in detail..."
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="resize-none"
                  required
                />
              </div>
            </div>

            {/* Job Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobType" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select
                  value={jobData.jobType}
                  onValueChange={(value) => handleInputChange('jobType', value)}
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
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={jobData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
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
                <Label htmlFor="priority" className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle size={14} />
                  Priority
                </Label>
                <Select
                  value={jobData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
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
            </div>

            {/* Assignment & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="engineer" className="text-sm font-medium">
                  Assign Engineer
                </Label>
                <Select
                  value={jobData.engineer}
                  onValueChange={(value) => handleInputChange('engineer', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEngineers.map(engineer => (
                      <SelectItem key={engineer} value={engineer}>
                        {engineer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetTime" className="text-sm font-medium flex items-center gap-2">
                  <Clock size={14} />
                  Target Time (minutes)
                </Label>
                <Input
                  id="targetTime"
                  type="number"
                  min="15"
                  max="480"
                  value={jobData.targetCompletionTime}
                  onChange={(e) => handleInputChange('targetCompletionTime', parseInt(e.target.value) || 60)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-medium">
                  Project Reference
                </Label>
                <Input
                  id="project"
                  placeholder="Project name or number"
                  value={jobData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {/* Contact Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Name:</span> {customerData.contact.name}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {customerData.contact.number}
                </div>
                {customerData.contact.email && (
                  <div>
                    <span className="font-medium">Email:</span> {customerData.contact.email}
                  </div>
                )}
                {customerData.contact.relationship && (
                  <div>
                    <span className="font-medium">Role:</span> {customerData.contact.relationship}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 h-12"
              >
                Back to Customer Details
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={!isFormValid}
              >
                <Save size={18} className="mr-2" />
                Log Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}