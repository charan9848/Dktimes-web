'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { JobListing } from '@/types';

interface Props {
  job: Partial<JobListing>;
  onClose: () => void;
}

export default function JobApplicationModal({ job, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'job_applications'), {
        jobId: job.id || '',
        jobTitle: job.title || '',
        company: job.company || '',
        applicantName: name.trim(),
        applicantEmail: email.trim(),
        applicantPhone: phone.trim(),
        applicantNote: note.trim(),
        appliedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.15)] dark:border-white/10 max-w-lg w-full p-6 shadow-2xl relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6F675C] hover:text-[#211D18] dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-2xl text-[#211D18] dark:text-white">Application Submitted!</h3>
            <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 max-w-sm mx-auto">
              Your details have been submitted directly to the hiring desk for{' '}
              <strong className="text-[#211D18] dark:text-white">{job.title}</strong> at {job.company}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
              Direct Application Desk
            </span>
            <h3 className="font-serif font-black text-xl text-[#211D18] dark:text-white mt-1">
              Apply for {job.title}
            </h3>
            <p className="text-xs text-[#6F675C] dark:text-slate-400 mb-6">
              {job.company} · {job.location}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#6F675C] dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#6F675C] dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#6F675C] dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#6F675C] dark:text-slate-400 mb-1">
                  Brief Experience / Portfolio Links
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Summarize your qualifications or link to your LinkedIn/Resume..."
                  className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl p-3 text-xs text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Send size={13} /> {loading ? 'Submitting...' : 'Send Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
