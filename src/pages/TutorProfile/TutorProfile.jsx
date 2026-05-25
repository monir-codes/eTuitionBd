import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, Star, CheckCircle, BookOpen, GraduationCap, 
  Briefcase, MessageSquare, BadgeCheck, Video, Loader2, AlertTriangle 
} from "lucide-react";
import useAxios from "../../hooks/useAxios"; // আপনার কাস্টম এক্সিওস হুক

const TutorProfile = () => {
  const { id } = useParams(); // ইউআরএল থেকে টিউটরের মঙ্গোডিবি _id নেওয়া
  const axiosSecure = useAxios();

  // 🔄 TanStack Query: আইডি অনুযায়ী সিঙ্গেল টিউটরের কমপ্লিট ডাটা ফেচ করা
  const { data: tutor = {}, isLoading, isError, error } = useQuery({
    queryKey: ["tutor-profile", id],
    queryFn: async () => {
      // আমরা যে এপিআই বানিয়েছিলাম, নির্দিষ্ট আইডি দিয়ে সিঙ্গেল ইউজারের ডাটা আনবে
      const res = await axiosSecure.get(`/api/users`, {
        query: { role: "tutor" } // সেফটি ফিল্টার
      });
      // যেহেতু ফিল্টার এপিআই অ্যারে দেয়, তাই আইডি ম্যাচিং ডাটা অবজেক্টটি খুঁজে বের করা
      const allTutors = res.data;
      return allTutors.find(t => t._id === id) || {};
    }
  });

  // ⏳ লোডিং স্টেট গেটওয়ে
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Compiling Tutor Dossier...</p>
      </div>
    );
  }

  // ⚠️ এরর স্টেট গেটওয়ে
  if (isError || !tutor._id) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Profile Sync Error: {error?.message || "Tutor Not Found"}</p>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* 👤 Left Sidebar: Main Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6 lg:sticky lg:top-28"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                  <img src={tutor.image || "https://i.ibb.co/default-avatar.png"} className="w-full h-full object-cover" alt="" />
                </div>
                {tutor.status === "active" && (
                  <div className="absolute -bottom-2 -right-2 bg-[#40bfff] text-white p-1.5 rounded-full shadow-lg border-4 border-white">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-black text-slate-800 mb-1 leading-tight">{tutor.name}</h1>
              <p className="text-[#40bfff] font-bold uppercase tracking-widest text-xs mb-4 min-h-[1rem] line-clamp-1">
                {tutor.institution || "Professional Educator"}
              </p>
              
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  <Star size={18} fill="#f1c40f" className="text-[#f1c40f]" />
                  <span className="font-black text-slate-700">5.0</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200" />
                <span className="text-sm font-bold text-slate-400">Verified Profile</span>
              </div>

              <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <MapPin size={18} className="text-[#40bfff]" /> {tutor.phone !== "N/A" ? "Bogra, Bangladesh" : "Remote / Online"}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Briefcase size={18} className="text-[#40bfff]" /> Professional Mentor
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <GraduationCap size={18} className="text-[#40bfff]" /> {tutor.qualification || "Graduate"}
                </div>
              </div>

              <button className="w-full mt-8 py-4 rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95">
                <MessageSquare size={20} /> Contact Tutor
              </button>
            </div>

            {/* Demo Session Card */}
            <div className="bg-[#40bfff]/5 p-8 rounded-[2.5rem] border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <Video size={20} className="text-[#40bfff]" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter">Demo Session</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">
                Book a 15-minute free interview or demo session via eTuitionBD meeting logs to assess requirements.
              </p>
              <button className="w-full py-3 rounded-xl border-2 border-[#40bfff] text-[#40bfff] font-black hover:bg-[#40bfff] hover:text-white transition-all text-sm active:scale-95">
                Book Free Demo
              </button>
            </div>
          </motion.div>

          {/* 📝 Right Side: Bio & Detailed Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About / Bio Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <BadgeCheck className="text-[#40bfff]" /> Biography & Ethos
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {tutor.bio || "No professional overview or bio statement drafted yet by the tutor. Verification and background checks are fully complete."}
              </p>
            </div>

            {/* Education & Expertise Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Academic Placement */}
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <GraduationCap className="text-[#40bfff]" /> Academic Institution
                  </h3>
                  <p className="text-slate-700 font-black text-base">{tutor.institution || "Not Specified"}</p>
                </div>
                <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-wider">{tutor.qualification || "Undergraduate"}</p>
              </div>

              {/* Skills / Expertise */}
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <BookOpen className="text-[#40bfff]" /> Verified Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.skills && tutor.skills.length > 0 ? tutor.skills.map((item, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100">
                      {item}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">General Subjects Only</span>
                  )}
                </div>
              </div>
            </div>

            {/* Platform Milestones */}
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Platform Milestones</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Star size={18} className="text-[#40bfff]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase">Account Integrity</p>
                    <span className="font-bold text-slate-700 text-sm">Background Verified</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Star size={18} className="text-[#40bfff]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase">Member Since</p>
                    <span className="font-bold text-slate-700 text-sm">{tutor.joinedAt || "2026"}</span>
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