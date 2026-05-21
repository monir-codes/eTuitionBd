import { motion } from "framer-motion";
import { Calendar, MapPin, CircleDollarSign, Info } from "lucide-react";

const AppliedJobs = () => {
  // Mock Data: Backend-ready dynamic array
  const appliedJobs = [
    {
      id: 1,
      title: "Need a Tutor for Class 10 Student",
      subject: "Mathematics",
      location: "Bogra Sadar",
      salary: "5000 BDT",
      appliedDate: "May 18, 2026",
      status: "pending"
    },
    {
      id: 2,
      title: "HSC Physics Tutor Needed",
      subject: "Physics",
      location: "Banani, Dhaka",
      salary: "8000 BDT",
      appliedDate: "May 10, 2026",
      status: "approved"
    },
    {
      id: 3,
      title: "Class 8 All Subjects Specialist",
      subject: "All Subjects",
      location: "Chittagong",
      salary: "4500 BDT",
      appliedDate: "May 05, 2026",
      status: "rejected"
    }
  ];

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Applied Tuition Jobs</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Track the status of your applications</p>
      </div>

      <div className="space-y-4">
        {appliedJobs.map((job) => (
          <div 
            key={job.id}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-800">{job.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-bold">
                <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1"><CircleDollarSign size={16} /> {job.salary}</span>
                <span className="flex items-center gap-1"><Calendar size={16} /> Applied: {job.appliedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0">
              <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${statusStyles[job.status]}`}>
                {job.status}
              </span>
              <button className="p-3 bg-slate-50 text-slate-700 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all">
                <Info size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AppliedJobs;