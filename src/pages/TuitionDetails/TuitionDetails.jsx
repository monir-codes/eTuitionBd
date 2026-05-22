import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  MapPin, CircleDollarSign, Clock, BookOpen, Calendar, 
  User, CheckCircle2, ArrowLeft, Info, Loader2, AlertTriangle, Send 
} from "lucide-react";
import useAxios from "../../hooks/useAxios"; // আপনার কাস্টম এক্সিওস হুক
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const [proposalText, setProposalText] = useState("");

  // 🔄 ১. TanStack Query দিয়ে ডাইনামিকালি সিঙ্গেল টিউশন ফেচ করা
  const { data: job = {}, isLoading, isError, error } = useQuery({
    queryKey: ["tuition-details", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/tuitions/${id}`);
      return res.data;
    }
  });

  // 🚀 ২. useMutation দিয়ে টিউটরের অ্যাপ্লিকেশন ডাটাবেজে পোস্ট করা
  const applyMutation = useMutation({
    mutationFn: async (applicationPayload) => {
      const res = await axiosPublic.post("/api/tuitions/apply", applicationPayload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Your application has been submitted successfully!");
      setProposalText("");
      navigate("/dashboard/tutor/applied-jobs");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Already applied for this tuition!");
    }
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.warn("Please log in as a Tutor to apply!");
      return navigate("/login", { state: { from: { pathname: `/tuitions/${id}` } } });
    }

    if (user?.role !== "tutor") {
      return toast.error("Access Denied! Only Tutors can apply for postings.");
    }

    if (!proposalText.trim()) {
      return toast.error("Please draft a short proposal first!");
    }

    const payload = {
      tuitionId: id,
      tutorId: user.uid,
      tutorName: user.displayName,
      tutorEmail: user.email,
      tutorImage: user.photoURL,
      proposal: proposalText,
      status: "pending"
    };

    applyMutation.mutate(payload);
  };

  // ⏳ ডাটাবেজ লোডিং গেটওয়ে
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Specifications...</p>
      </div>
    );
  }

  // ⚠️ ডাটাবেজ এরর গেটওয়ে
  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Failed to load posting: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🔙 Back Button */}
        <Link to="/tuitions" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#40bfff] mb-8 transition-colors uppercase tracking-widest text-xs">
          <ArrowLeft size={18} /> Back to Listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* 📝 Left Side: Main Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Header Card */}
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                {job.category || "General Medium"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6 leading-tight">
                {job.title}
              </h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-slate-50">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Salary</span>
                  <p className="text-xl font-black text-emerald-500">{job.salary}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Subjects</span>
                  <p className="text-lg font-black text-slate-700">{job.subject}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Posted On</span>
                  <p className="text-lg font-bold text-slate-500">{job.postedAt || "Recent"}</p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-[#40bfff]" /> Description
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed text-lg">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements Card */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h4 className="text-xl font-black text-slate-800 mb-6">Tutor Requirements</h4>
                <ul className="grid gap-4">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-bold">
                      <CheckCircle2 size={20} className="text-[#40bfff] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* 📍 Right Side: Sidebar Info & Apply Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 lg:sticky lg:top-28"
          >
            {/* Quick Info & Submission Box */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
              <h4 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-4">Tuition Summary</h4>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-slate-700">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50"><Clock size={20}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Schedule</p>
                    <p className="text-sm font-bold text-slate-700">{job.days}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50"><User size={20}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Student Gender</p>
                    <p className="text-sm font-bold text-slate-700">{job.studentGender || "Any"}</p>
                  </div>
                </div>
              </div>

              {/* 📝 Application Mini-Form inside Sidebar */}
              <form onSubmit={handleApplySubmit} className="pt-4 border-t border-slate-50 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Draft Your Proposal</label>
                  <textarea 
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    rows="4"
                    disabled={user?.role === "student" || user?.role === "admin"}
                    placeholder={
                      user?.role === "student" 
                        ? "Students cannot apply for jobs." 
                        : "State your experience, educational background, and expected timeline..."
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none text-slate-700 placeholder-slate-300 disabled:opacity-60"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={applyMutation.isPending || user?.role === "student" || user?.role === "admin"}
                  className="w-full py-4 rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] shadow-xl shadow-blue-100 transition-all active:scale-95 text-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} /> {applyMutation.isPending ? "Submitting..." : "Apply for this Job"}
                </button>
              </form>

              <p className="text-[11px] text-center text-slate-400 font-bold uppercase tracking-widest">
                ID: ET-{id || "001"}
              </p>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-[#40bfff]/5 p-8 rounded-[2.5rem] border border-blue-100">
              <h4 className="text-md font-black text-slate-800 mb-3">Safety Tips</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Never pay any upfront advanced tokens to get a tuition match. Verified tutors and parents deal securely through eTuitionBD escrow policies.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default TuitionDetails;