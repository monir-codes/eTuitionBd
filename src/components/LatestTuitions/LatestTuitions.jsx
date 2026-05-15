// import { motion } from "framer-motion";
// import { MapPin, Clock, CircleDollarSign, GraduationCap, ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const LatestTuitions = () => {
//   // Mock Data (Later fetch from your MongoDB)
//   const tuitions = [
//     {
//       id: 1,
//       title: "Need a Tutor for Class 10 Student",
//       subject: "Mathematics & Higher Math",
//       location: "Banani, Dhaka",
//       salary: "8000 BDT",
//       days: "4 Days/Week",
//       category: "English Medium"
//     },
//     {
//       id: 2,
//       title: "Looking for Physics Tutor (SSC 2027)",
//       subject: "Physics",
//       location: "Bogra Sadar",
//       salary: "5000 BDT",
//       days: "3 Days/Week",
//       category: "Bangla Medium"
//     },
//     {
//       id: 3,
//       title: "HSC 1st Year Chemistry Tutor Needed",
//       subject: "Chemistry",
//       location: "Chittagong, GEC",
//       salary: "Negotiable",
//       days: "2 Days/Week",
//       category: "Bangla Medium"
//     }
//   ];

//   return (
//     <section 
//       style={{ fontFamily: "'League Spartan', sans-serif" }}
//       className="py-24 bg-[#f0f9ff]/30"
//     >
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
//           <div className="max-w-xl">
//             <motion.h2 
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
//             >
//               Latest <span className="text-[#40bfff]">Tuition Jobs</span>
//             </motion.h2>
//             <p className="text-slate-500 font-bold text-lg">
//               Explore the most recent tuition opportunities and apply to start your teaching journey.
//             </p>
//           </div>
//           <Link to="/tuitions" className="group flex items-center gap-2 font-black text-[#40bfff] text-lg hover:underline decoration-2 underline-offset-8">
//             View All Jobs <ArrowRight className="group-hover:translate-x-2 transition-transform" />
//           </Link>
//         </div>

//         {/* Tuition Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {tuitions.map((job, idx) => (
//             <motion.div
//               key={job.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               viewport={{ once: true }}
//               className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 group"
//             >
//               {/* Category Badge */}
//               <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-xs font-black uppercase tracking-wider mb-6">
//                 {job.category}
//               </div>

//               <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-[#40bfff] transition-colors leading-tight">
//                 {job.title}
//               </h3>

//               {/* Info Details */}
//               <div className="space-y-3 mb-8">
//                 <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
//                   <GraduationCap size={18} className="text-slate-300" />
//                   <span>Subject: <span className="text-slate-700">{job.subject}</span></span>
//                 </div>
//                 <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
//                   <MapPin size={18} className="text-slate-300" />
//                   <span>{job.location}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
//                   <Clock size={18} className="text-slate-300" />
//                   <span>{job.days}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-[#2ecc71] font-black text-lg mt-4">
//                   <CircleDollarSign size={22} />
//                   <span>{job.salary}</span>
//                 </div>
//               </div>

//               {/* Action Button */}
//               <Link to={`/tuition/${job.id}`} className="block w-full">
//                 <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-[#40bfff] shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
//                   View Details
//                 </button>a
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LatestTuitions;