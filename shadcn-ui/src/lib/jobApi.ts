import { supabase } from './supabaseClient';
import { Job, JobFormData } from '@/types/job';

export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('dateLogged', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addJob(jobData: JobFormData): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateJobStatus(jobId: string, status: string, reason?: string): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status, reason })
    .eq('id', jobId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
