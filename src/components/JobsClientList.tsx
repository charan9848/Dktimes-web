'use client';

import { useState } from 'react';
import { JobListing } from '@/types';
import { Briefcase, MapPin, Building2, Send, Search } from 'lucide-react';
import JobApplicationModal from './JobApplicationModal';

interface Props {
  jobs: Partial<JobListing>[];
}

export default function JobsClientList({ jobs }: Props) {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [applyingJob, setApplyingJob] = useState<Partial<JobListing> | null>(null);

  const locations = ['All', 'Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Remote'];

  const filtered = jobs.filter((j) => {
    const matchSearch =
      (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(search.toLowerCase());
    const matchLoc =
      selectedLocation === 'All' ||
      (j.location || '').toLowerCase().includes(selectedLocation.toLowerCase());
    return matchSearch && matchLoc;
  });

  return (
    <>
      {applyingJob && (
        <JobApplicationModal job={applyingJob} onClose={() => setApplyingJob(null)} />
      )}

      {/* Filter and search bar */}
      <div className="bg-[#FFFDF7] dark:bg-[#141414] p-4 rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm transition-colors">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F675C] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search roles or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedLocation === loc
                  ? 'bg-[#1C3D5A] dark:bg-sky-600 text-white'
                  : 'bg-[#F5F1E8] dark:bg-white/10 text-[#6F675C] dark:text-slate-300 hover:text-[#211D18] dark:hover:text-white'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-6 shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-lg md:text-xl text-[#211D18] dark:text-white">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F675C] dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-[#1C3D5A] dark:text-sky-400">
                  <Building2 size={13} /> {job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {job.location}
                </span>
                {job.salary && (
                  <>
                    <span>•</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {job.salary}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#6F675C] dark:text-slate-300 leading-relaxed line-clamp-2 max-w-3xl">
                {job.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setApplyingJob(job)}
                className="bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Send size={13} /> Apply Now
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-12 text-center text-[#6F675C] dark:text-slate-400">
            <p className="font-medium text-sm">No job openings found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
