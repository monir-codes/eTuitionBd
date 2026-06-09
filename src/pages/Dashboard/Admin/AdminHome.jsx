import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Users, GraduationCap, FileText, ShieldAlert, AlertTriangle } from "lucide-react";
import Loading from "../../Loading/Loading";

// 📊 Chart.js এবং React-Chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminHome = () => {
  const axiosSecure = useAxios();

  // 🔄 ১. TanStack Query দিয়ে ডাটাবেজ থেকে ওভারভিউ কার্ড ও চার্টের ডাটা ফেচিং
  const { data: statsData, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/dashboard-stats");
      return res.data;
    }
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider text-sm">
          Database Sync Failure: {error.message}
        </p>
      </div>
    );
  }

  // 📊 ২. লাইভ ডাটা ভেরিয়েবলস
  const totalStudents = statsData?.totalStudents || 0;
  const verifiedTutors = statsData?.verifiedTutors || 0;
  const activeTuitions = statsData?.activeTuitions || 0;
  const pendingTuitions = statsData?.pendingTuitions || 0;

  const stats = [
    { id: 1, label: "Total Students", value: totalStudents, icon: <Users size={24} />, bg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100", border: "hover:border-blue-200" },
    { id: 2, label: "Verified Tutors", value: verifiedTutors, icon: <GraduationCap size={24} />, bg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-100", border: "hover:border-emerald-200" },
    { id: 3, label: "Active Tuitions", value: activeTuitions, icon: <FileText size={24} />, bg: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-100", border: "hover:border-amber-200" },
    { id: 4, label: "Pending Approvals", value: pendingTuitions, icon: <ShieldAlert size={24} />, bg: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-100", border: "hover:border-rose-200" },
  ];

  // 📊 ৩. চার্ট কনফিগারেশন (SaaS Minimalist Style)
  const mixChartData = {
    labels: ["Students", "Tutors", "Tuitions"],
    datasets: [
      {
        type: "line",
        label: "Growth Trend",
        borderColor: "#10b981",
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 5,
        data: [totalStudents, verifiedTutors, activeTuitions],
        tension: 0.35,
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.04)"
      },
      {
        type: "bar",
        label: "Platform Scale",
        backgroundColor: "rgba(64, 191, 255, 0.85)",
        hoverBackgroundColor: "#40bfff",
        data: [totalStudents, verifiedTutors, activeTuitions],
        borderRadius: 12,
        barThickness: 32,
      }
    ]
  };

  const pieChartData = {
    labels: ["Active", "Pending"],
    datasets: [
      {
        data: [activeTuitions, pendingTuitions],
        backgroundColor: ["#40bfff", "#ff6b6b"],
        hoverBackgroundColor: ["#2bb1f5", "#fa5252"],
        borderWidth: 4,
        borderColor: "#ffffff",
      }
    ]
  };

  const globalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: "top", 
        labels: { boxWidth: 12, font: { family: "League Spartan", weight: "700", size: 12 }, padding: 15 } 
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 overflow-hidden relative" 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-0.5">Admin Overview</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">System analytics and platform health</p>
      </div>

      {/* 📊 Premium Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {stats.map((stat) => (
          <motion.div 
            key={stat.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-300 w-full min-w-0 relative overflow-hidden group ${stat.border}`}
          >
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-wider break-words whitespace-normal leading-tight">{stat.label}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 tracking-tight leading-none">{stat.value.toLocaleString("en-US")}</h3>
              </div>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bg} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📉 চার্ট প্যানেল (এখন এটাই ওভারভিউয়ের মেইন আকর্ষণ ভাই) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full pt-2">
        
        {/* ক) Bar & Line Mix Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm lg:col-span-2 h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">Platform Analytics Growth</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Visual representation of real-time server distribution data</p>
          </div>
          <div className="w-full flex-grow relative h-[250px]">
            <Bar data={mixChartData} options={globalChartOptions} />
          </div>
        </div>

        {/* খ) Pie Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">Tuition Status Ratio</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Live comparison of active vs pending circulars</p>
          </div>
          <div className="w-full flex-grow relative h-[200px] flex items-center justify-center">
            <Pie data={pieChartData} options={{...globalChartOptions, cutout: "65%"}} />
          </div>
          <div className="flex justify-center gap-6 text-xs font-black text-slate-500 pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#40bfff]" /> <span>Active ({activeTuitions})</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff6b6b]" /> <span>Pending ({pendingTuitions})</span></div>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default AdminHome;