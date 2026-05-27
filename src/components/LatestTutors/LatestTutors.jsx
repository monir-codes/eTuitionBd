import { motion } from "framer-motion";
import { Star, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const LatestTutors = () => {
  const axiosSecure = useAxios();

  // 🔄 TanStack Query: ব্যাকএন্ড থেকে টিউটরদের ডাটা লাইভ গেট করা
  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["top-tutors-home-static"],
    queryFn: async () => {
      // ব্যাকএন্ড এপিআই ফিল্টার দিয়ে টিউটরদের লিস্ট আনা হলো
      const res = await axiosSecure.get("/api/users", {
        params: { role: "tutor", limit:3 }
      });
      
      // ব্যাকএন্ড অবজেক্ট রেসপন্স বা ডিরেক্ট অ্যারে—উভয় ফরম্যাট হ্যান্ডেল করা হয়েছে
      // const allTutors = Array.isArray(res.data) ? res.data : res.data?.users || [];
      
      // হোম পেজের গ্রিড লেআউট পারফেক্ট রাখতে লেটেস্ট সর্বোচ্চ ৩ জন টিউটরকে কেটে নেওয়া হলো
      return res.data.tutors
    },
  });

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }} 
      className="py-24 bg-white select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ⚙️ Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              Our Top <span className="text-[#40bfff]">Tutors</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg">Learn from the most highly rated educators on the platform.</p>
          </div>
          <Link to="/tutors" className="hidden md:flex items-center gap-2 font-black text-[#40bfff] hover:underline uppercase tracking-wider text-xs">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>

        {/* ⏳ লোডিং স্টেট */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#40bfff]" size={36} />
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Loading Top Educators...</p>
          </div>
        ) : (
          /* 📚 Live Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.length > 0 ? (
              tutors.map((tutor, idx) => (
                <motion.div
                  key={tutor._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-[3rem] border border-slate-100 bg-slate-50/40 hover:bg-white hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 text-center flex flex-col justify-between h-full"
                >
                  <div>
                    {/* 📸 Profile Image / Avatar */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-md bg-slate-100">
                        <img 
                          src={tutor.photo || tutor.photoURL || tutor.image || "https://i.ibb.co/default-avatar.png"} 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      </div>
                      {/* ভেরিফাইড মেডেল ব্যাজ */}
                      {(tutor.verified || tutor.status === "active") && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md border border-slate-50">
                          <CheckCircle size={18} className="text-[#40bfff]" fill="#40bfff" style={{ color: "white" }} />
                        </div>
                      )}
                    </div>

                    {/* Tutor Name */}
                    <h4 className="text-2xl font-black text-slate-800 mb-1 max-w-full truncate">
                      {tutor.name || tutor.displayName}
                    </h4>
                    
                    {/* Institution / Skills fallback */}
                    <p className="text-[#40bfff] font-black text-xs mb-5 uppercase tracking-widest min-h-[1rem] line-clamp-1">
                      {tutor.subject || tutor.institution || "General Educator"}
                    </p>
                    
                    {/* Metrics Indicators */}
                    <div className="flex justify-center items-center gap-4 mb-8">
                      <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
                        <Star size={13} fill="#f1c40f" className="text-[#f1c40f]" />
                        <span className="text-xs font-black text-slate-700">{tutor.rating || "5.0"}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        {tutor.experience || "Fresh Exp."}
                      </span>
                    </div>
                  </div>

                  {/* Profile Details Button */}
                  <Link to={`/tutor/${tutor._id}`}>
                    <button className="w-full py-4 rounded-2xl bg-white border-2 border-slate-100/80 font-black text-sm text-slate-700 hover:border-[#40bfff] hover:text-[#40bfff] transition-all active:scale-95 shadow-sm">
                      View Profile
                    </button>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-300 font-bold uppercase tracking-wider">
                No active tutors listed at this moment.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestTutors;