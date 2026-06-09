import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "../Logo/Logo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut: signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut().then(() => {
      setIsOpen(false);
      navigate("/login");
    });
  };

  // 🔥 রিকোয়ারমেন্ট গাইডলাইন অনুযায়ী ডাইনামিক রুট জেনারেটর (১০০% রিয়েল ডাটা ড্রিভেন)
  const getNavLinks = () => {
    if (user) {
      // ✅ Logged In: মিনিমাম ৬টি রুট (Home, Tuitions, Tutors, Notices, About, Contact)
      return [
        { name: "Home", path: "/" },
        { name: "Tuitions", path: "/tuitions" },
        { name: "Tutors", path: "/tutors" },
        { name: "Notices", path: "/blogs" }, // অ্যাডমিন নোটিশ / ব্লগ রিয়েল পেজ রুট
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];
    } else {
      // ✅ Logged Out: মিনিমাম ৪টি রুট (Home, Tuitions, About, Contact)
      return [
        { name: "Home", path: "/" },
        { name: "Tuitions", path: "/tuitions" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];
    }
  };

  const activeLinks = getNavLinks();

  return (
    <nav 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Requirement: Display Logo & Website Name */}
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-8 text-[16px] font-semibold text-slate-600">
            {activeLinks.map((link) => (
              <li key={link.name}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => 
                    `hover:text-primary transition-colors relative pb-1 ${
                      isActive ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary" : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirement: Auth-based navigation (Login/Register vs Advanced Dropdown) */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            /* 👑 Advanced Dropdown Menu Requirement */
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5">
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL || "https://i.ibb.co/31mSWhY/avatar.png"} alt="profile" />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-white rounded-xl w-60 border border-slate-50">
                <div className="px-4 py-2 mb-2 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-800 truncate text-sm">{user?.displayName || user?.name}</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">{user?.role || "student"}</p>
                </div>
                <li><Link className="py-2 font-bold flex gap-2" to="/dashboard"><LayoutDashboard size={16}/> Dashboard</Link></li>
                <div className="h-[1px] bg-slate-100 my-1" />
                <li><button onClick={handleLogout} className="py-2 font-bold text-error flex gap-2"><LogOut size={16}/> Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-bold text-slate-600 hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-2.5 rounded-xl bg-[#40bfff] text-white font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Responsive: Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-800 p-2 bg-slate-100 rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu with Framer Motion (100% Layout & Overflow Protection) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4 font-bold text-base text-slate-700">
              {activeLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => isActive ? "text-primary font-black" : "hover:text-primary"}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-[1px] bg-slate-100 my-1" />
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl mb-1">
                    <img className="w-9 h-9 rounded-full object-cover border border-primary/20" src={user?.photoURL} alt="user" />
                    <div>
                      <p className="text-xs font-black text-slate-800 truncate max-w-[180px]">{user?.displayName || user?.name}</p>
                      <p className="text-[9px] font-black uppercase text-primary tracking-widest">{user?.role}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-outline btn-primary btn-sm rounded-xl flex gap-2 font-bold w-full"><LayoutDashboard size={14}/> Dashboard</Link>
                  <button onClick={handleLogout} className="btn btn-error btn-sm text-white rounded-xl flex gap-2 font-bold w-full"><LogOut size={14}/> Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm font-bold text-slate-600">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white btn-sm font-black rounded-xl">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;