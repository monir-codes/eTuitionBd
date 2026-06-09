import { motion } from "framer-motion";
import { Users, GraduationCap, Video, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const StatsCounter = () => {
  const axiosSecure = useAxios();

  // 🔥 TanStack React Query v5 (আপনার তৈরি করা ব্যাকএন্ড এপিআই থেকে রিয়েল কাউন্ট ডাটা আনবে)
  const { data: liveStats = { totalStudents: 0, totalTutors: 0, totalTuitions: 0 } } = useQuery({
    queryKey: ["publicPlatformStats"], // Hero সেকশনের সাথে সেম কিউ-কী রাখায় এক্সট্রা সার্ভার রিকোয়েস্ট হবে না, ক্যাশ থেকে আসবে ভাই
    queryFn: async () => {
      const res = await axiosSecure.get("/api/public-stats");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // ৫ মিনিট ক্যাশে লক থাকবে
  });

  // 📊 ডাইনামিক রিয়েল ডাটা অ্যারে স্ট্রাকচার
  const stats = [
    {
      id: 1,
      icon: <Users className="text-blue-500" />,
      value: `${liveStats?.totalStudents || 0}+`, // রিয়েল ডাটাবেজ কাউন্ট
      label: "Registered Students",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      icon: <GraduationCap className="text-emerald-500" />,
      value: `${liveStats?.totalTutors || 0}+`, // রিয়েল ডাটাবেজ কাউন্ট
      label: "Verified Tutors",
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      icon: <Video className="text-rose-500" />,
      value: `${liveStats?.totalTuitions || 0}+`, // রিয়েল ডাটাবেজ কাউন্ট
      label: "Live Tuitions",
      bg: "bg-rose-50",
    },
    {
      id: 4,
      icon: <Star className="text-amber-500" />,
      value: "4.9/5", // এটি একটি ফিক্সড এভারেজ রিভিউ ভ্যালু (সেফ জোন)
      label: "Average Rating",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="py-16 bg-[#f8fafc]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              {/* Icon Circle */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-12`}>
                {stat.icon}
              </div>

              {/* Stats Number */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-none mb-2">
                {stat.value}
              </h3>

              {/* Label */}
              <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;