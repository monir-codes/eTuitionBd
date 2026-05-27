import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Mail, Phone, GraduationCap, Calendar, Loader2, AlertTriangle, FileText } from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ViewApplicants = () => {
  const { id } = useParams(); // টিউশন পোস্টের ID রাউট থেকে নেওয়া হচ্ছে
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 🔄 ১. TanStack Query দিয়ে ওই নির্দিষ্ট টিউশন পোস্টের সব আবেদনকারী টিউটরদের ফেচ করা
  const { data: applicants = [], isLoading, isError, error } = useQuery({
    queryKey: ["applicants", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tuitions/applicants/${id}`);
      return res.data; // এটি একটি অ্যারে রিটার্ন করবে যেখানে টিউটরদের ডিটেইলস ও প্রোপোজাল থাকবে
    }
  });

  // ⚡ ২. useMutation দিয়ে অ্যাপ্লিকেশনের স্ট্যাটাস (Accept / Reject) আপডেট করা
  const statusMutation = useMutation({
    mutationFn: async ({ applicantId, statusAction }) => {
      const res = await axiosSecure.patch(`/api/tuitions/application-status`, {
        tuitionId: id,
        applicantId,
        status: statusAction // 'accepted' or 'rejected'
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // ক্যাশ ডাটা ইনভ্যালিডেট করে ইউআই রিয়েল-টাইম আপডেট করা
      queryClient.invalidateQueries({ queryKey: ["applicants", id] });
      
      if (variables.statusAction === "accepted") {
        toast.success("Tutor proposal accepted! Contact details unlocked.");
      } else {
        toast.error("Tutor proposal rejected.");
      }
    },
    onError: () => {
      toast.className("Failed to update status. Please try again.");
    }
  });

  const handleStatusChange = (applicantId, statusAction) => {
    statusMutation.mutate({ applicantId, statusAction });
    navigate(`/checkout`)
  };

  // ⏳ ডাটা লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Applied Tutors...</p>
      </div>
    );
  }

  // ⚠️ নেটওয়ার্ক বা সার্ভার এরর স্টেট
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Tutor Applications</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Review proposals, check profiles, and hire the perfect tutor</p>
      </div>

      {/* 📜 Applicants Card List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {applicants.length > 0 ? applicants.map((app) => (
          <div 
            key={app.tutorId} 
            className={`bg-white p-6 sm:p-8 rounded-[3rem] border transition-all flex flex-col justify-between gap-6 relative overflow-hidden ${
              app.status === 'accepted' ? 'border-emerald-200 shadow-md shadow-emerald-50/50' : 'border-slate-100 shadow-sm'
            }`}
          >
            {/* Accepted Badge */}
            {app.status === 'accepted' && (
              <span className="absolute top-6 right-8 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Hired / Accepted
              </span>
            )}
            
            {/* Rejected Badge */}
            {app.status === 'rejected' && (
              <span className="absolute top-6 right-8 bg-rose-50 text-rose-500 border border-rose-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Rejected
              </span>
            )}

            {/* Profile Info Area */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={app.tutorImage || "https://i.pravatar.cc/100"} 
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 bg-slate-50" 
                  alt="" 
                />
                <div>
                  <h3 className="text-xl font-black text-slate-800">{app.tutorName}</h3>
                  <p className="text-xs text-[#40bfff] font-black flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                    <GraduationCap size={14} /> {app.tutorInstitution || "Varsity Student"}
                  </p>
                </div>
              </div>

              {/* Contact Information (Only visible if status is active or accepted based on your business logic) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-500 pt-1 border-t border-b border-slate-50 py-3">
                <p className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {app.tutorEmail}</p>
                <p className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {app.tutorPhone || "Hidden"}</p>
              </div>

              {/* Cover Letter / Proposal */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 border border-slate-100/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <FileText size={12} /> Tutor's Proposal
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {app.proposal || "No cover letter submitted by the tutor."}
                </p>
              </div>
            </div>

            {/* Action Buttons (Only visible if pending) */}
            {app.status === 'pending' && (
              <div className="flex gap-4 border-t border-slate-50 pt-4 mt-2">
                <button 
                  onClick={() => handleStatusChange(app.tutorId, "accepted")}
                  disabled={statusMutation.isPending}
                  className="flex-1 h-12 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-emerald-100 disabled:opacity-50"
                >
                  <Check size={16} /> Accept Tutor
                </button>
                
                <button 
                  onClick={() => handleStatusChange(app.tutorId, "rejected")}
                  disabled={statusMutation.isPending}
                  className="flex-1 h-12 bg-rose-50 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-rose-100 disabled:opacity-50"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            )}

          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
             <AlertTriangle size={36} className="text-slate-300" />
             <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
               No tutors have applied to this post yet
             </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ViewApplicants;