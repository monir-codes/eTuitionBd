import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  MapPin,
  CircleDollarSign,
  Clock,
  BookOpen,
  Calendar,
  User,
  CheckCircle2,
  ArrowLeft,
  Info,
  Loader2,
  AlertTriangle,
  Send,
  GraduationCap,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [proposalText, setProposalText] = useState("");

  const {
    data: job = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tuition-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tuition/${id}`);
      return res.data;
    },
  });

  const { data: role = "" } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/user?email=${user?.email}`);
      return res.data.role;
    },
  });

  // 🚀 useMutation দিয়ে টিউটরের অ্যাপ্লিকেশন ডাটাবেজে পোস্ট করা
  const applyMutation = useMutation({
    mutationFn: async (applicationPayload) => {
      const res = await axiosSecure.post(
        "/api/tuitions/apply",
        applicationPayload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Your application has been submitted successfully!");
      setProposalText("");
      navigate("/dashboard/tutor/applied-jobs");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Already applied for this tuition!",
      );
    },
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.warn("Please log in as a Tutor to apply!");
      return navigate("/login");
    }

    if (role !== "tutor") {
      return toast.error("Access Denied! Only Tutors can apply for postings.");
    }

    if (!proposalText.trim()) {
      return toast.error("Please draft a short proposal first!");
    }

    const payload = {
      _id: id,
      tutorId: user.uid,
      tuitionTitle: job.title,
      tuitionClassLevel: job.classLevel,
      tuitionSubject: job.subject,
      tutorName: user.displayName,
      tutorEmail: user.email,
      tutorImage: user.photoURL,
      tuitionLocation: job.location,
      tuitionSalary: job.salary,
      proposal: proposalText,
      postedAt: job.postedAt,
      proposalAt: new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: "pending",
    };

    applyMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest text-center">
          Loading Specifications...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">
          Failed to load posting: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-24 sm:pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔙 Back Button */}
        <Link
          to="/tuitions"
          className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#40bfff] mb-6 sm:mb-8 transition-colors uppercase tracking-widest text-[10px] sm:text-xs"
        >
          <ArrowLeft size={16} /> Back to Listings
        </Link>

        {/* 📐 মেইন লেআউট: মোবাইলে ১ কলাম, লার্জ স্ক্রিনে ৩ কলাম */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* 📝 Left Side: Main Details (মোবাইলে ২ কলামের রেসপন্সিভ গ্রিডসহ) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8 w-full"
          >
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 border border-blue-100">
                {job.category || "General Medium"}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-6 leading-tight break-words">
                {job.title}
              </h1>

              {/* 📊 ৪ ফিল্ডের কমপ্লিট গ্রিড: মোবাইলে ২ কলাম, ট্যাবলেটে ৪ কলাম */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8 border-y border-slate-50/80">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Salary
                  </span>
                  <p className="text-lg sm:text-xl font-black text-emerald-500 truncate">
                    {job.salary}
                  </p>
                </div>
                
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Class / Level
                  </span>
                  <p className="text-base sm:text-lg font-black text-indigo-500 truncate">
                    {job.classLevel || "Class 10"}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Subjects
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-700 truncate" title={job.subject}>
                    {job.subject}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Posted On
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-500 truncate">
                    {job.postedAt || "Recent"}
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Info size={18} className="text-[#40bfff] shrink-0" /> Description
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed text-base sm:text-lg break-words">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements Card */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100">
                <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-4 sm:mb-6">
                  Tutor Requirements
                </h4>
                <ul className="grid gap-3 sm:gap-4">
                  {job.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600 font-bold text-sm sm:text-base"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#40bfff] shrink-0 mt-0.5"
                      />
                      <span className="break-words">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* 📍 Right Side: Sidebar Summary & Apply Form (মোবাইলে নিচে আসবে, ডেস্কটপে সাইড স্টিকি) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:sticky lg:top-28 w-full"
          >
            {/* Quick Info & Submission Box */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-full space-y-6">
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-800 border-b border-slate-50 pb-3.5">
                  Tuition Summary
                </h4>

                <div className="space-y-4 mt-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-500 border border-slate-100/50 shrink-0">
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        Student Class
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                        {job.classLevel || "Class 10"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate" title={job.location}>
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        Schedule
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                        {job.days || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff] border border-slate-100/50 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        Student Gender
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate capitalize">
                        {job.studentGender || "Any"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 📝 Mini Form */}
              <form
                onSubmit={handleApplySubmit}
                className="pt-4 border-t border-slate-50 space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
                    Draft Your Proposal
                  </label>
                  <textarea
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    rows="4"
                    disabled={role === "student" || role === "admin"}
                    placeholder={
                      role === "student" || role === "admin"
                        ? "Students/Admins cannot apply for jobs."
                        : "State your experience, educational background, and expected timeline..."
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none text-slate-700 placeholder-slate-300 disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    applyMutation.isPending ||
                    role === "student" ||
                    role === "admin"
                  }
                  className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] shadow-xl shadow-blue-500/10 transition-all active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15} />{" "}
                  {applyMutation.isPending ? "Submitting..." : "Apply for this Job"}
                </button>
              </form>

              <p className="text-[11px] text-center text-slate-400 font-bold uppercase tracking-widest pt-2">
                ID: ET-{id?.substring(0, 6).toUpperCase() || "001"}
              </p>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-[#40bfff]/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-blue-100 flex flex-col justify-center h-full">
              <h4 className="text-sm sm:text-md font-black text-slate-800 mb-2.5">
                Safety Tips
              </h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Never pay any upfront advanced tokens to get a tuition match.
                Verified tutors and parents deal securely through eTuitionBD
                escrow policies.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default TuitionDetails;