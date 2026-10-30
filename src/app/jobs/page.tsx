import { getJobListings } from '@/lib/news-service';
import { JobListing } from '@/types';
import { Briefcase } from 'lucide-react';
import JobsClientList from '@/components/JobsClientList';

const defaultJobs: Partial<JobListing>[] = [
  {
    id: '1',
    title: 'Senior Full Stack React Engineer',
    company: 'TCS Innovation SEZ',
    location: 'Hyderabad',
    salary: '₹50,000 - ₹75,000 / mo',
    description: 'Seeking experienced TypeScript and React engineers for large scale cloud portal development.',
  },
  {
    id: '2',
    title: 'Special Telugu News Reporter',
    company: 'Sakshi Media Network',
    location: 'Vijayawada',
    salary: '₹35,000 / mo',
    description: 'Covering state legislature, political briefings, and investigative stories.',
  },
  {
    id: '3',
    title: 'DevOps & Infrastructure Architect',
    company: 'Infosys Cloud Labs',
    location: 'Remote',
    salary: '₹80,000 / mo',
    description: 'AWS, Kubernetes, Terraform deployment and continuous integration.',
  },
  {
    id: '4',
    title: 'Senior Clinical Accounts Officer',
    company: 'Apollo Hospitals',
    location: 'Visakhapatnam',
    salary: '₹40,000 / mo',
    description: 'Healthcare finance management, audit compliance, and revenue tracking.',
  },
];

export default async function JobsPage() {
  const jobsData = await getJobListings(30);
  const jobs: Partial<JobListing>[] = jobsData.length > 0 ? jobsData : defaultJobs;

  return (
    <main className="mx-auto max-w-[1200px] px-4 md:px-6 py-8">
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-4 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
          Employment Opportunities
        </span>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white flex items-center gap-3 mt-1">
          <Briefcase size={32} className="text-[#1C3D5A] dark:text-sky-400" /> DK Times Career Portal
        </h1>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-1">
          Verified employment openings across Hyderabad, Vijayawada, Visakhapatnam, and Remote.
        </p>
      </div>

      <JobsClientList jobs={jobs} />
    </main>
  );
}
