import { motion } from "framer-motion";
import { MapPin, Clock, CircleDollarSign, GraduationCap, ArrowRight, Loader2, AlertTriangle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios"; // আপনার কাস্টম এক্সিওস হুক

const LatestTuitions = () => {
  const axiosSecure = useAxios();

  // 🔄 TanStack Query: ব্যাকএন্ড থেকে লেটেস্ট টুইশন ডাটা রিয়েল-টাইমে তুলে আনা
  const { data: tuitions = [], isLoading, isError } = useQuery({
    queryKey: ["latest-tuitions-home"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions");
      
      // ব্যাকএন্ড যদি পেজিনেশন অবজেক্ট পাঠায় { tuitions: [...] } অথবা ডিরেক্ট অ্যারে পাঠায়, দুইটাই হ্যান্ডেল করা হয়েছে
      const allPosts = Array.isArray(res.data) ? res.data : res.data?.tuitions || [];
      
      // হোম পেজের লেআউট ঠিক রাখতে লেটেস্ট প্রথম ৩টি পোস্ট স্লাইস করে নেওয়া হলো
      return allPosts.slice(0, 3);
    },
  });

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="py-24 bg-[#f0f9ff]/30 select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
            >
              Latest <span className="text-[#40bfff]">Tuition Jobs</span>
            </motion.h2>
            <p className="text-slate-500 font-bold text-lg">
              Explore the most recent tuition opportunities and apply to start your teaching journey.
            </p>
          </div>
          <Link to="/tuitions" className="group flex items-center gap-2 font-black text-[#40bfff] text-lg hover:underline decoration-2 underline-offset-8 uppercase tracking-wider text-xs">
            View All Jobs <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* ⏳ ডাটা ফেচিং লোডিং গেটওয়ে */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#40bfff]" size={36} />
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Scanning Fresh Circulars...</p>
          </div>
        )}

        {/* ⚠️ ডাটাবেজ এরর স্টেট ফলব্যাক */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-rose-500">
            <AlertTriangle size={36} />
            <p className="font-black uppercase tracking-wider text-sm">Failed to sync live tuition stream</p>
          </div>
        )}

        {/* Tuition Cards Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tuitions.length > 0 ? (
              tuitions.map((job, idx) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white p-8 rounded-[3rem] border border-slate-100/80 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue-100/60 transition-all duration-500 flex flex-col justify-between h-full group"
                >
                  <div>
                    {/* Category Badge row */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-widest border border-blue-100/40">
                        {job.category || "General Medium"}
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        {job.postedAt || "Recent"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-slate-800 mb-5 group-hover:text-[#40bfff] transition-colors leading-snug min-h-[3.5rem] line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Info Details Section */}
                    <div className="space-y-3.5 mb-8">
                      {/* ✅ ক্লাস লেভেল ট্র্যাকিং */}
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                        <GraduationCap size={18} className="text-indigo-500/80" />
                        <span>Class: <span className="text-slate-800">{job.classLevel || job.studentClass || "Not Specified"}</span></span>
                      </div>

                      {/* সাবজেক্ট */}
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                        <BookOpen className="hidden" /> {/* প্রটেকশন ট্যাগ */}
                        <GraduationCap size={18} className="text-amber-500/80" />
                        <span>Subject: <span className="text-slate-800">{job.subject || "General"}</span></span>
                      </div>

                      {/* লোকেশন */}
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                        <MapPin size={18} className="text-rose-400/80 shrink-0" />
                        <span className="text-slate-700 truncate" title={job.location}>{job.location}</span>
                      </div>

                      {/* শিডিউল দিন */}
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                        <Clock size={18} className="text-sky-500/80" />
                        <span>Schedule: <span className="text-slate-800">{job.days || job.daysPerWeek || "N/A"}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Budget & Bottom Navigation CTA Row */}
                  <div className="border-t border-slate-50 pt-5 mt-auto space-y-5">
                    <div className="flex items-center gap-1.5 text-[#2ecc71] font-black text-xl">
                      <CircleDollarSign size={20} />
                      <span>{job.salary}</span>
                    </div>

                    <Link to={`/tuitions/${job._id}`} className="block w-full">
                      <button className="w-full py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-[#40bfff] shadow-md hover:shadow-blue-100 transition-all active:scale-95 text-sm duration-300">
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-300 font-bold uppercase tracking-wider">
                No recent tuition openings posted yet.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestTuitions;