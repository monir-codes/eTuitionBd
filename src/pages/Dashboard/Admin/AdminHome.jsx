import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Users, GraduationCap, FileText, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import Loading from "../../Loading/Loading";

const AdminHome = () => {
  const axiosSecure = useAxios();

  // 🔄 ১. TanStack Query দিয়ে ডাটাবেজ থেকে সব লাইভ স্ট্যাটাস কাউন্ট ফেচ করা
  const { data: statsData, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/dashboard-stats");
      return res.data;
    }
  });

  // ⏳ ২. লোডিং এবং এরর স্টেট হ্যান্ডলার
  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider text-sm">Overview Sync Failure: {error.message}</p>
      </div>
    );
  }

  // 📊 ৩. লাইভ ডাটা ম্যাপিং স্ট্রাকচার
  const stats = [
    { 
      id: 1, 
      label: "Total Students", 
      value: statsData?.totalStudents || 0, 
      icon: <Users size={22} />, 
      bg: "bg-blue-50", 
      text: "text-[#40bfff]" 
    },
    { 
      id: 2, 
      label: "Verified Tutors", 
      value: statsData?.verifiedTutors || 0, 
      icon: <GraduationCap size={22} />, 
      bg: "bg-emerald-50", 
      text: "text-emerald-500" 
    },
    { 
      id: 3, 
      label: "Active Tuitions", 
      value: statsData?.activeTuitions || 0, 
      icon: <FileText size={22} />, 
      bg: "bg-amber-50", 
      text: "text-amber-500" 
    },
    { 
      id: 4, 
      label: "Pending Approvals", 
      value: statsData?.pendingTuitions || 0, 
      icon: <ShieldAlert size={22} />, 
      bg: "bg-rose-50", 
      text: "text-rose-500" 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto px-1 sm:px-2 py-2 overflow-hidden" // 🔥 কন্টেইনার লেভেলে ওয়ানড্রাইভ ওভারফ্লো প্রোটেকশন লক
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Admin Overview</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">System analytics and platform health</p>
      </div>

      {/* 📊 Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-5 group hover:border-[#40bfff]/30 transition-all duration-200 w-full min-w-0"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bg} ${stat.text} rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-wider truncate">{stat.label}</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
                {stat.value.toLocaleString("en-US")}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔔 Recent Activity Logs (লং টেক্সট ফিক্সড ইউআই) */}
      <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm w-full">
        <div className="mb-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-800">Recent System Activities</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Live tracking events recorded by operational engines</p>
        </div>

        <div className="space-y-3 w-full">
          {[
            { text: "New tutor profile registered from regional hub with complete educational background verification papers submitted", time: "Just now", color: "text-[#40bfff] bg-blue-50/50" },
            { text: "Tuition post approved successfully for Class 10 (Science Core containing Higher Math and Physics curriculum)", time: "25 mins ago", color: "text-emerald-500 bg-emerald-50/50" },
            { text: "System executed database validation checks and cleared historical junk caching assets successfully", time: "1 hour ago", color: "text-amber-500 bg-amber-50/50" },
          ].map((activity, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 gap-3 sm:gap-6 transition-colors hover:bg-slate-100/30 w-full min-w-0"
            >
              {/* লেফট সাইড: আইকন এবং রেসপন্সিভ টেক্সট র‍্যাপার */}
              <div className="flex items-start gap-3 min-w-0 flex-1"> {/* 🔥 items-start দেওয়া হলো যাতে টেক্সট বড় হলেও আইকন ওপরে ঠিক থাকে */}
                <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${activity.color}`}>
                  <CheckCircle size={14} />
                </div>
                {/* 🎯 লং টেক্সট প্রোটেকশন: truncate বাদ দিয়ে break-words এবং whitespace-normal করা হলো */}
                <span className="font-bold text-xs sm:text-sm text-slate-700 break-words whitespace-normal leading-relaxed flex-1">
                  {activity.text}
                </span>
              </div>
              
              {/* রাইট সাইড: টাইমস্ট্যাম্প */}
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 shrink-0 sm:text-right pl-9 sm:pl-0 mt-0.5 sm:mt-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;