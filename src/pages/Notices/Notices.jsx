import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query"; 
import useAxios from "../../hooks/useAxios"; // 🎯 আপনার পাবলিক হুক পাথ অনুযায়ী অ্যাডজাস্ট করে নিয়েন ভাই
import { Bell, Calendar, Search, ArrowRight, Megaphone, FileText, X, AlertTriangle, Sparkles } from "lucide-react";
import Loading from "../Loading/Loading";

const Notices = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState(null);

  // 🔄 ডাটাবেজ থেকে রিয়েল-টাইম নোটিশ ও ব্লগ ডেটা ফেচিং পাইপলাইন
  const { data: notices = [], isLoading, isError, error } = useQuery({
    queryKey: ["platform-notices"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/notices");
      return res.data;
    }
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-rose-500 gap-2 p-4">
        <AlertTriangle size={36} />
        <p className="font-black uppercase tracking-wider text-sm">Failed to connect notices database: {error.message}</p>
      </div>
    );
  }

  // 🔍 সার্চ ও ক্যাটাগরি ফিল্টারিং লজিক
  const filteredNotices = notices.filter(notice => {
    const title = notice?.title || "";
    const summary = notice?.summary || "";
    const tag = notice?.tag || "";
    const category = notice?.category || "All";

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // 🎯 ফিক্স ১: পাবলিক লেআউটের মেইন গ্লোবাল ন্যাভবারের নিচে থাকার জন্য pt-32 (টপ প্যাডিং) এবং z-10 লক করা হলো ভাই
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }} 
      className="min-h-screen bg-[#f8fafc] pt-32 pb-20 select-none relative z-10 overflow-hidden px-4 sm:px-6"
    >
      {/* ব্যাকগ্রাউন্ড সজ্জা রিফ্লেকশন */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#40bfff]/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* 👑 Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-[#40bfff] border border-blue-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} /> Notice Board
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight"
          >
            Platform <span className="text-[#40bfff]">Announcements</span>
          </motion.h1>
          <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
            Stay updated with live academic protocols, exam structures and core system notices
          </p>
        </div>

        {/* 🎛️ Control Panel: Search & Filter Pills */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm w-full flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search notices, updates, exam cycles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 w-full lg:w-auto justify-start custom-scrollbar-hide shrink-0">
            {["All", "Academic", "System", "Maintenance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 ${
                  activeCategory === cat 
                    ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/10" 
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 📱 🖥️ ১০০% রেসপন্সিভ পাবলিক কার্ড গ্রিড */}
        {/* 🎯 ফিক্স ২: মোবাইল স্ক্রিনে grid-cols-1 থেকে md:grid-cols-2 লেআউটে ব্রেকিং সেফ করা হলো ভাই */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, idx) => (
              <motion.div
                key={notice._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white p-6 sm:p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-[#40bfff]/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden w-full min-w-0"
              >
                <div className="space-y-4 w-full min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap w-full">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      notice.category === "Academic" ? "bg-blue-50 text-[#40bfff] border-blue-100" :
                      notice.category === "System" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {notice.category || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                      <Calendar size={12} /> <span>{notice.date || "Recent"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 w-full min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight group-hover:text-[#40bfff] transition-colors line-clamp-2 leading-snug break-words">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3 break-words">
                      {notice.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-50 w-full gap-2">
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg uppercase tracking-wider truncate max-w-[130px]">
                    #{notice.tag || "Update"}
                  </span>
                  <button 
                    onClick={() => setSelectedNotice(notice)}
                    className="text-xs font-black text-[#40bfff] hover:text-[#33a6dd] flex items-center gap-1 uppercase tracking-wider group/btn shrink-0"
                  >
                    Read Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white text-center py-20 rounded-[2.5rem] border border-dashed border-slate-200 text-slate-300 font-black text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-3 w-full">
              <Bell size={40} className="stroke-[1.5]" />
              <span>No active notices found in database repository</span>
            </div>
          )}
        </div>
      </div>

      {/* 👑 আল্ট্রা-সেফ গ্লোবাল মডাল (পপআপ লেয়ার) */}
      <AnimatePresence>
        {selectedNotice && (
          // 🎯 ফিক্স ৩: পাবলিক ন্যাভবার এবং ফুটারের সবার ওপরে ভেসে থাকার জন্য z-[999] মেকানিজম লকড ভাই
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-28 h-24 bg-[#40bfff]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 relative z-10 gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest">Live Document</span>
                    <span className="text-[11px] font-black text-[#40bfff] uppercase tracking-wider">{selectedNotice.category || "General"} Matrix</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-slate-800 tracking-tight mt-1.5 break-words leading-snug">{selectedNotice.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedNotice(null)} 
                  className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 relative z-10 text-xs sm:text-sm w-full">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <Calendar size={14} /> <span>Issued on: {selectedNotice.date || "Recent"}</span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100/50 text-slate-600 font-medium leading-relaxed space-y-2.5 max-h-[280px] sm:max-h-[340px] overflow-y-auto custom-scrollbar">
                  <p className="font-black text-slate-700 border-b border-slate-200 pb-2 flex items-center gap-1.5 sticky top-0 bg-slate-50/95 py-0.5">
                    <FileText size={14} className="text-[#40bfff]" /> Memorandums & Guidelines:
                  </p>
                  <p className="text-slate-500 font-bold italic break-words">{selectedNotice.summary}</p>
                  <p className="pt-2 border-t border-slate-200/30 whitespace-pre-line text-justify leading-relaxed break-words text-slate-600 font-medium">{selectedNotice.content}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-50 relative z-10 gap-2">
                <span className="text-[10px] font-black text-[#40bfff] bg-blue-50/60 border border-blue-100 px-3 py-1 rounded-xl uppercase tracking-wider truncate max-w-[160px]">
                  Scope: {selectedNotice.tag || "System"}
                </span>
                <button 
                  onClick={() => setSelectedNotice(null)} 
                  className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors shrink-0"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Notices;