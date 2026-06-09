import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Briefcase,
  CheckSquare,
  LogOut,
  Menu,
  X,
  CreditCard,
  Settings,
  BookCheck,
  CircleUserRound,
  BarChart3,
  Bookmark,
  Terminal, 
} from "lucide-react";
import { BiHome } from "react-icons/bi";
import useAuth from "../../hooks/useAuth";
import Loading from "../../pages/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const DashboardLayout = () => {
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const axiosSecure = useAxios();

  // 🚨 ১. অথেনটিকেশন বা রোল লোড হওয়া পর্যন্ত লেআউট হোল্ড করে রাখবে
  if (loading) {
    return <Loading />;
  }

  // 🚀 ২. রিয়েল-টাইম রোল ডিটেকশন (admin, tutor, student)
  const { data: role = [] } = useQuery({
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/user?email=${user?.email}`);
      return res.data.role;
    },
  });

  if (!role) {
    return <Loading />;
  }

  const handleLogout = () => {
    logOut().then(() => {
      navigate("/login");
    });
  };

  // ==========================================
  // 👑 রিকোয়ারমেন্ট ৭: কড়া নিয়ম অনুযায়ী সাইডবার মেনু কনফিগারেশন কাউন্ট লক
  // ==========================================
  const menuConfig = {
    admin: [
      {
        path: "admin",
        label: "Overview",
        icon: <LayoutDashboard size={20} />,
      },
      {
        path: "admin/manage-tutors",
        label: "Manage Tutors",
        icon: <GraduationCap size={20} />,
      },
      {
        path: "admin/manage-tuitions",
        label: "Manage Tuitions",
        icon: <BookCheck size={20} />,
      },
      {
        path: "admin/manage-users",
        label: "Manage Users",
        icon: <CircleUserRound size={20} />,
      },
      {
        path: "admin/reports-analytics", 
        label: "Reports & Analytics", 
        icon: <BarChart3 size={20} />, 
      },
      {
        path: "admin/operational-logs", 
        label: "Operational Logs", 
        icon: <Terminal size={20} />, 
      },
    ],
    tutor: [
      {
        path: "tutor",
        label: "Tutor Profile",
        icon: <User size={20} />,
      },
      {
        path: "tutor/applied-jobs",
        label: "Applied Jobs",
        icon: <Briefcase size={20} />,
      },
      {
        path: "tutor/payment-history",
        label: "Payment History",
        icon: <CreditCard size={20} />,
      },
      {
        path: "my-bookmarks", 
        label: "My Bookmarks",
        icon: <Bookmark size={20} />,
      },
    ],
    student: [
      {
        path: "student/my-posts",
        label: "My Tuition Posts",
        icon: <CheckSquare size={20} />,
      },
      {
        path: "student/post-tuition",
        label: "Post a Tuition",
        icon: <FileText size={20} />,
      },
      {
        path: "student/payment-history",
        label: "Payment History",
        icon: <CreditCard size={20} />,
      },
      {
        path: "my-bookmarks", 
        label: "My Bookmarks",
        icon: <Bookmark size={20} />,
      },
    ],
  };

  const roleMenu = menuConfig[role] || [];
  const settingsPath = "profile-settings";

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] flex relative overflow-x-hidden"
    >
      {/* 💻 Desktop Sidebar */}
      {/* 🎯 ফিক্স: h-screen এবং h-full এর প্রপার ব্যালেন্সিং সাথে custom-scrollbar লক করা হলো ভাই যাতে বাটন কেটে না যায় */}
      <aside className="w-80 bg-slate-950 text-slate-400 p-6 hidden lg:flex flex-col justify-between fixed h-screen top-0 bottom-0 left-0 z-30 border-r border-slate-900">
        <div className="flex flex-col space-y-9 w-full overflow-y-auto max-h-[calc(100vh-180px)] pr-1 custom-sidebar-nav">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white block pl-3 mt-2"
          >
            eTuition<span className="text-[#40bfff]">BD</span>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-1.5 w-full">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 pl-3 mb-3">
              {role} Dashboard
            </p>
            {roleMenu.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end 
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 h-12 rounded-xl font-black text-sm transition-all ${
                    isActive
                      ? "bg-[#40bfff] text-white shadow-lg shadow-blue-500/10"
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

        {/* 🎯 ফিক্স ফুটার কন্টেইনার: এটিকে একদম সাইডবারের বটমে ফিক্সড লকড করে দেওয়া হলো ভাই */}
        <div className="border-t border-slate-900 pt-4 w-full space-y-1 mt-auto bg-slate-950">
          {/* 👤 User Profile Card */}
          <div className="flex items-center gap-3 pl-3 mb-3 pt-1">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/100"}
              className="w-9 h-9 rounded-xl object-cover bg-slate-800 shrink-0"
              alt="Avatar"
            />
            <div className="leading-tight min-w-0 flex-1">
              <h4 className="text-white font-black text-xs truncate">
                {user?.displayName || "User"}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold capitalize mt-0.5">
                {role} account
              </p>
            </div>
          </div>

          {/* ⚙️ Settings */}
          <NavLink
            to={settingsPath}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 h-11 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-[#40bfff] text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <Settings size={16} />
            <span>Profile Settings</span>
          </NavLink>

          {/* 🚪 Logout Button (এবার স্ক্রিনে ১০০% ভিজিবল থাকবে ভাই) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 h-11 w-full rounded-xl font-black text-xs uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-all text-left"
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-5 right-5 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl border border-slate-900"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 📱 Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-slate-950 text-slate-400 p-6 flex flex-col justify-between z-40 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-8 w-full overflow-y-auto max-h-[calc(100vh-160px)] custom-sidebar-nav">
              <div className="flex items-center justify-between mb-2 pl-3">
                <span className="text-xl font-black tracking-tighter text-white">
                  eTuitionBD
                </span>
                <Link
                  to="/"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <BiHome size={16} />
                </Link>
              </div>
              <nav className="space-y-1.5 w-full">
                {roleMenu.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 h-12 rounded-xl font-black text-sm transition-all ${
                        isActive
                          ? "bg-[#40bfff] text-white"
                          : "hover:bg-slate-900 hover:text-white"
                      }`
                    }
                  >
                    {item.icon} <span>{item.label}</span>
                  </NavLink>
                ))}

                <NavLink
                  to={settingsPath}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 h-12 rounded-xl font-black text-sm transition-all ${
                      isActive
                        ? "bg-[#40bfff] text-white"
                        : "hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Settings size={18} /> <span>Profile Settings</span>
                </NavLink>
              </nav>
            </div>

            <div className="border-t border-slate-900 pt-4 bg-slate-950 w-full">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 h-12 w-full rounded-xl font-black text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left"
              >
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🖥️ Main Dynamic Content View Area */}
      {/* 🎯 ফিক্স: রেসপন্সিভ ব্যালেন্স করতে ডেস্কটপে পজিশন lg:pl-80 লক করা হলো ভাই */}
      <main className="flex-1 lg:pl-80 min-h-screen w-full">
        <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* কাস্টম স্ক্রোলবার ফিল্টারিং সিএসএস */}
      <style>{`
        .custom-sidebar-nav::-webkit-scrollbar {
          width: 3px;
        }
        .custom-sidebar-nav::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;