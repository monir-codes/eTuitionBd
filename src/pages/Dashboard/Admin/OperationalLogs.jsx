import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Terminal, Search, SlidersHorizontal, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle, Calendar, User, Tag } from "lucide-react";
import Swal from "sweetalert2";
import Loading from "../../Loading/Loading";

const OperationalLogs = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // ⚙️ টেবিল কন্ট্রোল স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // 📝 মডাল কন্ট্রোল
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // 🔄 ১. ডাটাবেজ থেকে লাইভ সব এক্টিভিটি লগ তুলে আনা ভাই
  const { data: logs = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-system-activities"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/activities");
      return res.data;
    }
  });

  // 🗑️ ২. ডাটাবেজ ডিলিট ইঞ্জিন (DELETE)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/admin/activities/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-system-activities"]);
      Swal.fire({
        title: "Purged!",
        text: "Log record wiped out from the main database cluster.",
        icon: "success",
        confirmButtonColor: "#40bfff",
        customClass: { popup: "rounded-[2rem]" }
      });
    }
  });

  // 🛠️ ৩. ডাটাবেজ আপডেট ইঞ্জিন (PATCH)
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/api/admin/activities/${updatedData._id || updatedData.id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-system-activities"]);
      setIsEditModalOpen(false);
      Swal.fire({
        title: "Updated!",
        text: "Database document modifications committed successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
        customClass: { popup: "rounded-[2rem]" }
      });
    }
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-rose-500 gap-2">
        <AlertTriangle size={40} />
        <p className="font-black uppercase tracking-wider text-sm">Failed to connect server logs: {error.message}</p>
      </div>
    );
  }

  // 🚀 একশন ট্রিগারস
  const handleDelete = (id) => {
    Swal.fire({
      title: "Destroy Log Entry?",
      text: "This process cannot be reverted in the MongoDB instance.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Purge Document",
      customClass: { popup: "rounded-[2rem]" }
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleView = (row) => {
    Swal.fire({
      title: "System Telemetry Log",
      html: `
        <div style="text-align: left; font-family: 'League Spartan', sans-serif;" class="space-y-2">
          <p><strong>Log ID:</strong> <span style="color:#40bfff">${row._id || row.id}</span></p>
          <p><strong>Operator:</strong> ${row.user}</p>
          <p><strong>Event:</strong> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:800">${row.type || "System Internal"}</span></p>
          <p style="margin-top:12px"><strong>Payload Details:</strong></p>
          <p style="background:#f8fafc; padding:12px; border-radius:12px; font-size:13px; color:#475569; border:1px solid #e2e8f0; line-height: 1.5">${row.detail}</p>
          <p style="margin-top:8px; font-size:11px; color:#94a3b8"><strong>Timestamp:</strong> ${row.date || "N/A"}</p>
        </div>
      `,
      confirmButtonColor: "#40bfff",
      customClass: { popup: "rounded-[2.5rem]" }
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(selectedLog);
  };

  // 🔍 সার্চ ও ফিল্টার প্রসেসর
  const filteredLogs = logs.filter(log => {
    const logId = log.id || log._id || "";
    const logUser = log.user || "";
    const logType = log.type || "";
    const matchesSearch = logUser.toLowerCase().includes(searchTerm.toLowerCase()) || logId.toLowerCase().includes(searchTerm.toLowerCase()) || logType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // পেজিনেশন
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-4 select-none overflow-hidden">
      
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-950 text-[#40bfff] rounded-2xl flex items-center justify-center shadow-lg shrink-0"><Terminal size={20} /></div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 leading-tight truncate">System Operational Logs</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] mt-0.5">Live MongoDB telemetry tracking panel</p>
        </div>
      </div>

      {/* Control Box */}
      <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Filter server operation logs..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="w-full pl-10 pr-4 h-11 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20" 
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 rounded-xl h-11 border border-slate-100/50 w-full sm:w-auto justify-between sm:justify-start">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none font-black text-xs text-slate-600 outline-none cursor-pointer pr-4 h-full flex-1 sm:flex-none">
            <option value="All">All Authorizations</option>
            <option value="Approved">Approved</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* 📱 🖥️ মডিফাইড ডাটা ডিসপ্লে এরিয়া (১০০% রেসপন্সিভ লক ভাই) */}
      <div className="w-full">
        
        {/* ক) ডেস্কটপ লেআউট: বড় স্ক্রিনে টেবিল শো করবে (hidden md:block) */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hidden md:block w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-5">Cluster Ref ID</th>
                  <th className="py-4 px-5">Operator Identity</th>
                  <th className="py-4 px-5">Trigger Event</th>
                  <th className="py-4 px-5">Log Overview Payload</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Data Controller</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm font-bold text-slate-600 divide-y divide-slate-50">
                {paginatedLogs.length > 0 ? paginatedLogs.map((row) => (
                  <tr key={row._id || row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-black text-slate-800 text-xs">{row._id || row.id}</td>
                    <td className="py-4 px-5 text-slate-700">{row.user}</td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#40bfff] text-[10px] font-black uppercase tracking-wide">
                        {row.type || "System Internal"}
                      </span>
                    </td>
                    <td className="py-4 px-5 max-w-[220px] truncate text-slate-400 font-medium" title={row.detail}>{row.detail}</td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        row.status === "Approved" || row.status === "Verified" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleView(row)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#40bfff] hover:bg-blue-50 rounded-xl transition-colors"><Eye size={13} /></button>
                        <button onClick={() => { setSelectedLog({...row}); setIsEditModalOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"><Edit size={13} /></button>
                        <button onClick={() => handleDelete(row._id || row.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-16 font-black text-slate-300 text-xs uppercase tracking-widest bg-white">No active data pipelines found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* খ) মোবাইল লেআউট: ছোট স্ক্রিনে প্রতিটা ডাটা আলাদা প্রিমিয়াম কার্ড হয়ে যাবে (md:hidden) */}
        <div className="grid grid-cols-1 gap-4 md:hidden w-full">
          {paginatedLogs.length > 0 ? paginatedLogs.map((row, idx) => (
            <motion.div 
              key={row._id || row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden"
            >
              {/* কার্ড টপ বার */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ref: {(row._id || row.id).slice(-6)}...</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  row.status === "Approved" || row.status === "Verified" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>{row.status}</span>
              </div>

              {/* কার্ড কন্টেন্ট */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-black">
                  <User size={13} className="text-slate-400 shrink-0" /> <span>{row.user}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Tag size={13} className="text-slate-400 shrink-0" /> 
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#40bfff] text-[9px] font-black uppercase tracking-wide">
                    {row.type || "System Internal"}
                  </span>
                </div>
                <p className="text-slate-400 font-medium text-[11px] leading-relaxed break-words pt-1 line-clamp-2">
                  {row.detail}
                </p>
              </div>

              {/* কার্ড অ্যাকশন বাটন প্যানেল */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Calendar size={12} /> <span>{row.date || "Just Now"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleView(row)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#40bfff] hover:bg-blue-50 rounded-xl transition-all"><Eye size={14} /></button>
                  <button onClick={() => { setSelectedLog({...row}); setIsEditModalOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(row._id || row.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-12 font-black text-slate-300 text-xs uppercase tracking-widest bg-white rounded-2xl border border-slate-100">No active data pipelines found</div>
          )}
        </div>

        {/* রেসপন্সিভ পেজিনেটর ফুটার বক্স */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white md:bg-slate-50/50 border border-slate-100 md:border-none rounded-2xl md:rounded-none md:border-t md:border-slate-50 w-full flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-9 w-1/2 sm:w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 disabled:opacity-40"><ChevronLeft size={14} /></button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="h-9 w-1/2 sm:w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 disabled:opacity-40"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* 👑 গ্লাস মরফিজম ডাটা এডিট মডাল */}
      <AnimatePresence>
        {isEditModalOpen && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-800">Update Log Authorization</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {selectedLog._id || selectedLog.id}</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Operator Alias</label>
                  <input type="text" value={selectedLog.user} onChange={(e) => setSelectedLog({ ...selectedLog, user: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#40bfff]/20" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Payload Context Detail</label>
                  <textarea value={selectedLog.detail} onChange={(e) => setSelectedLog({ ...selectedLog, detail: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 h-24 resize-none p-4 focus:ring-2 focus:ring-[#40bfff]/20 outline-none" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Server Authorization State</label>
                  <select value={selectedLog.status} onChange={(e) => setSelectedLog({ ...selectedLog, status: e.target.value })} className="w-full h-11 px-3 bg-slate-50 border-none rounded-xl font-black text-xs text-slate-600 outline-none cursor-pointer">
                    <option value="Approved">Approved</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2 border-t border-slate-50">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="h-10 flex-1 bg-slate-100 text-slate-500 font-black rounded-xl text-xs uppercase tracking-wider">Abort</button>
                  <button type="submit" className="h-10 flex-1 bg-[#40bfff] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-100">Commit DB</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationalLogs;