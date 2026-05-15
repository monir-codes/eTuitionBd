import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Book, CheckCircle, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data: Following your requirement for dynamic fetch (Backend ready structure)
  const tutors = [
    {
      id: 1,
      name: "Sabbir Ahmed",
      subject: "Math & Physics Expert",
      location: "Bogra Sadar",
      rating: 4.9,
      image: "https://i.pravatar.cc/150?u=sabbir",
      experience: "5 Years Exp.",
      category: "English Medium",
      verified: true
    },
    {
      id: 2,
      name: "Tahmina Akter",
      subject: "English Literature",
      location: "Banani, Dhaka",
      rating: 4.8,
      image: "https://i.pravatar.cc/150?u=tahmina",
      experience: "3 Years Exp.",
      category: "Bangla Medium",
      verified: true
    },
    {
      id: 3,
      name: "Rifat Hasan",
      subject: "Chemistry Specialist",
      location: "GEC, Chittagong",
      rating: 5.0,
      image: "https://i.pravatar.cc/150?u=rifat",
      experience: "4 Years Exp.",
      category: "English Medium",
      verified: true
    }
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🔍 Heading & Search (Design inspired by reference) */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            Find Your <span className="text-[#40bfff]">Perfect Tutor</span>
          </motion.h2>
          <p className="text-slate-500 font-bold text-lg mb-8">Search from our verified pool of expert educators.</p>
          
          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by subject (e.g. Physics, Math)..." 
                className="input w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-10 h-14 rounded-2xl w-full md:w-auto shadow-lg shadow-blue-100">
              Search
            </button>
          </div>
        </div>

        {/* 🎓 Tutors Grid (Requirements Followed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor, idx) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[3rem] border border-slate-100 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group"
            >
              {/* Profile Image & Verification Badge */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md group-hover:border-[#40bfff] transition-colors duration-500">
                  <img src={tutor.image} className="w-full h-full object-cover" alt={tutor.name} />
                </div>
                {tutor.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <CheckCircle size={22} className="text-[#40bfff]" fill="white" />
                  </div>
                )}
              </div>

              <h4 className="text-2xl font-black text-slate-800 mb-1">{tutor.name}</h4>
              <p className="text-[#40bfff] font-bold text-sm mb-4 uppercase tracking-widest leading-none">
                {tutor.subject}
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl">
                  <Star size={14} fill="#f1c40f" className="text-[#f1c40f]" />
                  <span className="text-sm font-black text-slate-700">{tutor.rating}</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl">
                  <MapPin size={14} className="text-[#40bfff]" />
                  <span className="text-xs font-bold text-slate-500">{tutor.location}</span>
                </div>
              </div>

              {/* Requirement: View Details / Profile */}
              <Link to={`/tutor/${tutor.id}`} className="w-full">
                <button className="w-full py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-black text-slate-700 hover:bg-[#40bfff] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2">
                  View Profile <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutors;