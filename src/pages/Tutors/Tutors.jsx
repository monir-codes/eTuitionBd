import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, CheckCircle, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios"; // আপনার কাস্টম এক্সিওস হুক

const Tutors = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 TanStack Query: সার্চ বক্সে টাইপ করার সাথে সাথে রিয়েল-টাইম ফিল্টারড টিউটর ডাটা ফেচ হবে
  const { data: tutors = [], isLoading, isError, error } = useQuery({
    queryKey: ["public-tutors", searchTerm], // 👈 searchTerm চেঞ্জ হলেই কুয়েরি অটোমেটিক রি-ফায়ার হবে
    queryFn: async () => {
      // পাবলিক পেজে শুধু টিউটরদের দেখাবো, তাই role=tutor ফিক্সড এবং সার্চ টার্ম ডাইনামিক
      const res = await axiosSecure.get("/api/users", {
        query: {
          role: "tutor",
          search: searchTerm,
        },
      });
      return res.data;
    },
  });

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🔍 Heading & Search Box */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            Find Your <span className="text-[#40bfff]">Perfect Tutor</span>
          </motion.h2>
          <p className="text-slate-500 font-bold text-lg mb-8">Search from our verified pool of expert educators.</p>
          
          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, institution, or skills (e.g. Chemistry, ICT)..." 
                className="w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold outline-none text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-10 h-14 rounded-2xl w-full md:w-auto shadow-lg shadow-blue-100 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* ⏳ লোডিং স্টেট গেটওয়ে */}
        {isLoading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#40bfff]" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Scanning Premium Tutors...</p>
          </div>
        )}

        {/* ⚠️ এরর স্টেট গেটওয়ে */}
        {isError && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-rose-500">
            <AlertTriangle size={40} />
            <p className="font-black uppercase tracking-wider">Sync Error: {error.message}</p>
          </div>
        )}

        {/* 🎓 Tutors Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.length > 0 ? tutors.map((tutor, idx) => (
              <motion.div
                key={tutor._id} // মঙ্গোডিবি-র আসল ইউনিক আইডি বাইন্ডিং
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[3rem] border border-slate-100 bg-white hover:shadow-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col items-center text-center group"
              >
                {/* Profile Image & Verification Badge */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md group-hover:border-[#40bfff] transition-colors duration-500">
                    <img 
                      src={tutor.image || "https://i.ibb.co/default-avatar.png"} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  {/* টিউটরের স্ট্যাটাস অ্যাক্টিভ হলে আমরা সেটিকে ভেরিফাইড মেডেল হিসেবে ইউআই-তে ট্রিট করতে পারি */}
                  {tutor.status === "active" && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                      <CheckCircle size={22} className="text-[#40bfff]" fill="white" />
                    </div>
                  )}
                </div>

                <h4 className="text-2xl font-black text-slate-800 mb-1 leading-tight group-hover:text-[#40bfff] transition-colors">
                  {tutor.name}
                </h4>
                
                {/* ইনস্টিটিউট অবজেক্ট ডাটা */}
                <p className="text-[#40bfff] font-bold text-xs mb-2 uppercase tracking-widest min-h-[1rem] line-clamp-1">
                  {tutor.institution || "Independent Mentor"}
                </p>

                {/* কোয়ালিফিকেশন / ডিগ্রি টেক্সট */}
                <p className="text-slate-400 font-bold text-xs mb-5 lowercase first-letter:uppercase">
                  {tutor.qualification || "Expert Educator"}
                </p>
                
                {/* টিউটর স্ট্যাটিস্টিকস (লোকেশন এবং স্কিল কাউন্ট বা ডিফল্ট রেটিং) */}
                <div className="flex flex-wrap justify-center items-center gap-3 mb-8 mt-auto">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                    <Star size={14} fill="#f1c40f" className="text-[#f1c40f]" />
                    <span className="text-xs font-black text-slate-700">5.0</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/30">
                    <MapPin size={14} className="text-[#40bfff]" />
                    <span className="text-xs font-black text-slate-600 line-clamp-1">{tutor.phone !== "N/A" ? "Bogra" : "Remote"}</span>
                  </div>
                </div>

                {/* 🔗 ডাইনামিকলি টিউটর প্রোফাইল লিঙ্কিং */}
                <Link to={`/tutor/${tutor._id}`} className="w-full mt-auto">
                  <button className="w-full py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-black text-slate-700 hover:bg-[#40bfff] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn">
                    View Profile <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                <AlertTriangle size={36} className="text-slate-300" />
                <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
                  No expert tutors found matching your keywords
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Tutors;