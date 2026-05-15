import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserCircle, GraduationCap, Mail, Lock, User, ArrowRight } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState("student"); // Default role

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100"
      >
        {/* 🎨 Left Side: Decorative & Info */}
        <div className="bg-[#40bfff] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 leading-tight">Start Your <br /> Journey with Us</h2>
            <p className="text-blue-50 font-bold text-lg opacity-90">
              Join thousands of tutors and students in the most trusted tuition platform in Bangladesh.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} className="w-12 h-12 rounded-full border-4 border-[#40bfff] bg-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-[#40bfff] bg-white flex items-center justify-center text-[#40bfff] font-black text-xs">+2k</div>
            </div>
            <p className="font-bold text-sm">Join 2,000+ verified users today!</p>
          </div>

          {/* Abstract circles for design */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
        </div>

        {/* 📝 Right Side: Form */}
        <div className="p-8 sm:p-12">
          <h3 className="text-3xl font-black text-slate-800 mb-8">Create Account</h3>

          {/* Role Selection */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setRole("student")}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === "student" ? "border-[#40bfff] bg-blue-50/50 text-[#40bfff]" : "border-slate-100 text-slate-400"}`}
            >
              <UserCircle size={24} />
              <span className="font-black uppercase text-xs tracking-widest">Student</span>
            </button>
            <button 
              onClick={() => setRole("tutor")}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === "tutor" ? "border-[#40bfff] bg-blue-50/50 text-[#40bfff]" : "border-slate-100 text-slate-400"}`}
            >
              <GraduationCap size={24} />
              <span className="font-black uppercase text-xs tracking-widest">Tutor</span>
            </button>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="password" placeholder="Password" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>

            <button className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group">
              Register as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 font-bold text-slate-400">
            Already have an account? <Link to="/login" className="text-[#40bfff] hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;