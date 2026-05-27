import { motion } from "framer-motion";
import { Calendar, MapPin, CircleDollarSign, Info, Loader2, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const AppliedJobs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // 🔄 ১. TanStack useQuery: ডাটাবেজ থেকে এই টিউটরের অ্যাপ্লাই করা সব টিউশন ডাটা লাইভ আনা
  const { data: appliedJobs = [], isLoading } = useQuery({
    queryKey: ["applied-jobs", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/applied-jobs?email=${user?.email}`);
      return res.data;
    },
  });

  // 🎨 ২. স্ট্যাটাস অনুযায়ী ডাইনামিক কালার ব্যাজ
  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100"
  };

  // ⏳ ডাটা ফেচিং লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Top Title Bar */}
      <div className="border-b border-slate-100/60 pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">
          Applied Tuition Jobs
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
          Track the status of your applications
        </p>
      </div>

      {/* 🗂️ Applied Jobs List - Fully Responsive Stack */}
      <div className="space-y-4 w-full">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div 
              key={job._id}
              className="w-full bg-white p-5 sm:p-6 lg:p-8 rounded-[2.5rem] border border-slate-100/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 group"
            >
              <div className="space-y-3 flex-1 min-w-0">
                {/* টিউশন টাইটেল এবং মিডিয়াম ক্যাটাগরি */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors leading-snug break-words max-w-full">
                    {job.tuitionTitle}
                  </h3>
                  {job.category && (
                    <span className="px-3 py-1 bg-blue-50 text-[#40bfff] border border-blue-100/60 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0">
                      {job.category}
                    </span>
                  )}
                </div>
                
                {/* 📋 রিকোয়ারমেন্ট অনুযায়ী বর্ধিত ইনফো গ্রিড (ফ্লুইড ব্রেকপয়েন্ট) */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-x-6 sm:gap-y-2.5 text-xs sm:text-sm text-slate-400 font-bold">
                  {/* ক্লাস লেভেল */}
                  <span className="flex items-center gap-2 min-w-0">
                    <GraduationCap size={16} className="text-indigo-500 shrink-0" /> 
                    <span className="text-slate-500 truncate">
                      Class: <span className="text-slate-700">{job.tuitionClassLevel || "N/A"}</span>
                    </span>
                  </span>

                  {/* সাবজেক্টস */}
                  <span className="flex items-center gap-2 min-w-0">
                    <BookOpen size={16} className="text-amber-500 shrink-0" /> 
                    <span className="text-slate-500 truncate" title={job.tuitionSubject}>
                      Subjects: <span className="text-slate-700">{job.tuitionSubject || "N/A"}</span>
                    </span>
                  </span>

                  {/* লোকেশন */}
                  <span className="flex items-center gap-2 min-w-0">
                    <MapPin size={16} className="text-[#40bfff] shrink-0" /> 
                    <span className="truncate text-slate-700">{job.tuitionLocation}</span>
                  </span>

                  {/* স্যালারি */}
                  <span className="flex items-center gap-2 shrink-0">
                    <CircleDollarSign size={16} className="text-[#2ecc71] shrink-0" /> 
                    <span className="text-slate-700">{job.tuitionSalary}</span>
                  </span>

                  {/* অ্যাপ্লিকেশন ডেট */}
                  <span className="flex items-center gap-2 shrink-0">
                    <Calendar size={16} className="text-slate-400 shrink-0" /> 
                    <span className="text-slate-500">
                      Applied: <span className="text-slate-700">{job.proposalAt}</span>
                    </span>
                  </span>
                </div>
              </div>

              {/* 🛠️ Status Badges & Action Controller */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-none border-slate-50 pt-4 lg:pt-0">
                <span className={`px-4 h-10 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider border flex items-center justify-center ${statusStyles[job.status] || "bg-slate-50 text-slate-400 border-slate-200"}`}>
                  {job.status || "pending"}
                </span>
                
                <button 
                  title="View Details"
                  className="h-10 w-10 sm:h-11 sm:w-11 bg-slate-50 text-slate-500 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 active:scale-95 duration-200"
                >
                  <Info size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          /* 📥 Empty Application State */
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 px-4">
             <p className="font-black text-slate-300 uppercase tracking-widest text-xs sm:text-sm">
               You haven't applied to any tuition jobs yet
             </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppliedJobs;