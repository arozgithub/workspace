import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Dashboard from '@/components/Dashboard';
import CustomerDetailsForm from '@/components/CustomerDetailsForm';
import JobLogForm from '@/components/JobLogForm';
import { Job, JobFormData, Contact } from '@/types/job';
import { generateJobNumber } from '@/lib/jobUtils';
import { fetchJobs, addJob, updateJobStatus } from '@/lib/jobApi';
import { LayoutDashboard, Plus, Clock, Headphones } from 'lucide-react';
import { format } from 'date-fns';

type View = 'dashboard' | 'customer-details' | 'job-details';

export default function Index() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [customerData, setCustomerData] = useState<{
    customer: string;
    site: string;
    contact: Contact;
  } | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs from Supabase on mount
  useEffect(() => {
    fetchJobs().then(setJobs).catch(console.error);
  }, []);

  const handleCustomerNext = (data: { customer: string; site: string; contact: Contact }) => {
    setCustomerData(data);
    setCurrentView('job-details');
  };

  const handleJobSave = async (jobData: JobFormData) => {
    try {
      // Ensure required fields are set
      const safeJobData = {
        ...jobData,
        jobNumber: jobData.jobNumber || generateJobNumber(),
        dateLogged: jobData.dateLogged || new Date(),
        status: jobData.status || 'amber',
      };
      console.log('Submitting job data:', safeJobData);
      const newJob = await addJob(safeJobData);
      console.log('Job returned from Supabase:', newJob);
      setJobs(prev => [newJob, ...prev]);
      setCurrentView('dashboard');
      setCustomerData(null);
    } catch (err) {
      console.error('Failed to add job:', err);
      alert('Failed to add job: ' + (err?.message || err));
    }
  };

  const handleUpdateJobStatus = async (jobId: string, status: Job['status'], reason?: string) => {
    try {
      const updatedJob = await updateJobStatus(jobId, status, reason);
      setJobs(prevJobs => prevJobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const stats = {
    total: jobs.length,
    green: jobs.filter(j => j.status === 'green').length,
    amber: jobs.filter(j => j.status === 'amber').length,
    red: jobs.filter(j => j.status === 'red').length,
  };

  const renderContent = () => {
    switch (currentView) {
      case 'customer-details':
        return <CustomerDetailsForm onNext={handleCustomerNext} />;
      case 'job-details':
        return customerData ? (
          <JobLogForm
            customerData={customerData}
            onSave={handleJobSave}
            onBack={() => setCurrentView('customer-details')}
          />
        ) : null;
      default:
        return <Dashboard jobs={jobs} onUpdateStatus={handleUpdateJobStatus} />;
    }
  };

  // Dummy job data for testing
  const dummyJobs: JobFormData[] = [
    {
      jobNumber: generateJobNumber(),
      dateLogged: new Date(),
      status: 'amber',
      customer: 'Acme Ltd',
      site: 'Site A - Manchester',
      contact: { name: 'John Doe', number: '0123456789', email: 'john@acme.com', relationship: 'Manager' },
      description: 'Fix electrical issue in main hall',
      jobType: 'Maintenance',
      category: 'Electrical',
      priority: 'Medium',
      targetCompletionTime: 60,
      engineer: 'Jane Smith',
      project: 'Main Hall Refurb',
      primaryJobTrade: 'Electrical',
      secondaryJobTrades: ['Plumbing'],
      customerOrderNumber: 'ORD123',
      referenceNumber: 'REF456',
      jobOwner: 'Aroz',
      tags: ['Urgent', 'Out of Hours'],
      jobRef1: 'JREF1',
      jobRef2: 'JREF2',
      requiresApproval: false,
      preferredAppointmentDate: new Date(),
      startDate: new Date(),
      endDate: null,
      lockVisitDateTime: false,
      deployToMobile: true,
      isRecurringJob: false,
      completionTimeFromEngineerOnsite: false
    },
    {
      jobNumber: generateJobNumber(),
      dateLogged: new Date(),
      status: 'amber',
      customer: 'Beta Corp',
      site: 'Site B - London',
      contact: { name: 'Alice Brown', number: '0987654321', email: 'alice@beta.com', relationship: 'Supervisor' },
      description: 'Install new HVAC system',
      jobType: 'Installation',
      category: 'HVAC',
      priority: 'High',
      targetCompletionTime: 120,
      engineer: 'Bob Lee',
      project: 'HVAC Upgrade',
      primaryJobTrade: 'HVAC',
      secondaryJobTrades: ['Electrical', 'Mechanical'],
      customerOrderNumber: 'ORD789',
      referenceNumber: 'REF101',
      jobOwner: 'Sam',
      tags: ['Scheduled', 'Preventive'],
      jobRef1: 'JREF3',
      jobRef2: 'JREF4',
      requiresApproval: true,
      preferredAppointmentDate: new Date(),
      startDate: new Date(),
      endDate: null,
      lockVisitDateTime: true,
      deployToMobile: false,
      isRecurringJob: true,
      completionTimeFromEngineerOnsite: true
    }
  ];

  // Function to insert dummy jobs
  const insertDummyJobs = async () => {
    for (const job of dummyJobs) {
      try {
        await addJob(job);
        console.log('Inserted dummy job:', job);
      } catch (err) {
        console.error('Failed to insert dummy job:', err);
        alert('Failed to insert dummy job: ' + (err?.message || err));
      }
    }
    // Refresh jobs from Supabase after insertion
    try {
      const jobsFromDb = await fetchJobs();
      setJobs(jobsFromDb);
    } catch (err) {
      console.error('Failed to fetch jobs after inserting dummy jobs:', err);
    }
  };

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50">
          <Sidebar className="border-r border-gray-200 bg-white/80 backdrop-blur-sm">
            <SidebarHeader className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">JobLogic</h1>
                  <p className="text-sm text-muted-foreground">Support Portal</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setCurrentView('dashboard');
                      setCustomerData(null);
                    }}
                    isActive={currentView === 'dashboard'}
                    className="w-full justify-start gap-3 h-12 text-base"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setCurrentView('customer-details')}
                    isActive={currentView === 'customer-details' || currentView === 'job-details'}
                    className="w-full justify-start gap-3 h-12 text-base"
                  >
                    <Plus size={20} />
                    Log New Job
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              {/* Quick Stats */}
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 px-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2 py-1 rounded-md bg-blue-50">
                    <span className="text-sm text-blue-800">Total Jobs</span>
                    <span className="text-sm font-semibold text-blue-900">{stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 rounded-md bg-green-50">
                    <span className="text-sm text-green-800">Completed</span>
                    <span className="text-sm font-semibold text-green-900">{stats.green}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 rounded-md bg-amber-50">
                    <span className="text-sm text-amber-800">In Progress</span>
                    <span className="text-sm font-semibold text-amber-900">{stats.amber}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 rounded-md bg-red-50">
                    <span className="text-sm text-red-800">Issues</span>
                    <span className="text-sm font-semibold text-red-900">{stats.red}</span>
                  </div>
                </div>
              </div>

              {/* Insert Dummy Jobs Button */}
              <div className="mt-8 px-2">
                <Button onClick={insertDummyJobs} variant="outline" className="w-full">Insert Dummy Jobs</Button>
              </div>

              {/* Current Time */}
              <div className="mt-8 px-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>{format(new Date(), 'HH:mm:ss')}</span>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Out-of-Hours Customer Service Portal
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
              </div>
            </header>
            
            <div className="flex-1 p-6 overflow-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
  );
}