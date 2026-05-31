import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  CircleDollarSign,
  Info,
  Loader2,
  GraduationCap,
  BookOpen,
  Edit3,
  Trash2,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AppliedJobs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // 🔄 ১. TanStack useQuery: টিউটরের অ্যাপ্লাই করা সব ডাটা লাইভ আনা
  const { data: appliedJobs = [], isLoading } = useQuery({
    queryKey: ["applied-jobs", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/applied-jobs?email=${user?.email}`,
      );
      return res.data;
    },
  });

  // 🗑️ ২. অ্যাপ্লিকেশন ডিলিট করার মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: async (appId) => {
      const res = await axiosSecure.delete(`/api/tuitions/apply/${appId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applied-jobs", user?.email],
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your application has been withdrawn.",
        icon: "success",
        confirmButtonColor: "#40bfff",
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete request.");
    },
  });

  // 📝 ৩. অ্যাপ্লিকেশন প্রপোজাল টেক্সট আপডেট করার মিউটেশন
  const updateMutation = useMutation({
    mutationFn: async ({ appId, newProposal }) => {
      const res = await axiosSecure.patch(`/api/applied-jobs/${appId}`, {
        proposal: newProposal,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applied-jobs", user?.email],
      });
      Swal.fire({
        title: "Updated!",
        text: "Your application proposal has been modified.",
        icon: "success",
        confirmButtonColor: "#40bfff",
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update request.");
    },
  });

  const handleDelete = (job) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to withdraw this tuition application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(job._id);
      }
    });
  };

  const handleUpdate = (job) => {
    Swal.fire({
      title: "Update Your Proposal",
      input: "textarea",
      inputValue: job.proposal || "",
      inputPlaceholder: "Modify your cover letter/statement here...",
      showCancelButton: true,
      confirmButtonColor: "#40bfff",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Save Changes",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "You need to write something to update!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        updateMutation.mutate({ appId: job._id, newProposal: result.value });
      }
    });
  };

 const handleViewDetails = (job) => {
  Swal.fire({
    html: `
      <div class="text-left font-sans space-y-5" style="font-family: 'League Spartan', sans-serif;">
        
        <div class="border-b border-slate-100 pb-3">
          <span class="px-2.5 py-0.5 bg-blue-50 text-[#40bfff] border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-wider inline-block mb-1">
            Application Registry
          </span>
          <h3 class="text-lg sm:text-xl font-black text-slate-800 leading-tight">
            ${job.tuitionTitle || "Tuition Position"}
          </h3>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
          <div class="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Class Level</p>
            <p class="font-black text-slate-700 mt-0.5 truncate">${job.tuitionClassLevel || "N/A"}</p>
          </div>
          <div class="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Subject</p>
            <p class="font-black text-slate-700 mt-0.5 truncate capitalize">${job.tuitionSubject || "N/A"}</p>
          </div>
          <div class="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Location</p>
            <p class="font-black text-slate-700 mt-0.5 truncate capitalize">${job.tuitionLocation || "N/A"}</p>
          </div>
          <div class="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Salary Package</p>
            <p class="font-black text-[#2ecc71] mt-0.5 truncate">${job.tuitionSalary || "Negotiable"}</p>
          </div>
        </div>

        <div class="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 space-y-1">
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">My Submitted Proposal</p>
          <p class="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed italic break-words">
            "${job.proposal || "No statement submitted."}"
          </p>
        </div>

        <div class="bg-slate-950 p-4 rounded-2xl text-slate-400 space-y-2 text-[11px] font-bold">
          <p class="text-[8px] font-black uppercase tracking-widest text-[#40bfff] mb-1">Applicant Metadata</p>
          <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
            <span>Tutor Name:</span>
            <span class="text-slate-200 font-black">${job.tutorName}</span>
          </div>
          <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
            <span>Registered Email:</span>
            <span class="text-slate-200 truncate max-w-[180px] sm:max-w-xs">${job.tutorEmail}</span>
          </div>
          <div class="flex justify-between">
            <span>Applied Timestamp:</span>
            <span class="text-slate-200">${job.proposalAt}</span>
          </div>
        </div>

      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Dismiss Log",
    confirmButtonColor: "#40bfff", // আপনার ব্র্যান্ড ব্লু থিম কালার
    showCloseButton: true,
    customClass: {
      popup: 'rounded-[2.5rem] p-5 sm:p-7 bg-white shadow-xl max-w-[92vw] sm:max-w-lg',
      confirmButton: 'w-full h-11 rounded-xl font-black text-xs uppercase tracking-wider active:scale-95 transition-all duration-150'
    },
    buttonsStyling: false // সুইটঅ্যালার্টের ডিফল্ট বাটন স্টাইল বন্ধ করে কাস্টম ক্লাস একটিভ করা হলো
  });
};

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };

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
      className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Top Title Bar (Responsive Padding & Text Size) */}
      <div className="border-b border-slate-100 pb-4 sm:pb-5">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">
          Applied Tuition Jobs
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-xs">
          Track and manage your running tuition applications
        </p>
      </div>

      {/* 🗂️ Applied Jobs List Container */}
      <div className="space-y-4 w-full">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div
              key={job._id}
              className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 group"
            >
              {/* Left Side: Core Info Block */}
              <div className="space-y-3 flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 max-w-full">
                  <h3 className="text-base sm:text-lg lg:text-2xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors leading-snug break-words max-w-full">
                    {job.tuitionTitle || "Tuition Position"}
                  </h3>
                </div>

                {/* 📋 মেইন ইনফো গ্রিড: মোবাইল, ট্যাবলেট ও ডেস্কটপ ব্রেকপয়েন্ট ১০০% অপ্টিমাইজড */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-x-5 sm:gap-y-2.5 text-xs lg:text-sm text-slate-400 font-bold w-full">
                  {/* Class Level */}
                  <span className="flex items-center gap-2 min-w-0">
                    <GraduationCap
                      size={15}
                      className="text-indigo-500 shrink-0"
                    />
                    <span className="text-slate-500 truncate">
                      Class:{" "}
                      <span className="text-slate-700">
                        {job.tuitionClassLevel || "N/A"}
                      </span>
                    </span>
                  </span>

                  {/* Subject */}
                  <span className="flex items-center gap-2 min-w-0">
                    <BookOpen size={15} className="text-amber-500 shrink-0" />
                    <span className="text-slate-500 truncate">
                      Subject:{" "}
                      <span className="text-slate-700">
                        {job.tuitionSubject || "N/A"}
                      </span>
                    </span>
                  </span>

                  {/* Location */}
                  <span className="flex items-center gap-2 min-w-0">
                    <MapPin size={15} className="text-[#40bfff] shrink-0" />
                    <span className="truncate text-slate-700 capitalize">
                      {job.tuitionLocation || "N/A"}
                    </span>
                  </span>

                  {/* Salary */}
                  <span className="flex items-center gap-2 shrink-0">
                    <CircleDollarSign
                      size={15}
                      className="text-[#2ecc71] shrink-0"
                    />
                    <span className="text-slate-700">
                      {job.tuitionSalary || "Negotiable"}
                    </span>
                  </span>

                  {/* Date */}
                  <span className="flex items-center gap-2 shrink-0">
                    <Calendar size={15} className="text-slate-400 shrink-0" />
                    <span className="text-slate-500">
                      Applied:{" "}
                      <span className="text-slate-700">{job.proposalAt}</span>
                    </span>
                  </span>
                </div>

                {/* Proposal Content Preview */}
                {job.proposal && (
                  <div className="pt-1 flex items-start gap-2 text-xs font-medium text-slate-500 max-w-full bg-slate-50/60 p-3 rounded-xl sm:rounded-2xl border border-slate-100/40">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-wider shrink-0 bg-white border px-1.5 py-0.5 rounded-md mt-0.5">
                      My Proposal
                    </span>
                    <p className="italic text-slate-600 break-words w-full">
                      "{job.proposal}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side / Bottom Footer: অ্যাকশন ও কন্ট্রোল প্যানেল (Responsive Alignment) */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between lg:justify-center gap-3 border-t lg:border-none border-slate-50 pt-3.5 lg:pt-0 shrink-0 w-full lg:w-auto">
                {/* Status Badges & Info Component */}
                <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-auto">
                  <span
                    className={`flex-1 sm:flex-initial px-4 h-9 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider border flex items-center justify-center ${statusStyles[job.status] || "bg-slate-50 text-slate-400 border-slate-200"}`}
                  >
                    {job.status === "accepted"
                      ? "approved"
                      : job.status || "pending"}
                  </span>

                  <button
                  onClick={() => handleViewDetails(job)}
                  title="View Details"
                   className="h-9 w-9 bg-slate-50 text-slate-500 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 active:scale-95 duration-200">
                    <Info size={14} />
                  </button>
                </div>

                {/* Conditional Lock Actions */}
                {job.status === "pending" || !job.status ? (
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    {/* Update Action Button */}
                    <button
                      onClick={() => handleUpdate(job)}
                      disabled={
                        updateMutation.isPending || deleteMutation.isPending
                      }
                      className="flex-1 sm:flex-initial h-9 px-4 bg-blue-50 text-[#40bfff] hover:bg-[#40bfff] hover:text-white border border-blue-100 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <Edit3 size={13} /> Update
                    </button>

                    {/* Delete Action Button */}
                    <button
                      onClick={() => handleDelete(job)}
                      disabled={
                        updateMutation.isPending || deleteMutation.isPending
                      }
                      className="flex-1 sm:flex-initial h-9 px-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}{" "}
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="w-full lg:w-auto text-center text-[9px] font-black tracking-widest uppercase text-slate-400 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-dashed border-slate-200 select-none shrink-0 lg:mt-1">
                    🔒 Request Locked
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty Pipeline View */
          <div className="text-center py-16 sm:py-20 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-dashed border-slate-200 px-4">
            <p className="font-black text-slate-300 uppercase tracking-widest text-[11px] sm:text-sm">
              You haven't applied to any tuition jobs yet
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppliedJobs;
