import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  DollarSign, CreditCard, Calendar, ArrowUpRight, Search, 
  FileSpreadsheet, AlertCircle, Inbox, User, Mail, MessageSquare, 
  Trash2, Eye, Megaphone, Loader2, Sparkles, Tag, FileText, Edit, X
} from "lucide-react";
import Loading from "../../Loading/Loading";
import Swal from "sweetalert2";

const ReportsAnalytics = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("financials");
  const [loadingNotice, setLoadingNotice] = useState(false);

  // ⚙️ নোটিশ এডিট মডাল স্টেট
  const [isNoticeEditOpen, setIsNoticeEditOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // ==========================================
  // 🔄 ১. এপিআই চেইন: ফাইন্যান্সিয়াল রিপোর্ট ফেচ
  // ==========================================
  const { data: reportData, isLoading: isFinancialsLoading, isError: isFinancialsError } = useQuery({
    queryKey: ["financial-report"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/financial-reports");
      return res.data;
    }
  });

  // ==========================================
  // 🔄 ২. এপিআই চেইন: পাবলিক কন্টাক্ট মেসেজ ফেচ
  // ==========================================
  const { data: messages = [], isLoading: isInboxLoading, isError: isInboxError } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/messages");
      return res.data;
    }
  });

  // ==========================================
  // 🔄 ৩. এপিআই চেইন: মঙ্গোডিবি থেকে লাইভ নোটিশ ফেচ ভাই
  // ==========================================
  const { data: notices = [], isLoading: isNoticesLoading } = useQuery({
    queryKey: ["platform-notices"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/notices");
      return res.data;
    }
  });

  // ==========================================
  // 🗑️ ৪. মিউটেশন: কন্টাক্ট মেসেজ ডিলিট ইঞ্জিন
  // ==========================================
  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/admin/messages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-contact-messages"]);
      Swal.fire({ title: "Wiped Out!", text: "Message removed from cluster.", icon: "success", confirmButtonColor: "#40bfff", customClass: { popup: "rounded-[2rem]" } });
    }
  });

  // ==========================================
  // 📢 ৫. মিউটেশন: নতুন নোটিশ পোস্ট ইঞ্জিন
  // ==========================================
  const noticeMutation = useMutation({
    mutationFn: async (noticePayload) => {
      const res = await axiosSecure.post("/api/admin/notices", noticePayload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["platform-notices"]);
      Swal.fire({ title: "Notice Broadcasted! 📢", text: "Platform circular is now live on public board.", icon: "success", confirmButtonColor: "#10b981", customClass: { popup: "rounded-[2rem]" } });
      reset();
    }
  });

  // ==========================================
  // 🗑️ ৬. 🆕 মিউটেশন: নোটিশ ডিলিট করার ইঞ্জিন ভাই
  // ==========================================
  const deleteNoticeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/admin/notices/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["platform-notices"]);
      Swal.fire({ title: "Purged!", text: "Notice purged from live public stream.", icon: "success", confirmButtonColor: "#ff6b6b", customClass: { popup: "rounded-[2rem]" } });
    }
  });

  // ==========================================
  // 🛠️ ৭. 🆕 মিউটেশন: নোটিশ আপডেট বা এডিট করার ইঞ্জিন
  // ==========================================
  const updateNoticeMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/api/admin/notices/${updatedData._id || updatedData.id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["platform-notices"]);
      setIsNoticeEditOpen(false);
      Swal.fire({ title: "Committed!", text: "Database record updated successfully.", icon: "success", confirmButtonColor: "#10b981", customClass: { popup: "rounded-[2rem]" } });
    }
  });

  // ডাটাবেজ ফলব্যাক সেফটি
  const transactions = reportData?.transactions || [];
  const totalEarnings = reportData?.totalEarnings || 0;

  // 🔍 ট্রানজেকশন ফিল্টারিং
  const filteredTransactions = transactions.filter((tx) => {
    const id = tx?.transactionId ? String(tx.transactionId).toLowerCase() : "";
    const email = tx?.userEmail ? String(tx.userEmail).toLowerCase() : "";
    return id.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const latestTransactions = transactions.slice(0, 5).reverse();
  const maxAmount = Math.max(...latestTransactions.map(tx => parseFloat(tx?.amount) || 0), 1); 

  // ==========================================
  // 🚀 অ্যাকশন হ্যান্ডলারস (SweetAlert2)
  // ==========================================
  const handleDeleteMessage = (id) => {
    Swal.fire({ title: "Purge Message?", text: "Wipes record from DB cluster permanently.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ff6b6b", confirmButtonText: "Yes, delete" }).then((res) => { if (res.isConfirmed) deleteMessageMutation.mutate(id); });
  };

  const handleViewMessage = (msg) => {
    Swal.fire({ title: "Inbound Telemetry", html: `<div style="text-align: left; font-family: 'League Spartan'; font-size:14px;" class="space-y-2"><p><strong>Sender:</strong> ${msg.name}</p><p><strong>Email:</strong> ${msg.email}</p><p style="background:#f1f5f9; padding:6px; border-radius:8px;"><strong>Message:</strong><br/>${msg.message}</p></div>`, confirmButtonColor: "#40bfff", customClass: { popup: "rounded-[2rem]" } });
  };

  const handleNoticeDeleteAction = (id) => {
    Swal.fire({ title: "Destroy This Notice?", text: "This will remove the circular from public board instantly.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ff6b6b", confirmButtonText: "Purge Notice" }).then((res) => { if (res.isConfirmed) deleteNoticeMutation.mutate(id); });
  };

  const handleNoticeEditSubmit = (e) => {
    e.preventDefault();
    updateNoticeMutation.mutate(selectedNotice);
  };

  const onNoticeSubmit = async (data) => {
    setLoadingNotice(true);
    data.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    await noticeMutation.mutateAsync(data);
    setLoadingNotice(false);
  };

  if (isFinancialsLoading || isInboxLoading || isNoticesLoading) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full max-w-7xl mx-auto px-1 py-1 overflow-hidden" style={{ fontFamily: "'League Spartan', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Reports & Analytics</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Centralized Platform Management Node</p>
        </div>

        {/* ৩-ট্যাব সুইচার */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-2xl gap-1 w-fit">
          <button onClick={() => setActiveTab("financials")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "financials" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Financials</button>
          <button onClick={() => setActiveTab("inbox")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "inbox" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>User Inbox <span className="bg-[#40bfff] text-white font-sans font-bold text-[10px] px-1.5 py-0.2 rounded-md">{messages.length}</span></button>
          <button onClick={() => setActiveTab("broadcast")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "broadcast" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Broadcast Notice</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* 📊 ট্যাব ১: ফাইনান্সিয়াল ওভারভিউ */}
        {activeTab === "financials" && (
          <motion.div key="financials-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Total Platform Earnings</p>
                  <h2 className="text-3xl font-black text-slate-900 flex items-baseline">${totalEarnings}<span className="text-xs font-bold text-emerald-500 ml-1.5 flex items-center gap-0.5"><ArrowUpRight size={12}/> Net gross</span></h2>
                </div>
                <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><DollarSign size={20} /></div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Successful Checkouts</p>
                  <h2 className="text-3xl font-black text-slate-900">{transactions.length}<span className="text-xs font-bold text-slate-400 ml-1.5 font-sans">Invoices</span></h2>
                </div>
                <div className="h-11 w-11 bg-blue-50 text-[#40bfff] rounded-xl flex items-center justify-center shrink-0"><CreditCard size={20} /></div>
              </div>
            </div>

            {/* গ্রাফ ও টেবিল পার্ট */}
            <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-end">
              <div className="flex items-end justify-around h-48 w-full">
                {latestTransactions.map((tx, idx) => (
                  <div key={idx} className="flex flex-col items-center group relative w-12">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded-md transition-all">${parseFloat(tx.amount)}</div>
                    <div style={{ height: `${(parseFloat(tx.amount) / maxAmount) * 100}%` }} className="w-8 bg-gradient-to-t from-[#40bfff]/40 to-[#40bfff] rounded-t-md cursor-pointer" />
                    <span className="text-[10px] text-slate-400 font-black mt-2">{tx.date || "Recent"}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 📬 ট্যাব ২: মেসেজ ইনবক্স পার্ট */}
        {activeTab === "inbox" && (
          <motion.div key="inbox-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, py: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.length > 0 ? messages.map((msg) => (
              <div key={msg._id} className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Subject: {msg.subject}</span>
                  <h4 className="text-slate-800 font-black text-sm flex items-center gap-1.5"><User size={14} /> {msg.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 bg-white p-3 rounded-xl border">{msg.message}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold"><Calendar size={11} /> {msg.submittedAt ? new Date(msg.submittedAt).toLocaleDateString() : "Recent"}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleViewMessage(msg)} className="p-2 bg-white text-slate-400 hover:text-[#40bfff] rounded-lg shadow-sm"><Eye size={13} /></button>
                    <button onClick={() => handleDeleteMessage(msg._id)} className="p-2 bg-white text-slate-400 hover:text-rose-500 rounded-lg shadow-sm"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            )) : <p className="col-span-full text-center py-10 font-black text-slate-300 uppercase tracking-widest text-xs">No entries found</p>}
          </motion.div>
        )}

        {/* 📢 🆕 ট্যাব ৩: ব্রডকাস্ট নোটিশ ফর্ম + লাইভ নোটিশ কন্ট্রোল গ্রিড (CRUD) */}
        {activeTab === "broadcast" && (
          <motion.div key="broadcast-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* নোটিশ সাবমিট ফর্ম */}
            <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <form onSubmit={handleSubmit(onNoticeSubmit)} className="space-y-4 w-full">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Notice Headline</label>
                  <input {...register("title", { required: "Headline is required" })} type="text" placeholder="SSC 2027 Syllabus Guidelines Update..." className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                    <select {...register("category")} className="w-full h-11 px-3 bg-slate-50 border-none rounded-xl font-black text-xs text-slate-600 outline-none cursor-pointer">
                      <option value="Academic">Academic</option>
                      <option value="System">System</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Scope Tag</label>
                    <input {...register("tag", { required: true })} type="text" placeholder="e.g., SSC 2027, Payments" className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Brief Summary</label>
                  <input {...register("summary", { required: true })} type="text" placeholder="Short description for the feed card display..." className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Core Text Content Payload</label>
                  <textarea {...register("content", { required: true })} rows="3" placeholder="Write full comprehensive brief details and guidelines..." className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none resize-none focus:ring-2 focus:ring-[#40bfff]/20"></textarea>
                </div>
                <button type="submit" disabled={loadingNotice} className="h-11 px-6 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                  {loadingNotice ? <Loader2 className="animate-spin" size={15} /> : <><Sparkles size={14} /> Broadcast Notice</>}
                </button>
              </form>
            </div>

            {/* 👑 🆕 লাইভ ডাটাবেজ নোটিশ কন্ট্রোল গ্রিড (CRUD Table List) */}
            <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5"><Megaphone size={16} className="text-[#40bfff]"/> Active Cloud Broadcast Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {notices.length > 0 ? notices.map((notice) => (
                  <div key={notice._id} className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-[#40bfff] border border-blue-100">{notice.category}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{notice.date || "Recent"}</span>
                      </div>
                      <h4 className="text-slate-800 font-black text-sm truncate">{notice.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-medium">{notice.summary}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                      <span className="text-[9px] font-black text-slate-400 bg-white px-2 py-0.5 rounded border">#{notice.tag}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setSelectedNotice({...notice}); setIsNoticeEditOpen(true); }} className="p-2 bg-white text-slate-400 hover:text-emerald-500 rounded-xl shadow-sm transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleNoticeDeleteAction(notice._id)} className="p-2 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-center py-6 text-slate-300 font-black text-xs uppercase tracking-widest col-span-full">No notices published in database cluster</p>}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 👑 🆕 ডাইনামিক নোটিশ এডিট মডাল (পপআপ লেয়ার) */}
      <AnimatePresence>
        {isNoticeEditOpen && selectedNotice && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-800">Edit Public Notice</h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">ID: {selectedNotice._id}</p>
                </div>
                <button onClick={() => setIsNoticeEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              
              <form onSubmit={handleNoticeEditSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Headline</label>
                  <input type="text" value={selectedNotice.title} onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#40bfff]/20" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Card Summary</label>
                  <input type="text" value={selectedNotice.summary} onChange={(e) => setSelectedNotice({ ...selectedNotice, summary: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#40bfff]/20" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Memorandum Body</label>
                  <textarea value={selectedNotice.content} onChange={(e) => setSelectedNotice({ ...selectedNotice, content: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 h-24 resize-none p-4 focus:ring-2 focus:ring-[#40bfff]/20 outline-none" required />
                </div>
                <div className="flex gap-3 pt-2 border-t border-slate-50">
                  <button type="button" onClick={() => setIsNoticeEditOpen(false)} className="h-10 flex-1 bg-slate-100 text-slate-500 font-black rounded-xl text-xs uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="h-10 flex-1 bg-[#40bfff] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-100">Save to DB</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportsAnalytics;