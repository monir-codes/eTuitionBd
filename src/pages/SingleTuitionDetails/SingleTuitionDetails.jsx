import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  MapPin, CircleDollarSign, Calendar, BookOpen, User, 
  Clock, Send, Loader2, AlertTriangle, ArrowLeft, GraduationCap 
} from "lucide-react";
import useAxios from "../../hooks/useAxios"; // আপনার কাস্টম এক্সিওস (পাবলিক/সিকিউর)
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const SingleTuitionDetails = () => {
  const { id } = useParams(); // ইউআরএল থেকে টিউশন আইডি নেওয়া
  const { user } = useAuth(); // কারেন্ট লগইন থাকা টিউটরের ডেটা জানার জন্য
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const [proposalText, setProposalText] = useState("");

  // 🔄 ১. useQuery দিয়ে নির্দিষ্ট টিউশনের ডিটেইলস ডাটাবেজ থেকে ফেচ করা
  const { data: tuition = {}, isLoading, isError, error } = useQuery({
    queryKey: ["single-tuition", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/tuitions/${id}`);
      return res.data;
    }
  });

  // 🚀 ২. useMutation দিয়ে টিউটরের অ্যাপ্লিকেশন ব্যাকএন্ডে সাবমিট করা
  const applyMutation = useMutation({
    mutationFn: async (applicationData) => {
      const res = await axiosPublic.post("/api/tuitions/apply", applicationData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully! Stay tuned.");
      setProposalText("");
      navigate("/dashboard/tutor/applied-jobs"); // টিউটরকে তার অ্যাপ্লাইড জবস পেজে রিডাইরেক্ট করা
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit application. Already applied?");
    }
  });

  const handleApply = (e) => {
    e.preventDefault();

    // 🛑 সিকিউরিটি চেক: লগইন না থাকলে আগে লগইন পেজে পাঠাবে
    if (!user) {
      toast.warn("Please login as a Tutor to apply!");
      return navigate("/login", { state: { from: { pathname: `/tuitions/${id}` } } });
    }

    // 🛑 রোল চেক: স্টুডেন্ট বা এডমিন যেন অ্যাপ্লাই করতে না পারে
    if (user?.role !== "tutor") {
      return toast.error("Only users with the 'Tutor' role can apply for tuitions!");
    }

    if (!proposalText.trim()) {
      return toast.error("Please write a short proposal or cover letter!");
    }

    // ব্যাকএন্ডে পাঠানোর জন্য কমপ্লিট পেলোড অবজেক্ট
    const applicationPayload = {
      tuitionId: id,
      tutorId: user.uid,
      tutorName: user.displayName,
      tutorEmail: user.email,
      tutorImage: user.photoURL,
      proposal: proposalText,
      status: "pending"
    };

    applyMutation.mutate(applicationPayload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Job Specifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Failed to load details: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-6 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 🔙 Back Button */}
        <Link to="/tuitions" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#40bfff] transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to All Tuitions
        </Link>

        {/* 📜 Main Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Left Block: Tuition Details (2 Columns wide) */}
          <div className="md:col-span-2 bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100 inline-block">
                Job Specification
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
                {tuition.title}
              </h1>
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex items-center gap-3">
                <BookOpen className="text-[#40bfff]" size={20} />
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Subject</p>
                  <p className="text-sm font-black text-slate-700">{tuition.subject}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex items-center gap-3">
                <MapPin className="text-slate-400" size={20} />
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Location</p>
                  <p className="text-sm font-black text-slate-700">{tuition.location}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex items-center gap-3">
                <CircleDollarSign className="text-emerald-500" size={20} />
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Salary / Budget</p>
                  <p className="text-sm font-black text-slate-700">{tuition.salary}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex items-center gap-3">
                <Calendar className="text-amber-500" size={20} />
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Weekly Frequency</p>
                  <p className="text-sm font-black text-slate-700">{tuition.days}</p>
                </div>
              </div>
            </div>

            {/* Extra Descriptions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide">Additional Requirements:</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {tuition.description || "The parent prefers a highly regular tutor with great communication skills. Background verification and institutional ID cards must be presented upon profile match."}
              </p>
            </div>
          </div>

          {/* Right Block: Interactive Proposal Form */}
          <div className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <GraduationCap size={18} className="text-[#40bfff]" /> Apply Now
              </h3>
              <p className="text-xs font-bold text-slate-400">Submit a premium proposal to interest the parent.</p>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Cover Letter / Proposal</label>
                <textarea 
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  rows="5"
                  placeholder="e.g. Assalamu Alaikum, I am a CSE student at... and I have 2 years of experience teaching mathematics..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none placeholder-slate-300 text-slate-700"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={applyMutation.isPending}
                className="w-full bg-[#40bfff] text-white h-13 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} /> {applyMutation.isPending ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleTuitionDetails;