import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CircleDollarSign, Clock, BookOpen, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Tuitions = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Mock Data (Later fetch from your backend using axios/tanstack query)
  const tuitionPosts = [
    {
      id: 1,
      title: "Need a Tutor for Class 10 Student",
      subject: "Mathematics",
      location: "Bogra Sadar",
      salary: "5000 BDT",
      days: "3 Days/Week",
      category: "Bangla Medium",
      postedAt: "2 hours ago"
    },
    {
      id: 2,
      title: "HSC Physics & Chemistry Tutor Needed",
      subject: "Science",
      location: "Banani, Dhaka",
      salary: "8000 BDT",
      days: "4 Days/Week",
      category: "English Medium",
      postedAt: "5 hours ago"
    },
    {
      id: 3,
      title: "O-Level English Literature Specialist",
      subject: "English",
      location: "Chittagong, GEC",
      salary: "12000 BDT",
      days: "3 Days/Week",
      category: "English Medium",
      postedAt: "1 day ago"
    },
    // Add more mock data for pagination testing
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🔍 Search & Filter Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by subject or keyword..." 
                className="input w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 w-full lg:w-auto">
              <select 
                className="select h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 w-full lg:w-48"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Mediums</option>
                <option value="Bangla">Bangla Medium</option>
                <option value="English">English Medium</option>
                <option value="Madrasa">Madrasa</option>
              </select>
              
              <button className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-8 h-14 rounded-2xl shadow-lg shadow-blue-100">
                <Filter size={18} className="mr-2" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* 📚 Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tuitionPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-widest">
                  {post.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  {post.postedAt}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-[#40bfff] transition-colors leading-tight">
                {post.title}
              </h3>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <BookOpen size={18} className="text-slate-300" />
                  <span>Subject: <span className="text-slate-800">{post.subject}</span></span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <MapPin size={18} className="text-slate-300" />
                  <span>{post.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <Clock size={18} className="text-slate-300" />
                  <span>{post.days}</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-6 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#2ecc71] font-black text-xl">
                    <CircleDollarSign size={22} />
                    <span>{post.salary}</span>
                  </div>
                  <Link 
                    to={`/tuitions/details/${post.id}`} 
                    className="p-3 bg-[#40bfff] text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-110 transition-transform"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 📄 Pagination (Dummy) */}
        <div className="flex justify-center gap-2">
          <button className="btn btn-square bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl">1</button>
          <button className="btn btn-square bg-[#40bfff] border-none text-white rounded-xl shadow-lg shadow-blue-100">2</button>
          <button className="btn btn-square bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl">3</button>
          <button className="btn px-6 bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl font-bold">Next</button>
        </div>

      </div>
    </div>
  );
};

export default Tuitions;