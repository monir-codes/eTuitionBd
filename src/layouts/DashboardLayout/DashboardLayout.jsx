import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, LayoutDashboard, FileText, 
  Briefcase, CheckSquare, Users, LogOut, Menu, X 
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🚀 হার্ডকোডেড "tutor" বাদ দিয়ে সরাসরি ইউজারের রিয়েল-টাইম রোল নেওয়া হলো
  // তোমার ডাটাবেজ/ফায়ারবেস অবজেক্ট অনুযায়ী user?.role চেক হবে
  const role = user?.role || "student"; 

  const handleLogout = () => {
    logOut().then(() => {
      navigate("/login");
    });
  };

  // 📋 রোল অনুযায়ী সাইডবার মেনু কনফিগারেশন (পাথগুলো রাউটারের সাথে হুবহু মেলানো হয়েছে)
  const menuConfig = {
    admin: [
      { path: "admin", label: "Overview", icon: <LayoutDashboard size={20} /> },
      { path: "manage-tutors", label: "Verify Tutors", icon: <GraduationCap size={20} /> },
      { path: "manage-users", label: "Manage Users", icon: <Users size={20} /> },
    ],
    tutor: [
      { path: "tutor", label: "Tutor Profile", icon: <User size={20} /> },
      { path: "tutor/applied-jobs", label: "Applied Jobs", icon: <Briefcase size={20} /> }, // ফিক্সড পাথ
    ],
    student: [
      { path: "student/my-posts", label: "My Tuition Posts", icon: <CheckSquare size={20} /> }, // ফিক্সড পাথ
      { path: "student/post-tuition", label: "Post a Tuition", icon: <FileText size={20} /> }, // ফিক্সড পাথ
    ]
  };

  const currentMenu = menuConfig[role] || [];

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] flex">
      
      {/* 💻 Desktop Sidebar */}
      <aside className="w-80 bg-slate-950 text-slate-400 p-8 flex flex-col justify-between hidden lg:flex fixed h-screen z-30">
        <div className="space-y-12 w-full">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white block pl-4">
            eTuition<span className="text-[#40bfff]">BD</span>
          </Link>

          <nav className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 pl-4 mb-4">
              {role} Dashboard
            </p>
            {currentMenu.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                // end প্রপসটি দেওয়া হয়েছে যেন সাব-পাথগুলোতে লিংকের একটিভ স্টাইল ব্রেক না করে
                end={item.path === "tutor" || item.path === "admin"}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-5 h-14 rounded-2xl font-black transition-all ${
                    isActive 
                      ? "bg-[#40bfff] text-white shadow-lg shadow-blue-500/20" 
                      : "hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-900 pt-6 w-full space-y-4">
          <div className="flex items-center gap-3 pl-4 mb-4">
            <img src={user?.photoURL || "https://i.pravatar.cc/100"} className="w-10 h-10 rounded-xl object-cover" alt="Avatar" />
            <div className="leading-tight">
              <h4 className="text-white font-black text-sm max-w-[160px] truncate">{user?.displayName || "User"}</h4>
              <p className="text-xs text-slate-500 font-bold capitalize">{role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-4 px-5 h-14 w-full rounded-2xl font-black text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ Main View Area */}
      <main className="flex-grow lg:pl-80 min-h-screen">
        <div className="p-6 md:p-12 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;