import { motion } from "framer-motion";
import { useState } from "react";
import { Search, UserCheck, UserX, Mail, Filter, AlertCircle, Phone, Trash2, Edit3, ShieldAlert } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios"; 
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../Loading/Loading";

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 🔄 ১. TanStack Query: সব ইউজার ডাটা আনা
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/users?isAdminPanel=true");
      return res.data;
    }
  });

  // ⚙️ ২. গ্লোবাল মিউটেশন লগার (সব আপডেট এক জায়গায় ক্যাশ রিফ্রেশ করবে)
  const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  // 🚫 ৩. স্ট্যাটাস পরিবর্তন মিউটেশন (Ban/Unban)
  const statusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const res = await axiosSecure.patch(`/api/users/status/${id}`, { status: newStatus });
      return res.data;
    },
    onSuccess: (data, variables) => {
      refreshUsers();
      variables.newStatus === "blocked" 
        ? toast.error("Account has been restricted successfully") 
        : toast.success("Account restrictions lifted successfully");
    }
  });

  // 🏷️ ৪. রোল পরিবর্তন মিউটেশন (Student / Tutor / Admin)
  const roleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      const res = await axiosSecure.patch(`/api/users/role/${id}`, { role: newRole });
      return res.data;
    },
    onSuccess: () => {
      refreshUsers();
      Swal.fire({ title: "Role Updated!", text: "User access tier modified.", icon: "success", confirmButtonColor: "#40bfff" });
    }
  });

  // 📝 ৫. ইউজার তথ্য সংশোধন মিউটেশন (Name, Phone, Verification Status)
// 📝 ১. মিউটেশন আপডেট (URL এ ইমেইল কুয়েরি পাঠানো হচ্ছে)
const updateInfoMutation = useMutation({
  mutationFn: async ({ email, updatedData }) => {
    const res = await axiosSecure.patch(`/api/user?email=${email}`, updatedData);
    return res.data;
  },
  onSuccess: () => {
    refreshUsers();
    Swal.fire({ 
      title: "Updated!", 
      text: "User profile records corrected.", 
      icon: "success", 
      confirmButtonColor: "#40bfff" 
    });
  }
});

// 🖱️ ২. হ্যান্ডলার ফাংশন আপডেট (mutate করার সময় email পাস করা হচ্ছে)


  // 🗑️ ৬. অ্যাকাউন্ট চিরতরে ডিলিট করার মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/user/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refreshUsers();
      Swal.fire({ title: "Deleted!", text: "User account permanently purged.", icon: "success", confirmButtonColor: "#40bfff" });
    }
  });

  // 🖱️ অ্যাকশন হ্যান্ডলারস (SweetAlert2 প্রিমিয়াম ইন্টিগ্রেশন)
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    statusMutation.mutate({ id, newStatus });
  };

  const handleChangeRole = (id, currentRole) => {
    Swal.fire({
      title: "Modify User Role",
      input: "select",
      inputOptions: { student: "Student", tutor: "Tutor", admin: "Admin" },
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonColor: "#40bfff",
      confirmButtonText: "Change Role",
      inputValidator: (value) => {
        if (value === currentRole) return "Please select a different role!";
      }
    }).then((result) => {
      if (result.isConfirmed) roleMutation.mutate({ id, newRole: result.value });
    });
  };

  const handleUpdateInfo = (user) => {
  Swal.fire({
    title: "Correct User Data",
    html: `
      <div class="space-y-3 font-sans text-left">
        <div>
          <label class="text-xs font-black uppercase tracking-wider text-slate-400">Full Name</label>
          <input id="swal-name" class="w-full h-11 px-3 mt-1 bg-slate-50 border rounded-xl font-bold" value="${user.name || ""}">
        </div>
        <div>
          <label class="text-xs font-black uppercase tracking-wider text-slate-400">Contact Number</label>
          <input id="swal-phone" class="w-full h-11 px-3 mt-1 bg-slate-50 border rounded-xl font-bold" value="${user.phone || ""}">
        </div>
        <div>
          <label class="text-xs font-black uppercase tracking-wider text-slate-400">Verification Status</label>
          <select id="swal-verified" class="w-full h-11 px-3 mt-1 bg-slate-50 border rounded-xl font-bold">
            <option value="false" ${!user.isVerified ? "selected" : ""}>Unverified</option>
            <option value="true" ${user.isVerified ? "selected" : ""}>Verified Profile ✅</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: "#40bfff",
    confirmButtonText: "Save Data",
    preConfirm: () => {
      return {
        name: document.getElementById("swal-name").value.trim(),
        phone: document.getElementById("swal-phone").value.trim(),
        isVerified: document.getElementById("swal-verified").value === "true"
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      // 🔥 এখানে user._id এর বদলে user.email পাঠানো হলো
      updateInfoMutation.mutate({ email: user.email, updatedData: result.value });
    }
  });
};

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Purge Account?",
      text: "This will permanently delete this user and all associated logs!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete forever!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // 🔍 ফিল্টারিং
  const filteredUsers = users.filter((user) => {
    const userName = user?.name ? String(user.name).toLowerCase() : "";
    const userEmail = user?.email ? String(user.email).toLowerCase() : "";
    const matchesSearch = userName.includes(searchTerm.toLowerCase()) || userEmail.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || (user?.role || "student") === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) return <Loading />;
  if (isError) return <div class="text-center text-rose-500 p-10"><AlertCircle size={40} class="mx-auto" /><p>{error.message}</p></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto px-1 sm:px-2"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Manage Users</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Master Access Control & Identity Dashboard</p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="Search by name or email..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold outline-none text-sm" />
        </div>
        <div className="relative w-full md:w-48 flex items-center bg-slate-50 rounded-2xl px-4 h-12">
          <Filter className="text-slate-400 mr-2" size={16} />
          <select onChange={(e) => setRoleFilter(e.target.value)} class="w-full bg-transparent font-black text-sm text-slate-700 outline-none cursor-pointer appearance-none"><option value="all">All Roles</option><option value="tutor">Tutors</option><option value="student">Students</option><option value="admin">Admins</option></select>
        </div>
      </div>

      {/* Master Content */}
      <div className="bg-transparent sm:bg-white rounded-none sm:rounded-[2.5rem] border-none sm:border border-slate-100 sm:shadow-sm overflow-hidden w-full">
        
        {/* 💻 Desktop View: Table Mode */}
        <div className="hidden sm:block w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest">
                <th className="p-4 lg:p-5 w-[35%] rounded-tl-none sm:rounded-tl-[2.5rem]">Account Identity</th>
                <th className="p-4 lg:p-5 w-[18%]">Contact</th>
                <th className="p-4 lg:p-5 w-[12%]">Role</th>
                <th className="p-4 lg:p-5 w-[12%]">Status</th>
                <th className="p-4 lg:p-5 w-[23%] text-right pr-6">Management Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredUsers.map((user) => (
                <tr key={user._id} className={`hover:bg-slate-50/50 ${user.status === 'blocked' ? 'bg-rose-50/20' : ''}`}>
                  <td className="p-4 lg:p-5 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <img src={user.image || "https://i.pravatar.cc/100"} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-800 font-black text-sm truncate">{user.name || "Unknown User"} ${user.isVerified ? "✅" : ""}</p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5"><Mail size={11} className="shrink-0" /><span className="truncate">{user.email}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 lg:p-5 truncate text-slate-700 font-medium">{user.phone || "N/A"}</td>
                  <td className="p-4 lg:p-5"><span onClick={() => handleChangeRole(user._id, user.role || "student")} className="cursor-pointer px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-blue-50 text-[#40bfff] border-blue-100 hover:bg-[#40bfff] hover:text-white transition-all">{user.role || "student"}</span></td>
                  <td className="p-4 lg:p-5"><span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border ${user.status === 'blocked' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{user.status || "active"}</span></td>
                  <td className="p-4 lg:p-5 text-right whitespace-nowrap pr-6 space-x-1">
                    <button onClick={() => handleUpdateInfo(user)} title="Edit Profile" className="h-8 w-8 bg-slate-50 hover:bg-[#40bfff] hover:text-white rounded-lg transition-all text-slate-500 inline-flex items-center justify-center"><Edit3 size={13} /></button>
                    <button onClick={() => handleToggleStatus(user._id, user.status || "active")} title={user.status === 'blocked' ? "Unban" : "Ban User"} className={`h-8 w-8 rounded-lg transition-all inline-flex items-center justify-center ${user.status === 'blocked' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white'}`}>{user.status === 'blocked' ? <UserCheck size={13} /> : <UserX size={13} />}</button>
                    <button onClick={() => handleDeleteUser(user._id)} title="Delete Account" className="h-8 w-8 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all inline-flex items-center justify-center"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile View: Card Stack Mode */}
        <div className="block sm:hidden space-y-4 w-full">
          {filteredUsers.map((user) => (
            <div key={user._id} className={`p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-3 ${user.status === 'blocked' ? 'bg-rose-50/10' : ''}`}>
              <div className="flex items-center gap-3">
                <img src={user.image || "https://i.pravatar.cc/100"} className="w-11 h-11 rounded-xl object-cover shrink-0" alt="" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-slate-800 font-black text-sm truncate">{user.name || "Unknown User"} {user.isVerified ? "✅" : ""}</h4>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1 truncate"><Mail size={11} /> {user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-1 truncate"><Phone size={11} /><span className="truncate">{user.phone || "N/A"}</span></div>
                <div onClick={() => handleChangeRole(user._id, user.role || "student")} className="bg-slate-50 p-2 rounded-xl flex items-center justify-between cursor-pointer border border-dashed hover:bg-blue-50/40"><span className="text-[9px] uppercase font-black text-slate-400">Role</span><span className="text-[9px] uppercase font-black text-[#40bfff]">{user.role || "student"}</span></div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-2">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${user.status === 'blocked' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>{user.status || "active"}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleUpdateInfo(user)} className="h-8 px-2.5 bg-slate-50 text-slate-600 font-black text-xs rounded-xl flex items-center gap-1"><Edit3 size={12} /> Edit</button>
                  <button onClick={() => handleToggleStatus(user._id, user.status || "active")} className={`h-8 px-2.5 font-black text-xs rounded-xl flex items-center gap-1 ${user.status === 'blocked' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>{user.status === 'blocked' ? "Unban" : "Ban"}</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="h-8 w-8 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default ManageUsers;