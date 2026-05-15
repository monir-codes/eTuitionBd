// import { useParams, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { 
//   MapPin, 
//   CircleDollarSign, 
//   Clock, 
//   BookOpen, 
//   Calendar, 
//   User, 
//   CheckCircle2, 
//   ArrowLeft,
//   Info
// } from "lucide-react";

// const TuitionDetails = () => {
//   const { id } = useParams();

//   // Mock Data (Fetch by ID from backend later)
//   const job = {
//     title: "Need a Tutor for Class 10 Student (SSC 2027)",
//     subject: "Mathematics & Higher Math",
//     location: "Sultanganj Para, Bogra Sadar",
//     salary: "5000 BDT",
//     days: "3 Days/Week",
//     category: "Bangla Medium",
//     postedAt: "May 15, 2026",
//     studentGender: "Male",
//     preferredTutor: "Any",
//     description: "I am looking for an experienced tutor for my younger brother who is currently in Class 10. He needs special attention in Higher Math and General Math. The tutor must be punctual and have a clear understanding of the new curriculum.",
//     requirements: [
//       "Must have a strong background in Mathematics.",
//       "Previous experience in teaching SSC candidates is preferred.",
//       "Minimum 3 days a week, 1.5 hours per session.",
//       "Clear communication in Bangla."
//     ]
//   };

//   return (
//     <div 
//       style={{ fontFamily: "'League Spartan', sans-serif" }}
//       className="min-h-screen bg-[#f8fafc] pt-28 pb-20"
//     >
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* 🔙 Back Button */}
//         <Link to="/tuitions" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#40bfff] mb-8 transition-colors">
//           <ArrowLeft size={20} /> Back to Listings
//         </Link>

//         <div className="grid lg:grid-cols-3 gap-8 items-start">
          
//           {/* 📝 Left Side: Main Details */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="lg:col-span-2 space-y-8"
//           >
//             {/* Header Card */}
//             <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
//               <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-xs font-black uppercase tracking-widest mb-6">
//                 {job.category}
//               </div>
//               <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6 leading-tight">
//                 {job.title}
//               </h1>
              
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-slate-50">
//                 <div className="flex flex-col gap-1">
//                   <span className="text-slate-400 text-xs font-bold uppercase">Salary</span>
//                   <p className="text-xl font-black text-[#2ecc71]">{job.salary}</p>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <span className="text-slate-400 text-xs font-bold uppercase">Subjects</span>
//                   <p className="text-lg font-bold text-slate-700">{job.subject}</p>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <span className="text-slate-400 text-xs font-bold uppercase">Posted On</span>
//                   <p className="text-lg font-bold text-slate-700">{job.postedAt}</p>
//                 </div>
//               </div>

//               <div className="mt-8">
//                 <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
//                   <Info size={20} className="text-[#40bfff]" /> Description
//                 </h4>
//                 <p className="text-slate-600 font-medium leading-relaxed text-lg">
//                   {job.description}
//                 </p>
//               </div>
//             </div>

//             {/* Requirements Card */}
//             <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
//               <h4 className="text-xl font-black text-slate-800 mb-6">Tutor Requirements</h4>
//               <ul className="grid gap-4">
//                 {job.requirements.map((req, i) => (
//                   <li key={i} className="flex items-start gap-3 text-slate-600 font-bold">
//                     <CheckCircle2 size={20} className="text-[#40bfff] shrink-0 mt-0.5" />
//                     <span>{req}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </motion.div>

//           {/* 📍 Right Side: Sidebar Info & Apply */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="space-y-6 lg:sticky lg:top-28"
//           >
//             {/* Quick Info Card */}
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//               <h4 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-50 pb-4">Tuition Summary</h4>
//               <div className="space-y-5">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff]"><MapPin size={20}/></div>
//                   <div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Location</p>
//                     <p className="text-sm font-bold text-slate-700">{job.location}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff]"><Clock size={20}/></div>
//                   <div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Schedule</p>
//                     <p className="text-sm font-bold text-slate-700">{job.days}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#40bfff]"><User size={20}/></div>
//                   <div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Student Gender</p>
//                     <p className="text-sm font-bold text-slate-700">{job.studentGender}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Requirement: Apply Button */}
//               <button className="w-full mt-8 py-4 rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] shadow-xl shadow-blue-100 transition-all active:scale-95 text-lg">
//                 Apply for this Job
//               </button>
//               <p className="text-[11px] text-center text-slate-400 font-bold mt-4 uppercase tracking-widest">
//                 ID: ET-{id || "001"}
//               </p>
//             </div>

//             {/* Safety Tips Card */}
//             <div className="bg-[#40bfff]/5 p-8 rounded-[2.5rem] border border-blue-100">
//               <h4 className="text-md font-black text-slate-800 mb-3">Safety Tips</h4>
//               <p className="text-xs text-slate-500 font-bold leading-relaxed">
//                 Never pay any money to get a tuition. Verified tutors and students communicate safely through eTuitional.
//               </p>
//             </div>
//           </motion.div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default TuitionDetails;