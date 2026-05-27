import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CircleDollarSign, Clock, BookOpen, Filter, ArrowRight, Loader2, AlertTriangle, GraduationCap, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const Tuitions = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // 📄 পেজিনেশন স্টেট কন্ট্রোল
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // প্রতি পেজে কয়টা কার্ড দেখাবে

  // 🔄 TanStack Query: পেজ নম্বর, সার্চ বা ফিল্টার চেঞ্জ হলেই এপিআই অটো ট্রিগার হবে
  const { data: responseData = { tuitions: [], totalCount: 0 }, isLoading, isError, error } = useQuery({
    queryKey: ["tuitions", searchTerm, filterCategory, currentPage], 
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions", {
        params: {
          search: searchTerm,
          category: filterCategory,
          page: currentPage,
          limit: itemsPerPage
        },
      });
      
      // সেফটি চেক: ব্যাকএন্ড যদি ডিরেক্ট অ্যারে পাঠায় অথবা অবজেক্টে র‍্যাপ করে পাঠায়
      if (Array.isArray(res.data)) {
        return { tuitions: res.data, totalCount: res.data.length };
      }
      return res.data; // অবজেক্ট ফরম্যাট: { tuitions: [...], totalCount: 24 }
    },
    keepPrevkeepPreviousData: false,
  });

  // ডাটা এক্সট্র্যাক্ট করা
  const tuitionPosts = responseData?.tuitions || [];
  const totalCount = responseData?.totalCount || 0;
  
  // টোটাল কয়টা পেজ হবে তা ক্যালকুলেট করা
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // সার্চ বা ফিল্টার চেঞ্জ হলে পেজ নম্বর ১ এ রিসেট করার হ্যান্ডলার
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Medium Filters */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-56">
                <select 
                  className="w-full h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-5 appearance-none cursor-pointer text-sm"
                  value={filterCategory}
                  onChange={handleFilterChange}
                >
                  <option value="All">All Mediums</option>
                  <option value="Bangla Medium">Bangla Medium</option>
                  <option value="English Medium">English Medium</option>
                  <option value="English Version">English Version</option>
                  <option value="Madrasah Medium">Madrasah</option>
                </select>
              </div>
              
              <button className="bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-8 h-14 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center transition-colors">
                <Filter size={18} className="mr-2" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* ⏳ লোডিং স্টেট */}
        {isLoading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#40bfff]" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Scanning Live Tuition Board...</p>
          </div>
        )}

        {/* ⚠️ এরর স্টেট */}
        {isError && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-rose-500">
            <AlertTriangle size={40} />
            <p className="font-black uppercase tracking-wider">Sync Error: {error.message}</p>
          </div>
        )}

        {/* 📚 Improved Listings Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tuitionPosts.length > 0 ? tuitionPosts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-8 rounded-[3rem] border border-slate-100/80 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue-100/70 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div>
                  {/* Top Badge Meta row */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                      {post.category || "General"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      {post.postedAt || "Recent"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-slate-800 mb-5 group-hover:text-[#40bfff] transition-colors leading-snug min-h-[3.5rem] line-clamp-2">
                    {post.title}
                  </h3>

                  {/* 📊 উন্নত করা ইনফো সেকশন */}
                  <div className="space-y-3.5 mb-8">
                    {/* ✅ ফিক্স: ক্লাস লেভেল ডেটাবেজের ২টা সম্ভাব্য কি (Keys) ট্র্যাকিং */}
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                      <GraduationCap size={18} className="text-indigo-500/80" />
                      <span>Class: <span className="text-slate-800">{post.classLevel || post.studentClass || "Not Specified"}</span></span>
                    </div>

                    {/* সাবজেক্টস */}
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                      <BookOpen size={18} className="text-amber-500/80" />
                      <span>Subject: <span className="text-slate-800">{post.subject || post.subjects || "Not Specified"}</span></span>
                    </div>

                    {/* শিডিউল/দিন */}
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                      <Clock size={18} className="text-sky-500/80" />
                      <span>Schedule: <span className="text-slate-800">{post.days || post.daysPerWeek || "N/A"}</span></span>
                    </div>

                    {/* স্টুডেন্ট জেন্ডার */}
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                      <User size={18} className="text-slate-400" />
                      <span>Student: <span className="text-slate-800 capitalize">{post.studentGender || "Any"}</span></span>
                    </div>

                    {/* লোকেশন */}
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm border-t border-slate-50 pt-3 mt-2">
                      <MapPin size={18} className="text-rose-400/80 shrink-0" />
                      <span className="text-slate-700 truncate" title={post.location}>{post.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Action Row */}
                <div className="border-t border-slate-100 pt-5 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Budget</span>
                      <div className="flex items-center gap-1.5 text-[#2ecc71] font-black text-xl">
                        <CircleDollarSign size={20} />
                        <span>{post.salary}</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/tuitions/${post._id}`} 
                      className="h-12 w-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-[#40bfff] transition-all duration-300 shadow-md active:scale-95 group-hover:scale-105"
                    >
                      <ArrowRight size={18} />
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

        {/* 📄 ফিক্সড ও ফুল ডাইনামিক তানস্ট্যাক পেজিনেশন বক্স */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-12 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dynamic Page Number Buttons */}
            {[...Array(totalPages).keys()].map((pageIdx) => {
              const pageNum = pageIdx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-12 w-12 rounded-xl font-black transition-all ${
                    currentPage === pageNum
                      ? "bg-[#40bfff] text-white shadow-lg shadow-blue-100"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-12 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tuitions;