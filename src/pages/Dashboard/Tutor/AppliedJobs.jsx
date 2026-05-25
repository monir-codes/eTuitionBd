import { motion } from "framer-motion";
import { Calendar, MapPin, CircleDollarSign, Info, Loader2 } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const AppliedJobs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // 🔄 ১. TanStack useQuery: ডাটাবেজ থেকে এই টিউটরের অ্যাপ্লাই করা সব টিউশন ডাটা লাইভ আনা
  const { data: appliedJobs = [], isLoading } = useQuery({
    queryKey: ["applied-jobs", user?.email],
    enabled: !!user?.email, // ইমেইল নিশ্চিত হওয়ার পর কুয়েরি হিট করবে
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/applied-jobs?email=${user?.email}`);
      return res.data;
    },
  });

  // 🎨 স্ট্যাটাস অনুযায়ী ডাইনামিক কালার ব্যাজ
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Top Title Bar */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Applied Tuition Jobs</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Track the status of your applications</p>
      </div>

      {/* 🗂️ Applied Jobs List */}
      <div className="space-y-4">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div 
              key={job._id || job.id}
              className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md group"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap gap-5 text-sm text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#40bfff]" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CircleDollarSign size={16} className="text-[#2ecc71]" /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-slate-400" /> 
                    Applied: {job.appliedDate || new Date(job.postedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* 🛠️ Status Badges & Info Trigger */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0">
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${statusStyles[job.status] || "bg-slate-100 text-slate-500"}`}>
                  {job.status}
                </span>
                
                <button className="p-3 bg-slate-50 text-slate-500 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all shadow-sm">
                  <Info size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          /* 📥 Empty Application State */
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="font-black text-slate-300 uppercase tracking-widest">You haven't applied to any tuition jobs yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppliedJobs;