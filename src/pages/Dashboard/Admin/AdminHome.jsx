import { motion } from "framer-motion";
import { Users, GraduationCap, FileText, ShieldAlert, ArrowRight, CheckCircle } from "lucide-react";

const AdminHome = () => {
  // Mock Stats Data: ব্যাকএন্ড কাউন্ট API এর সাথে কানেক্ট করার জন্য রেডি
  const stats = [
    { id: 1, label: "Total Students", value: "1,240", icon: <Users size={24} />, bg: "bg-blue-50", text: "text-[#40bfff]" },
    { id: 2, label: "Verified Tutors", value: "480", icon: <GraduationCap size={24} />, bg: "bg-emerald-50", text: "text-emerald-500" },
    { id: 3, label: "Active Tuitions", value: "185", icon: <FileText size={24} />, bg: "bg-amber-50", text: "text-amber-500" },
    { id: 4, label: "Pending Approvals", value: "14", icon: <ShieldAlert size={24} />, bg: "bg-rose-50", text: "text-rose-500" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Admin Overview</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">System analytics and platform health</p>
      </div>

      {/* 📊 Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔔 Recent Activity Logs */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-6">Recent System Activities</h3>
        <div className="space-y-4">
          {[
            { text: "New tutor registered from BUET", time: "5 mins ago", type: "info" },
            { text: "Tuition post approved for Class 10 (Math)", time: "25 mins ago", type: "success" },
            { text: "User reported a spam tuition post", time: "1 hour ago", type: "alert" },
          ].map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#40bfff]" />
                <span className="font-bold text-sm text-slate-700">{activity.text}</span>
              </div>
              <span className="text-xs font-bold text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;