import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Trash2, MapPin, CircleDollarSign, Calendar, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";

const ManageTuitions = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 ১. TanStack Query দিয়ে ডাটাবেজ থেকে সব লাইভ টিউশন পোস্ট ফেচ করা
  const { data: tuitions = [], isLoading, isError, error } = useQuery({
    queryKey: ["all-tuitions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions");
      return res.data;
    }
  });

  // 🗑️ ২. useMutation দিয়ে ডাটাবেজ থেকে স্প্যাম/ফেক টিউশন পোস্ট ডিলিট করা
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/tuitions/${id}`);
      return res.data;
    },
    // সাকসেস হলে ক্যাশ ডাটা রি-ফেচ করবে এবং টোস্ট দেখাবে
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tuitions"] });
      toast.error("Tuition post has been permanently removed!");
    },
    onError: () => {
      toast.error("Failed to delete the tuition post. Try again.");
    }
  });

  const handleDeletePost = (id) => {
    // কনফার্মেশন প্রম্পট (ইন্ডাস্ট্রি স্ট্যান্ডার্ড সেফটি)
    if (window.confirm("Are you sure you want to delete this tuition post permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  // 🔍 ক্লায়েন্ট-সাইড ফিল্টারিং (ক্যাশিং ডাটার ওপর সার্চ)
  const filteredTuitions = tuitions.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ⏳ ডাটাবেজ সিঙ্কিং লোডার স্টেট
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fetching Live Postings...</p>
      </div>
    );
  }

  // ⚠️ নেটওয়ার্ক বা সার্ভার এরর স্টেট
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider">Sync Failure: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Manage Tuition Posts</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Platform Registry Engine powered by TanStack Query</p>
      </div>

      {/* 🔍 Search Input Filter Bar */}
      <div className="relative w-full max-w-md bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="Search by title, subject, or region..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 h-11 bg-slate-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
        />
      </div>

      {/* 📜 Tuitions List Card Grid */}
      <div className="grid gap-6">
        {filteredTuitions.length > 0 ? filteredTuitions.map((post) => (
          <div 
            key={post._id} 
            className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group hover:shadow-md transition-all"
          >
            {/* Left Info Area */}
            <div className="space-y-3 flex-grow">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-wider">
                  ID: {post._id}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Posted by: <span className="font-black text-slate-700">{post.studentName || post.studentEmail}</span>
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 group-hover:text-rose-500 transition-colors">
                {post.title}
              </h3>

              {/* Specs Badges */}
              <div className="flex flex-wrap gap-5 text-sm text-slate-400 font-bold pt-1">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-[#40bfff]" /> {post.subject}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" /> {post.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CircleDollarSign size={16} className="text-emerald-500" /> {post.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-amber-500" /> {post.days}
                </span>
              </div>
            </div>

            {/* Right Action Button Area */}
            <div className="w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0 flex justify-end">
              <button 
                onClick={() => handleDeletePost(post._id)}
                disabled={deleteMutation.isPending}
                className="h-12 px-6 bg-rose-50 text-rose-500 rounded-2xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-rose-100 shadow-sm disabled:opacity-50"
              >
                <Trash2 size={16} /> {deleteMutation.isPending ? "Removing..." : "Delete Post"}
              </button>
            </div>

          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
             <AlertTriangle size={36} className="text-slate-300" />
             <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
               No live tuition posts found in database
             </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageTuitions;