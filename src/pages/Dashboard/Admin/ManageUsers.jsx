import { motion } from "framer-motion";
import { useState } from "react";
import { Search, UserCheck, UserX, Mail, Filter, Loader2, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios"; 
import { toast } from "react-toastify";

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 🔄 ১. TanStack Query দিয়ে ডাটাবেজ থেকে লাইভ ইউজার ফেচ করা
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/users");
      return res.data;
    }
  });

  // 🚫 ২. useMutation দিয়ে ইউজার ব্লক/আনব্লক করার স্টেট হ্যান্ডল করা
  const mutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const res = await axiosSecure.patch(`/api/users/status/${id}`, { status: newStatus });
      return res.data;
    },
    // সাকসেস হলে টোস্ট দেখাবে এবং ব্যাকগ্রাউন্ডে ডাটা রি-ফেচ (Invalidate) করবে
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      if (variables.newStatus === "blocked") {
        toast.error("Account has been restricted successfully");
      } else {
        toast.success("Account restrictions lifted successfully");
      }
    },
    onError: () => {
      toast.error("Failed to update user access permission.");
    }
  });

  const toggleUserStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    mutation.mutate({ id, newStatus });
  };

  // 🔍 ক্লায়েন্ট-সাইড ফিল্টারিং (ক্যাশিং ডেটার ওপর সার্চ)
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ⏳ লোডিং স্টেট হ্যান্ডলার
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Synchronizing Database...</p>
      </div>
    );
  }

  // ⚠️ এরর স্টেট হ্যান্ডলার
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500">
        <AlertCircle size={40} />
        <p className="font-black uppercase tracking-wider">Failed to sync: {error.message}</p>
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Manage Users</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Access Control Engine backed by TanStack Query</p>
      </div>

      {/* Controls Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="relative w-full sm:w-48 flex items-center bg-slate-50 rounded-2xl px-4 h-12">
          <Filter className="text-slate-400 mr-2" size={16} />
          <select 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-transparent border-none font-black text-sm text-slate-700 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="tutor">Tutors</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {/* Master Users Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-xs uppercase tracking-widest">
                <th className="p-6 rounded-tl-[3rem]">Account Identity</th>
                <th className="p-6">Contact Number</th>
                <th className="p-6">Role</th>
                <th className="p-6">Status</th>
                <th className="p-6 rounded-tr-[3rem] text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user._id} className={`hover:bg-slate-50/50 transition-colors ${user.status === 'blocked' ? 'bg-rose-50/20' : ''}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <img src={user.image || "https://i.pravatar.cc/100"} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="text-slate-800 font-black text-base">{user.name}</p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-slate-700 font-medium">{user.phone || "N/A"}</td>

                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.role === 'tutor' ? 'bg-blue-50 text-[#40bfff] border-blue-100' : 'bg-purple-50 text-purple-500 border-purple-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                    }`}>
                      {user.status || "active"}
                    </span>
                  </td>

                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleUserStatus(user._id, user.status || "active")}
                      disabled={mutation.isPending}
                      className={`h-10 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-black shadow-sm ml-auto disabled:opacity-50 ${
                        user.status === 'blocked' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                          : 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white'
                      }`}
                    >
                      {user.status === 'blocked' ? (
                        <>
                          <UserCheck size={14} /> Unban
                        </>
                      ) : (
                        <>
                          <UserX size={14} /> Ban User
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
                     No users found in database
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageUsers;