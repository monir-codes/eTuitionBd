import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CircleDollarSign, Clock, BookOpen, ArrowRight, Loader2, AlertTriangle, GraduationCap, User, ChevronLeft, ChevronRight, RotateCcw, Bookmark } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom"; 
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth"; 

const Tuitions = () => {
  const { user } = useAuth(); 
  const axiosSecure = useAxios();
  const [searchParams, setSearchParams] = useSearchParams();

  // ⚙️ ফিল্টার ও সর্ট স্টেট
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filterCategory, setFilterCategory] = useState(searchParams.get("category") || "All"); 
  const [filterClass, setFilterClass] = useState(searchParams.get("classLevel") || "All");       
  const [filterSubject, setFilterSubject] = useState(searchParams.get("subject") || "All");   
  const [filterLocation, setFilterLocation] = useState(searchParams.get("location") || "All"); 
  const [sortBy, setSortBy] = useState("date");                               
  const [sortOrder, setSortOrder] = useState("desc");          
  
  useEffect(() => {
    if (searchParams.has("search")) setSearchTerm(searchParams.get("search") || "");
    if (searchParams.has("category")) setFilterCategory(searchParams.get("category") || "All");
    if (searchParams.has("classLevel")) setFilterClass(searchParams.get("classLevel") || "All");
    if (searchParams.has("subject")) setFilterSubject(searchParams.get("subject") || "All");
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔄 TanStack Query
  const { data: responseData = { tuitions: [], totalCount: 0 }, isLoading, isError, error } = useQuery({
    queryKey: ["tuitions", searchTerm, filterCategory, filterClass, filterSubject, filterLocation, sortBy, sortOrder, currentPage], 
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions", {
        params: {
          search: searchTerm,
          category: filterCategory,
          classLevel: filterClass,
          subject: filterSubject,
          location: filterLocation,
          sortBy: sortBy,
          sortOrder: sortOrder,
          page: currentPage,
          limit: itemsPerPage
        },
      });
      
      if (Array.isArray(res.data)) {
        return { tuitions: res.data, totalCount: res.data.length };
      }
      return res.data;
    },
  });

  const tuitionPosts = responseData?.tuitions || [];
  const totalCount = responseData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterClass("All");
    setFilterSubject("All");
    setFilterLocation("All");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleAddBookmark = async (id) => {
    if (!user || !user.email) {
      return toast.error("Please login to bookmark posts! 🔒");
    }

    const bookmarkInfo = {
      userEmail: user.email,
      tuitionId: id,
      bookmarkedAt: new Date()
    };

    try {
      const res = await axiosSecure.post("/api/bookmarks", bookmarkInfo);
      if (res.data.success) {
        toast.success("Post added to your bookmarks! ❤️");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Already bookmarked this post!");
    }
  };

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-24 sm:pt-28 pb-20 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* 🔍 Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 space-y-4 w-full">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, subject, location..." 
              className="w-full pl-11 pr-4 h-12 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-xs sm:text-sm text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-black uppercase tracking-wider w-full">
            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-[10px] text-slate-400 pl-1">Medium</span>
              <select 
                className="w-full h-11 bg-slate-50 border-none rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-3 cursor-pointer text-xs"
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Mediums</option>
                <option value="Bangla Medium">Bangla Medium</option>
                <option value="English Medium">English Medium</option>
                <option value="English Version">English Version</option>
                <option value="Madrasah Medium">Madrasah</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-[10px] text-slate-400 pl-1">Class Level</span>
              <select 
                className="w-full h-11 bg-slate-50 border-none rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-3 cursor-pointer text-xs"
                value={filterClass}
                onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Classes</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="HSC">HSC</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-[10px] text-slate-400 pl-1">Subject</span>
              <select 
                className="w-full h-11 bg-slate-50 border-none rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-3 cursor-pointer text-xs"
                value={filterSubject}
                onChange={(e) => { setFilterSubject(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Higher Math">Higher Math</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-[10px] text-slate-400 pl-1">Location</span>
              <select 
                className="w-full h-11 bg-slate-50 border-none rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-3 cursor-pointer text-xs"
                value={filterLocation}
                onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Locations</option>
                <option value="Bogra">Bogra</option>
                <option value="Dhaka">Dhaka</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-[10px] text-slate-400 pl-1">Sort Flow</span>
              <select 
                className="w-full h-11 bg-slate-50 border-none rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-[#40bfff]/20 outline-none px-3 cursor-pointer text-xs"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                  setCurrentPage(1);
                }}
              >
                <option value="date-desc">Newest Circulars</option>
                <option value="date-asc">Oldest Circulars</option>
                <option value="budget-desc">Salary: High to Low</option>
                <option value="budget-asc">Salary: Low to High</option>
              </select>
            </div>

            <div className="flex flex-col justify-end w-full">
              <button 
                onClick={handleResetFilters}
                className="w-full h-11 bg-slate-950 text-white hover:bg-[#40bfff] rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* 🛠️ রিকোয়ারমেন্ট ফিক্স: ৩ নম্বর সেকশনের কড়া নিয়মে "Skeleton loader while loading" হ্যান্ডলার */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div 
                key={n} 
                className="bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[380px] w-full animate-pulse"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 bg-slate-200 rounded-full w-24" />
                    <div className="h-5 bg-slate-200 rounded-md w-16" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded-xl w-3/4 mb-4" />
                  <div className="space-y-3 py-3 border-t border-b border-slate-100">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 rounded w-10" />
                    <div className="h-5 bg-slate-200 rounded w-20" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl" />
                    <div className="h-10 w-10 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ⚠️ এরর স্টেট */}
        {isError && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-rose-500 w-full text-center">
            <AlertTriangle size={36} />
            <p className="font-black uppercase tracking-wider text-xs sm:text-sm">Sync Error: {error.message}</p>
          </div>
        )}

        {/* 📚 Listings Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full">
            {tuitionPosts.length > 0 ? tuitionPosts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden w-full min-w-0"
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-4 w-full">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#40bfff] text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-blue-100/50 truncate max-w-[60%]">
                      {post.category || "General"}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border truncate max-w-[40%] text-right">
                      {post.classLevel || post.studentClass || "N/A"}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-800 mb-4 group-hover:text-[#40bfff] transition-colors leading-snug min-h-[3rem] line-clamp-2 break-words">
                    {post.title}
                  </h3>

                  <div className="space-y-2.5 mb-5 border-t border-b border-slate-50 py-3.5 w-full">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs sm:text-sm min-w-0">
                      <BookOpen size={15} className="text-[#40bfff]/80 shrink-0" />
                      <span className="truncate">Subject: <span className="text-slate-800">{post.subject || post.subjects || "Not Specified"}</span></span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs sm:text-sm min-w-0">
                      <Clock size={15} className="text-amber-500/80 shrink-0" />
                      <span className="truncate">Schedule: <span className="text-slate-800">{post.days || post.daysPerWeek || "N/A"}</span></span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs sm:text-sm min-w-0">
                      <User size={15} className="text-indigo-400 shrink-0" />
                      <span className="truncate">Student: <span className="text-slate-800 capitalize">{post.studentGender || "Any"}</span></span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs sm:text-sm border-t border-slate-50/50 pt-2.5 mt-1 min-w-0">
                      <MapPin size={15} className="text-rose-400/80 shrink-0" />
                      <span className="text-slate-700 truncate" title={post.location}>{post.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-50 pt-4 w-full">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">Budget</span>
                      <div className="flex items-center gap-1 text-emerald-600 font-black text-base sm:text-lg truncate">
                        <CircleDollarSign size={16} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{post.salary}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleAddBookmark(post._id)}
                        className="h-10 w-10 sm:h-11 sm:w-11 bg-slate-50 text-slate-400 hover:text-[#40bfff] hover:bg-blue-50 border border-slate-100 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-none"
                        title="Save Circular"
                      >
                        <Bookmark size={15} />
                      </button>

                      <Link 
                        to={`/tuitions/${post._id}`} 
                        className="h-10 w-10 sm:h-11 sm:w-11 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:bg-[#40bfff] transition-all duration-200 shadow-sm active:scale-95"
                      >
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 p-4 w-full">
                <AlertTriangle size={32} className="text-slate-300" />
                <p className="font-black text-slate-300 uppercase tracking-widest text-xs sm:text-sm">
                  No tuition circulars match your active filters
                </p>
              </div>
            )}
          </div>
        )}

        {/* 📄 પેજિનેશન */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-12 w-full flex-wrap">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-10 px-2.5 sm:px-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs"
            >
              <ChevronLeft size={15} />
            </button>

            {[...Array(totalPages).keys()].map((pageIdx) => {
              const pageNum = pageIdx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-10 w-10 rounded-xl font-black text-xs transition-all ${
                    currentPage === pageNum
                      ? "bg-[#40bfff] text-white shadow-md shadow-blue-100"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-10 px-2.5 sm:px-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tuitions;