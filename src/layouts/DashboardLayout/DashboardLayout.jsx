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
  const {data: role = []} = useQuery({
    queryKey: ["role", user?.email],
    queryFn: async()=>{
      const res = await axiosSecure.get(`/api/user?email=${user?.email}`)
      return res.data.role
    }
  })

  if (!role) {
    return <Loading />; 
  }


  const handleLogout = () => {
    logOut().then(() => {
      navigate("/login");
    });
  };

  // 📋 ৩. ফিক্সড রাউটিং পাথ (চাইল্ড রাউটের নিয়ম অনুযায়ী প্রিফিক্স ও স্ল্যাশ মুক্ত)
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
    ],
  };

  // কারেন্ট রোলের মেনু নিয়ে আসা
  const roleMenu = menuConfig[role] || [];

  // ⚙️ গ্লোবাল সেটিংস রাউট (সব রোলের জন্যই কমন নিচের বাটনটার জন্য)
  const settingsPath = "profile-settings";

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] flex "
    >
      {/* 💻 Desktop Sidebar */}
      <aside className="w-80 bg-slate-950 text-slate-400 p-8 flex flex-col justify-between hidden lg:flex fixed h-screen z-30">
        <div className="space-y-12 w-full">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white block pl-4"
          >
            eTuition<span className="text-[#40bfff]">BD</span>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 pl-4 mb-4">
              {role} Dashboard
            </p>
            {roleMenu.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end // সঠিক পেজে অ্যাক্টিভ ক্লাস ধরে রাখার জন্য
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

        {/* Footer User Profile Card & Actions */}
        <div className="border-t border-slate-900 pt-6 w-full space-y-2">
          {/* 👤 User Info Display */}
          <div className="flex items-center gap-3 pl-4 mb-4">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/100"}
              className="w-10 h-10 rounded-xl object-cover bg-slate-800"
              alt="Avatar"
            />
            <div className="leading-tight">
              <h4 className="text-white font-black text-sm max-w-[160px] truncate">
                {user?.displayName || "User"}
              </h4>
              <p className="text-xs text-slate-500 font-bold capitalize">
                {role}
              </p>
            </div>
          </div>

          {/* ⚙️ Profile Settings Button */}
          <NavLink
            to={settingsPath}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 h-12 rounded-2xl font-black text-sm transition-all ${
                isActive
                  ? "bg-[#40bfff] text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <Settings size={18} />
            <span>Profile Settings</span>
          </NavLink>

          {/* 🚪 Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 h-12 w-full rounded-2xl font-black text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Sidebar Slide-over */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-y-0 left-0 w-72 bg-slate-950 text-slate-400 p-8 flex flex-col justify-between z-40 lg:hidden shadow-2xl"
          >
            <div className="space-y-12">
              <div className="flex items-center gap-8 mb-6">

              <span className="text-2xl font-black tracking-tighter text-white block pl-4">
                eTuitionBD
              </span>
              <Link to="/" className="w-full bg-gray-800 p-2 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                 <BiHome size={20} />
              </Link>
              </div>
              <nav className="space-y-2">
                {roleMenu.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 h-14 rounded-2xl font-black transition-all ${
                        isActive
                          ? "bg-[#40bfff] text-white"
                          : "hover:bg-slate-900 hover:text-white"
                      }`
                    }
                  >
                    {item.icon} <span>{item.label}</span>
                  </NavLink>
                ))}

                {/* ⚙️ Mobile Settings Link */}
                <NavLink
                  to={settingsPath}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-5 h-14 rounded-2xl font-black transition-all ${
                      isActive
                        ? "bg-[#40bfff] text-white"
                        : "hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Settings size={20} /> <span>Profile Settings</span>
                </NavLink>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 h-14 w-full rounded-2xl font-black text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={20} /> <span>Logout</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🖥️ Main Dynamic Content View Area */}
      <main className="flex-grow lg:pl-80 min-h-screen">
        <div className="p-6 md:p-12 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
