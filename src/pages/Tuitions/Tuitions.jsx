import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CircleDollarSign, Clock, BookOpen, Filter, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios"

const Tuitions = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // 🔄 TanStack Query: সার্চ এবং ফিল্টারের স্টেট পরিবর্তন হলেই এটি অটোমেটিক ব্যাকএন্ড থেকে নতুন ডাটা আনবে
  const { data: tuitionPosts = [], isLoading, isError, error } = useQuery({
    queryKey: ["tuitions", searchTerm, filterCategory], // 👈 এই কি-গুলোর ওপর ডিপেন্ড করে ক্যাশিং ও রি-ফেচিং কন্ট্রোল হবে
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions", {
        params: {
          search: searchTerm,
          category: filterCategory,
        },
      });
      return res.data;
    },
  });

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🔍 Search & Filter Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Search Input */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by subject, location, or keywords..." 
                className="w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm text-slate-700 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Medium Filters */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-56">
                <select 
                  className="w-full h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-5 appearance-none cursor-pointer text-sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Mediums</option>
                  <option value="Bangla Medium">Bangla Medium</option>
                  <option value="English Medium">English Medium</option>
                  <option value="Madrasa Medium">Madrasa</option>
                </select>
              </div>
              
              <button className="bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-8 h-14 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center transition-colors">
                <Filter size={18} className="mr-2" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* ⏳ লোডিং স্টেট গেটওয়ে */}
        {isLoading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#40bfff]" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Scanning Live Tuition Board...</p>
          </div>
        )}

        {/* ⚠️ এরর স্টেট গেটওয়ে */}
        {isError && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-rose-500">
            <AlertTriangle size={40} />
            <p className="font-black uppercase tracking-wider">Sync Error: {error.message}</p>
          </div>
        )}

        {/* 📚 Listings Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tuitionPosts.length > 0 ? tuitionPosts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    {post.postedAt || "Recent"}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-[#40bfff] transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
                  {post.title}
                </h3>

                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <BookOpen size={18} className="text-[#40bfff]/70" />
                    <span>Subject: <span className="text-slate-800">{post.subject}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <MapPin size={18} className="text-slate-400" />
                    <span className="text-slate-700">{post.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <Clock size={18} className="text-amber-500/80" />
                    <span className="text-slate-700">{post.days}</span>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-6 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#2ecc71] font-black text-xl">
                      <CircleDollarSign size={22} />
                      <span>{post.salary}</span>
                    </div>
                    {/* 🔗 ডাইনামিকলি সিঙ্গেল টিউটোরিয়াল ডিটেইলস পেজে রিডাইরেকশন */}
                    <Link 
                      to={`/tuitions/${post._id}`} 
                      className="p-3 bg-[#40bfff] text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                <AlertTriangle size={36} className="text-slate-300" />
                <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
                  No tuition circulars match your active filters
                </p>
              </div>
            )}
          </div>
        )}

        {/* 📄 Pagination Box */}
        {tuitionPosts.length > 0 && (
          <div className="flex justify-center gap-2">
            <button className="btn btn-square bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all font-bold">1</button>
            <button className="btn btn-square bg-[#40bfff] border-none text-white rounded-xl shadow-lg shadow-blue-100 font-bold">2</button>
            <button className="btn btn-square bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl transition-all font-bold">3</button>
            <button className="btn px-6 bg-white border-slate-200 text-slate-400 hover:bg-[#40bfff] hover:text-white rounded-xl font-bold transition-all">Next</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tuitions;