import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Dashboard from '@/components/Dashboard';
import CustomerDetailsForm from '@/components/CustomerDetailsForm';
import JobLogForm from '@/components/JobLogForm';
import { Job, JobFormData, Contact } from '@/types/job';
import { updateJobStatus, generateJobNumber } from '@/lib/jobUtils';
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

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'JL-1001',
      jobNumber: 'JL-1001',
      customer: 'Acme Ltd',
      site: 'Site A - Manchester',
      engineer: 'John Doe',
      contact: {
        name: 'Jane Smith',
        number: '07123456789',
        email: 'jane@acme.com',
        relationship: 'Site Manager'
      },
      status: 'green',
      priority: 'Medium',
      dateLogged: new Date('2025-01-28T19:00:00'),
      dateAccepted: new Date('2025-01-28T19:15:00'),
      dateOnSite: new Date('2025-01-28T19:45:00'),
      dateCompleted: new Date('2025-01-28T20:30:00'),
      description: 'Routine maintenance of electrical systems',
      jobType: 'Maintenance',
      category: 'Electrical',
      targetCompletionTime: 90,
      reason: null
    },
    {
      id: 'JL-1002',
      jobNumber: 'JL-1002',
      customer: 'Beta Corp',
      site: 'Site C - London',
      engineer: 'Tom Brown',
      contact: {
        name: 'Mike Johnson',
        number: '07987654321',
        email: 'mike@beta.com',
        relationship: 'Supervisor'
      },
      status: 'amber',
      priority: 'High',
      dateLogged: new Date('2025-01-28T20:30:00'),
      dateAccepted: new Date('2025-01-28T20:45:00'),
      dateOnSite: null,
      dateCompleted: null,
      description: 'Urgent repair required for HVAC system',
      jobType: 'Repair',
      category: 'HVAC',
      targetCompletionTime: 120,
      reason: 'Engineer en route to site'
    },
    {
      id: 'JL-1003',
      jobNumber: 'JL-1003',
      customer: 'Gamma Inc',
      site: 'Site E - Bristol',
      engineer: 'Sara Lee',
      contact: {
        name: 'Sam White',
        number: '07891234567',
        email: 'sam@gamma.com',
        relationship: 'Site Lead'
      },
      status: 'red',
      priority: 'Critical',
      dateLogged: new Date('2025-01-28T18:00:00'),
      dateAccepted: new Date('2025-01-28T18:30:00'),
      dateOnSite: null,
      dateCompleted: null,
      description: 'Critical system failure - emergency response required',
      jobType: 'Emergency',
      category: 'Electrical',
      targetCompletionTime: 60,
      reason: 'Engineer delayed - over 1 hour since acceptance'
    }
  ]);

  // Auto-update job statuses based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => prevJobs.map(updateJobStatus));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleCustomerNext = (data: { customer: string; site: string; contact: Contact }) => {
    setCustomerData(data);
    setCurrentView('job-details');
  };

  const handleJobSave = (jobData: JobFormData) => {
    const newJob: Job = {
      id: generateJobNumber(),
      jobNumber: generateJobNumber(),
      ...jobData,
      status: 'amber',
      dateLogged: new Date(),
      dateAccepted: null,
      dateOnSite: null,
      dateCompleted: null,
      reason: 'Job logged - awaiting engineer acceptance'
    };

    setJobs(prev => [newJob, ...prev]);
    setCurrentView('dashboard');
    setCustomerData(null);
  };

  const handleUpdateJobStatus = (jobId: string, status: Job['status'], reason?: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          const updates: Partial<Job> = { status, reason };

          if (status === 'amber' && !job.dateAccepted) {
            updates.dateAccepted = new Date();
            updates.reason = 'Engineer accepted - en route to site';
          } else if (status === 'green' && job.dateAccepted && !job.dateOnSite) {
            updates.dateOnSite = new Date();
            updates.reason = 'Engineer on site - work in progress';
          } else if (status === 'green' && job.dateOnSite && !job.dateCompleted) {
            updates.dateCompleted = new Date();
            updates.reason = null;
          }

          return { ...job, ...updates };
        }
        return job;
      })
    );
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