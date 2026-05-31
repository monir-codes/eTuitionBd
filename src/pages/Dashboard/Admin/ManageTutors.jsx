import { motion } from "framer-motion";
import { useState } from "react";
import { Check, X, GraduationCap, Search, Filter, AlertCircle, Mail, BookOpen, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Loading/Loading";

const ManageTutors = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 ১. TanStack Query: ডাটাবেজ থেকে শুধুমাত্র ভেরিফিকেশন 'pending' থাকা টিউটরদের লাইভ আনা
  const { data: tutors = [], isLoading, isError, error } = useQuery({
    queryKey: ["pending-tutors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/pending-tutors");
      return res.data;
    }
  });

  // 🚫 ২. useMutation: টিউটর রিকোয়েস্ট অ্যাকসেপ্ট বা রিজেক্ট করা
  const verificationMutation = useMutation({
    mutationFn: async ({ email, status }) => {
      // ইউজারের ইউনিক ইমেইল কুয়েরি প্যারামিটার হিসেবে পাঠানো হচ্ছে
      const res = await axiosSecure.patch(`/api/admin/verify-tutor?email=${email}`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-tutors"] });
      
      const isApproved = variables.status === "Approved";
      Swal.fire({
        title: isApproved ? "Verified! ✅" : "Rejected! ❌",
        text: isApproved ? "Tutor profile has been granted verification status." : "Verification request declined.",
        icon: isApproved ? "success" : "error",
        confirmButtonColor: "#40bfff",
      });
    },
    onError: () => {
      toast.error("Failed to execute verification control logic.");
    }
  });

  // 🖱️ অ্যাকশন হ্যান্ডলারস
  const handleVerifyAction = (email, actionType) => {
    Swal.fire({
      title: `Confirm ${actionType}?`,
      text: `Are you sure you want to mark this tutor request as ${actionType}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: actionType === "Approved" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionType}`
    }).then((result) => {
      if (result.isConfirmed) {
        verificationMutation.mutate({ email, status: actionType });
      }
    });
  };

  // 🔍 ৩. ক্লায়েন্ট-সাইড ফিল্টারিং (বুলেটপ্রুফ নাল সেফটি লক)
  const filteredTutors = tutors.filter((tutor) => {
    const tutorName = tutor?.name ? String(tutor.name).toLowerCase() : "";
    const tutorEmail = tutor?.email ? String(tutor.email).toLowerCase() : "";
    const tutorInstitute = tutor?.institution ? String(tutor.institution).toLowerCase() : "";
    const cleanSearch = searchTerm.toLowerCase();

    return (
      tutorName.includes(cleanSearch) ||
      tutorEmail.includes(cleanSearch) ||
      tutorInstitute.includes(cleanSearch)
    );
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertCircle size={40} />
        <p className="font-black uppercase tracking-wider text-sm">Failed to load verification logs: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto px-1 sm:px-2 py-2"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div className="py-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Verify Tutors</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Review background details and grant badges</p>
      </div>

      {/* 🔍 Controls Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or institution..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="text-xs text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border shrink-0">
          <ShieldCheck size={14} className="text-emerald-500" /> Pending Verification Queue
        </div>
      </div>

      {/* 📜 Master Table / Card Layout */}
      <div className="bg-transparent sm:bg-white rounded-none sm:rounded-[2.5rem] border-none sm:border border-slate-100 sm:shadow-sm overflow-hidden w-full">
        
        {/* 💻 Desktop Table View Model */}
        <div className="hidden sm:block w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest">
                <th className="p-4 lg:p-5 w-[35%] rounded-tl-none sm:rounded-tl-[2.5rem]">Tutor Identity</th>
                <th className="p-4 lg:p-5 w-[25%]">Institution</th>
                <th className="p-4 lg:p-5 w-[22%]">Expertise Subject</th>
                <th className="p-4 lg:p-5 w-[18%] rounded-tr-none sm:rounded-tr-[2.5rem] text-right pr-6">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredTutors.length > 0 ? filteredTutors.map((tutor) => (
                <tr key={tutor._id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Identity Box */}
                  <td className="p-4 lg:p-5 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="w-10 h-10 bg-blue-50 text-[#40bfff] rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50">
                        <GraduationCap size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-800 font-black text-sm lg:text-base truncate w-full">{tutor.name || "Unknown Tutor"}</p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5 w-full">
                          <Mail size={12} className="shrink-0 text-slate-300" /> 
                          <span className="truncate block w-full">{tutor.email}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Institution */}
                  <td className="p-4 lg:p-5 min-w-0">
                    <p className="text-slate-700 font-black truncate w-full" title={tutor.institution}>{tutor.institution || "N/A"}</p>
                  </td>

                  {/* Expertise Subject */}
                  <td className="p-4 lg:p-5 min-w-0">
                    <p className="text-xs font-bold text-slate-500 bg-slate-50/80 border px-2.5 py-1.5 rounded-xl truncate w-full flex items-center gap-1" title={tutor.qualification || tutor.subject}>
                      <BookOpen size={12} className="text-slate-400 shrink-0" /> {tutor.qualification || tutor.subject || "Not Listed"}
                    </p>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 lg:p-5 text-right whitespace-nowrap pr-6">
                    <div className="inline-flex gap-1.5 justify-end">
                      <button 
                        onClick={() => handleVerifyAction(tutor.email, "Approved")}
                        disabled={verificationMutation.isPending}
                        title="Verify & Grant Badge"
                        className="h-8 w-8 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-50 shadow-sm"
                      >
                        <Check size={15} />
                      </button>
                      <button 
                        onClick={() => handleVerifyAction(tutor.email, "Rejected")}
                        disabled={verificationMutation.isPending}
                        title="Decline Verification"
                        className="h-8 w-8 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-50 shadow-sm"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
                     No pending tutor verifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile Card View Mode (স্মার্টফোনে ভাঙবে না) */}
        <div className="block sm:hidden space-y-4 w-full">
          {filteredTutors.length > 0 ? filteredTutors.map((tutor) => (
            <div key={tutor._id} className="p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-50 text-[#40bfff] border rounded-xl flex items-center justify-center shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-slate-800 font-black text-base truncate">{tutor.name || "Unknown Tutor"}</h4>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5 truncate"><Mail size={12}/> {tutor.email}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-bold">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between">
                  <span className="text-slate-400 font-black uppercase text-[9px] tracking-wider">Institution</span>
                  <span className="text-slate-700 truncate max-w-[180px]">{tutor.institution || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between">
                  <span className="text-slate-400 font-black uppercase text-[9px] tracking-wider">Expertise</span>
                  <span className="text-slate-700 truncate max-w-[180px]">{tutor.qualification || tutor.subject || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Pending Review</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleVerifyAction(tutor.email, "Approved")}
                    disabled={verificationMutation.isPending}
                    className="h-8 px-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-xs rounded-xl flex items-center gap-1"
                  >
                    <Check size={13} /> Verify
                  </button>
                  <button 
                    onClick={() => handleVerifyAction(tutor.email, "Rejected")}
                    disabled={verificationMutation.isPending}
                    className="h-8 px-3.5 bg-rose-50 text-rose-500 border border-rose-100 font-black text-xs rounded-xl flex items-center gap-1"
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed text-slate-400 font-black text-xs uppercase tracking-widest p-4">
               No matching pending tutor requests
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default ManageTutors;