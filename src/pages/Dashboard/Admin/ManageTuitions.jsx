import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Trash2, MapPin, CircleDollarSign, Calendar, BookOpen, AlertTriangle, CheckCircle2, XCircle, Mail, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Loading/Loading";

const ManageTuitions = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔄 ১. TanStack Query দিয়ে ডাটাবেজ থেকে সব লাইভ টিউশন পোস্ট ফেচ করা
  const { data: tuitions = [], isLoading, isError, error } = useQuery({
    queryKey: ["all-tuitions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/tuitions?isAdminPanel=true");
      return res.data;
    }
  });

  // 🚫 ২. useMutation: টিউশন পোস্টের স্ট্যাটাস পরিবর্তন করা (Approved / Rejected)
  const statusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      // 🎯 ফিক্সড: আপনার ব্যাকএন্ড মডারেশন রাউটের সাথে পারফেক্টলি সিঙ্ক করা হলো
      const res = await axiosSecure.patch(`/api/tuitions/status/${id}`, { status: newStatus });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-tuitions"] });
      const isApprove = variables.newStatus === "Approved";
      Swal.fire({
        title: isApprove ? "Approved!" : "Rejected!",
        text: `Tuition post status has been updated to ${variables.newStatus}.`,
        icon: isApprove ? "success" : "error",
        confirmButtonColor: "#40bfff",
      });
    },
    onError: () => {
      toast.error("Failed to update tuition status request.");
    }
  });

  // 🗑️ ৩. useMutation দিয়ে ডাটাবেজ থেকে স্প্যাম/ফেক টিউশন পোস্ট ডিলিট করা
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/tuitions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tuitions"] });
      Swal.fire({
        title: "Purged!",
        text: "Tuition post has been permanently removed.",
        icon: "success",
        confirmButtonColor: "#40bfff",
      });
    },
    onError: () => {
      toast.error("Failed to delete the tuition post.");
    }
  });

  // 🖱️ অ্যাকশন হ্যান্ডলারস
  const handleUpdateStatus = (id, newStatus) => {
    Swal.fire({
      title: `Confirm ${newStatus}?`,
      text: `Are you sure you want to mark this post as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "Approved" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${newStatus}`
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, newStatus });
      }
    });
  };

  const handleDeletePost = (id) => {
    Swal.fire({
      title: "Purge Tuition Post?",
      text: "This action cannot be undone. Post will be permanently lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // 🔍 ৪. ক্লায়েন্ট-সাইড ফিল্টারিং (ডাটা মিসিং বা নাল ভ্যালু প্রোটেক্টেড বুলেটপ্রুফ লজিক)
  const filteredTuitions = tuitions.filter((post) => {
    const postTitle = post?.title ? String(post.title).toLowerCase() : "";
    const postLocation = post?.location ? String(post.location).toLowerCase() : "";
    const postSubject = post?.subject ? String(post.subject).toLowerCase() : "";
    const cleanSearchTerm = searchTerm.toLowerCase();

    const matchesSearch = 
      postTitle.includes(cleanSearchTerm) ||
      postLocation.includes(cleanSearchTerm) ||
      postSubject.includes(cleanSearchTerm);

    const currentStatus = post?.status || "pending";
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 🎨 স্ট্যাটাস কালার কন্টローラ
  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100"
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider text-sm">Sync Failure: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto px-1 sm:px-2 py-2"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header (ManageUsers পেজের সাথে হুবহু সিঙ্কড) */}
      <div className="py-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Manage Tuition Posts</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Master Moderation Engine Backed by TanStack Query</p>
      </div>

      {/* 🔍 Controls Filter Bar (প্যাডিং এবং উইথ ম্যাচ করা হয়েছে) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, subject, or region..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="relative w-full md:w-48 flex items-center bg-slate-50 rounded-2xl px-4 h-12">
          <Filter className="text-slate-400 mr-2" size={16} />
          <select 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none font-black text-sm text-slate-700 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 📜 Master Table View (Desktop & Tablet Theme Synergy) */}
      <div className="bg-transparent sm:bg-white rounded-none sm:rounded-[2.5rem] border-none sm:border border-slate-100 sm:shadow-sm overflow-hidden w-full">
        
        {/* 💻 Desktop View Model */}
        <div className="hidden sm:block w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest">
                <th className="p-4 lg:p-5 w-[38%] rounded-tl-none sm:rounded-tl-[2.5rem]">Tuition Requirements</th>
                <th className="p-4 lg:p-5 w-[18%]">Location / Region</th>
                <th className="p-4 lg:p-5 w-[16%]">Salary / Package</th>
                <th className="p-4 lg:p-5 w-[12%]">Status</th>
                <th className="p-4 lg:p-5 w-[16%] rounded-tr-none sm:rounded-tr-[2.5rem] text-right pr-6">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredTuitions.length > 0 ? filteredTuitions.map((post) => (
                <tr key={post._id} className={`hover:bg-slate-50/50 transition-colors ${post.status === 'Rejected' ? 'bg-rose-50/10' : ''}`}>
                  
                  {/* Title & Meta */}
                  <td className="p-4 lg:p-5 min-w-0">
                    <div className="space-y-1 w-full min-w-0">
                      <p className="text-slate-800 font-black text-sm lg:text-base truncate w-full" title={post.title}>
                        {post.title || "Untitled Tuition Posting"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                          Class: {post.days || "N/A"}
                        </span>
                        <span className="truncate flex items-center gap-1">
                          <BookOpen size={11} className="text-slate-300" /> {post.subject || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location Region */}
                  <td className="p-4 lg:p-5 min-w-0">
                    <p className="text-slate-700 font-medium truncate w-full capitalize flex items-center gap-1" title={post.location}>
                      <MapPin size={13} className="text-slate-300 shrink-0" /> {post.location || "N/A"}
                    </p>
                  </td>

                  {/* Salary Package */}
                  <td className="p-4 lg:p-5 whitespace-nowrap">
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <CircleDollarSign size={14} className="text-emerald-500 shrink-0" /> {post.salary || "Negotiable"}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 lg:p-5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border ${statusStyles[post.status] || "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      {post.status || "pending"}
                    </span>
                  </td>

                  {/* Action Controls Panel */}
                  <td className="p-4 lg:p-5 text-right whitespace-nowrap pr-6">
                    {(post.status === "pending" || !post.status) ? (
                      <div className="inline-flex gap-1.5 justify-end">
                        <button 
                          onClick={() => handleUpdateStatus(post._id, "Approved")}
                          disabled={statusMutation.isPending || deleteMutation.isPending}
                          title="Approve Listing"
                          className="h-8 w-8 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(post._id, "Rejected")}
                          disabled={statusMutation.isPending || deleteMutation.isPending}
                          title="Reject Listing"
                          className="h-8 w-8 bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        disabled={deleteMutation.isPending}
                        title="Purge Document"
                        className="h-8 w-8 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white border border-slate-100 rounded-lg transition-all inline-flex items-center justify-center active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
                     No tuition logs found matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile View Mode (স্মার্টফোনে ভাঙবে না, ম্যাচিং কার্ড স্ট্যাক) */}
        <div className="block sm:hidden space-y-4 w-full">
          {filteredTuitions.length > 0 ? filteredTuitions.map((post) => (
            <div 
              key={post._id} 
              className={`p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                post.status === 'Rejected' ? 'bg-rose-50/10 border-rose-100/60' : ''
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wider">
                    ID: {String(post._id).slice(-6)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${statusStyles[post.status] || "bg-slate-50 text-slate-400"}`}>
                    {post.status || "pending"}
                  </span>
                </div>
                <h4 className="text-slate-800 font-black text-base line-clamp-2 leading-snug">{post.title || "Untitled Tuition Job"}</h4>
              </div>

              {/* Data Specs Node */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/60 flex items-center gap-1.5 min-w-0">
                  <BookOpen size={13} className="text-[#40bfff] shrink-0" />
                  <span className="truncate">{post.subject || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/60 flex items-center gap-1.5 min-w-0">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate capitalize">{post.location || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/60 flex items-center gap-1.5 min-w-0 col-span-2">
                  <CircleDollarSign size={13} className="text-emerald-500 shrink-0" />
                  <span className="text-emerald-600 truncate">{post.salary || "Negotiable"}</span>
                </div>
              </div>

              {/* Action Node Strip */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3">
                {(post.status === "pending" || !post.status) ? (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => handleUpdateStatus(post._id, "Approved")}
                      disabled={statusMutation.isPending}
                      className="flex-1 h-9 bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 active:scale-95"
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(post._id, "Rejected")}
                      disabled={statusMutation.isPending}
                      className="flex-1 h-9 bg-rose-50 text-rose-500 border border-rose-100 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 active:scale-95"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    disabled={deleteMutation.isPending}
                    className="w-full h-9 bg-rose-50 text-rose-500 border border-rose-100 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Trash2 size={13} /> Delete Post permanently
                  </button>
                )}
              </div>

            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200 p-4">
               <p className="font-black text-slate-300 uppercase tracking-widest text-xs">
                 No postings found matching criteria
               </p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default ManageTuitions;