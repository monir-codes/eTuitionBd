import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";

const Login = () => {
  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-100"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-400 font-bold">Login to manage your profile</p>
        </div>

        <form className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="password" placeholder="Password" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
          </div>

          <div className="flex justify-end">
            <Link className="text-xs font-black text-[#40bfff] uppercase tracking-wider">Forgot Password?</Link>
          </div>

          <button className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group">
            Login Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-[1px] bg-slate-100 flex-grow"></div>
          <span className="text-slate-300 font-black text-xs uppercase">Or</span>
          <div className="h-[1px] bg-slate-100 flex-grow"></div>
        </div>

        <button className="w-full border-2 border-slate-100 text-slate-600 h-14 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
          <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-5 h-5" alt="google" /> Continue with Google
        </button>

        <p className="text-center mt-8 font-bold text-slate-400">
          New to eTuitional? <Link to="/register" className="text-[#40bfff] hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;