import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Users, GraduationCap, FileText, ShieldAlert, AlertTriangle } from "lucide-react";
import Loading from "../../Loading/Loading";

// 📊 Chart.js এবং React-Chartjs-2 (আগের মতোই ইমপোর্ট)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  PieController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,

  BarElement,
  BarController,

  LineElement,
  LineController,

  PointElement,

  ArcElement,
  PieController,

  Title,
  Tooltip,
  Legend,
  Filler
);
const AdminHome = () => {
  const axiosSecure = useAxios();

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
        <p className="font-black uppercase tracking-wider text-sm">Database Sync Failure: {error.message}</p>
      </div>
    );
  }

  const { totalStudents, verifiedTutors, activeTuitions, pendingTuitions } = statsData;

  const stats = [
    { id: 1, label: "Total Students", value: totalStudents, icon: <Users size={24} />, bg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100", border: "hover:border-blue-200" },
    { id: 2, label: "Verified Tutors", value: verifiedTutors, icon: <GraduationCap size={24} />, bg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-100", border: "hover:border-emerald-200" },
    { id: 3, label: "Active Tuitions", value: activeTuitions, icon: <FileText size={24} />, bg: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-100", border: "hover:border-amber-200" },
    { id: 4, label: "Pending Approvals", value: pendingTuitions, icon: <ShieldAlert size={24} />, bg: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-100", border: "hover:border-rose-200" },
  ];

  const mixChartData = {
    labels: ["Students", "Tutors", "Tuitions"],
    datasets: [
      { type: "line", label: "Growth Trend", borderColor: "#10b981", borderWidth: 3, pointBackgroundColor: "#fff", pointBorderColor: "#10b981", pointBorderWidth: 2, pointRadius: 5, data: [totalStudents, verifiedTutors, activeTuitions], tension: 0.35, fill: true, backgroundColor: "rgba(16, 185, 129, 0.04)" },
      { type: "bar", label: "Platform Scale", backgroundColor: "rgba(64, 191, 255, 0.85)", hoverBackgroundColor: "#40bfff", data: [totalStudents, verifiedTutors, activeTuitions], borderRadius: 12, barThickness: 32 }
    ]
  };

  const pieChartData = {
    labels: ["Active", "Pending"],
    datasets: [{ data: [activeTuitions, pendingTuitions], backgroundColor: ["#40bfff", "#ff6b6b"], hoverBackgroundColor: ["#2bb1f5", "#fa5252"], borderWidth: 4, borderColor: "#ffffff" }]
  };

  const globalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { boxWidth: 12, font: { family: "League Spartan", weight: "700", size: 12 }, padding: 15 } }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-0.5">Admin Overview</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">System analytics and platform health</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {stats.map((stat) => (
          <motion.div key={stat.id} whileHover={{ y: -4, scale: 1.01 }} className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-300 w-full relative overflow-hidden ${stat.border}`}>
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 tracking-tight leading-none">{stat.value.toLocaleString("en-US")}</h3>
              </div>
              <div className={`w-12 h-12 ${stat.bg} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full pt-2">
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm lg:col-span-2 h-[380px]">
          <h3 className="text-base font-black text-slate-800">Platform Analytics Growth</h3>
          <div className="w-full h-[250px] relative"><Bar data={mixChartData} options={globalChartOptions} /></div>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm h-[380px]">
          <h3 className="text-base font-black text-slate-800">Tuition Status Ratio</h3>
          <div className="w-full h-[200px] relative"><Pie data={pieChartData} options={{...globalChartOptions, cutout: "65%"}} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;