import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, Star, CheckCircle, BookOpen, GraduationCap, 
  Briefcase, MessageSquare, BadgeCheck, Video, Loader2, AlertTriangle, ArrowLeft 
} from "lucide-react";
import useAxios from "../../hooks/useAxios";

const TutorProfile = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // 🔄 TanStack Query
  const { data: tutor = {}, isLoading, isError, error } = useQuery({
    queryKey: ["tutor-profile", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/user/${id}`);
      return res.data;
    },
  });

  // ⏳ লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest text-center">Compiling Tutor Dossier...</p>
      </div>
    );
  }

  // ⚠️ এরর স্টেট
  if (isError || !tutor._id) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Profile Sync Error: {error?.message || "Tutor Not Found"}</p>
        <button onClick={() => navigate("/tutors")} className="mt-4 px-6 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider">
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-24 sm:pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔙 Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#40bfff] mb-6 sm:mb-8 transition-colors uppercase tracking-widest text-[10px] sm:text-xs"
        >
          <ArrowLeft size={16} /> Back to Previous Board
        </button>

        {/* 📐 মেইন গ্রিড লেআউট: মোবাইলে ১ কলাম, ডেক্সটপে ৩ কলাম */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* 👤 Left Sidebar: মোবাইলে সবার ওপরে থাকবে, ডেক্সটপে স্টিকি সাইডবার হবে */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:sticky lg:top-28"
          >
            {/* Main Avatar Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm text-center flex flex-col justify-between h-full">
              <div>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-5 sm:mb-6">
                  <div className="w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-white shadow-md bg-slate-55">
                    <img 
                      src={tutor.photo || tutor.photoURL || tutor.image || "https://i.ibb.co/default-avatar.png"} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  {(tutor.verified || tutor.status === "active") && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-slate-100">
                      <CheckCircle size={18} className="text-[#40bfff]" fill="#40bfff" style={{ color: "white" }} />
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1 leading-tight break-words max-w-full">
                  {tutor.name || tutor.displayName}
                </h1>
                <p className="text-[#40bfff] font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-4 min-h-[1rem] line-clamp-2">
                  {tutor.institution || "Professional Educator"}
                </p>
                
                <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100/50">
                    <Star size={13} fill="#f1c40f" className="text-[#f1c40f]" />
                    <span className="text-xs font-black text-slate-700">{tutor.rating || "5.0"}</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    {tutor.experience || "Fresh Exp."}
                  </span>
                </div>

                <div className="space-y-3.5 text-left border-t border-slate-50 pt-5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-600 font-bold min-w-0">
                    <MapPin size={18} className="text-rose-400 shrink-0" /> 
                    <span className="truncate">Location: <span className="text-slate-800">{tutor.district || "Bogra, BD"}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold min-w-0">
                    <Briefcase size={18} className="text-sky-400 shrink-0" /> 
                    <span className="truncate">Role: <span className="text-slate-800 capitalize">{tutor.role || "Tutor"}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold min-w-0">
                    <GraduationCap size={18} className="text-indigo-400 shrink-0" /> 
                    <span className="truncate">Degree: <span className="text-slate-800">{tutor.qualification || "Graduate"}</span></span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 sm:mt-8 py-3.5 rounded-xl sm:rounded-2xl bg-slate-950 text-white font-black hover:bg-[#40bfff] shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm duration-300">
                <MessageSquare size={16} /> Contact Tutor
              </button>
            </div>

            {/* Demo Session Card */}
            <div className="bg-[#40bfff]/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-blue-100 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Video size={18} className="text-[#40bfff]" />
                  <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm sm:text-base">Demo Session</h4>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold leading-relaxed mb-4">
                  Book a 15-minute free interview or demo session via eTuitionBD meeting logs to assess requirements.
                </p>
              </div>
              <button className="w-full py-3 rounded-xl border-2 border-[#40bfff] text-[#40bfff] font-black hover:bg-[#40bfff] hover:text-white transition-all text-xs sm:text-sm active:scale-95 bg-white sm:bg-transparent">
                Book Free Demo
              </button>
            </div>
          </motion.div>

          {/* 📝 Right Side: Bio & Detailed Info - মোবাইলেও ফুল কন্টেন্ট রেডি থাকবে */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8 w-full"
          >
            {/* About / Bio Section */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <BadgeCheck className="text-[#40bfff] shrink-0" size={22} /> Biography & Ethos
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed break-words">
                {tutor.bio || "No professional overview or bio statement drafted yet by the tutor. Verification and background checks are fully complete."}
              </p>
            </div>

            {/* Education & Expertise Grid - মোবাইলে ১ কলাম, ট্যাবলেটে ২ কলাম */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Academic Placement */}
              <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="text-[#40bfff] shrink-0" size={20} /> Academic Institution
                  </h3>
                  <p className="text-slate-800 font-black text-base sm:text-lg break-words">{tutor.institution || "Not Specified"}</p>
                </div>
                <p className="text-slate-400 font-black text-[10px] mt-6 uppercase tracking-wider border-t border-slate-50 pt-3">
                  {tutor.qualification || "Undergraduate"}
                </p>
              </div>

              {/* Skills / Expertise */}
              <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="text-[#40bfff] shrink-0" size={20} /> Verified Subject Expertise
                </h3>
                <div className="flex flex-wrap gap-2 max-w-full">
                  {tutor.skills || tutor.subject ? (
                    Array.isArray(tutor.skills) ? tutor.skills.map((item, idx) => (
                      <span key={idx} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs sm:text-sm border border-slate-100 max-w-full truncate">
                        {item}
                      </span>
                    )) : (
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs sm:text-sm border border-slate-100 max-w-full truncate">
                        {tutor.subject}
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">General Subjects Only</span>
                  )}
                </div>
              </div>
            </div>

            {/* Platform Milestones */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 tracking-tight">Platform Milestones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50/40 rounded-2xl border border-blue-50/50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <BadgeCheck size={18} className="text-[#40bfff]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Account Integrity</p>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm block truncate">Background Verified</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50/40 rounded-2xl border border-blue-50/50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Star size={18} className="text-amber-400" fill="#f1c40f" style={{ color: "#f1c40f" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Rating Index</p>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm block truncate">{tutor.rating || "5.0"} Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default TutorProfile;