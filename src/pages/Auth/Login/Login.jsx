import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Stars } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { FaChrome } from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";

const Login = () => {
  const { signIn, googleSignIn, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxios();

  const from = location?.state?.from?.pathname || "/dashboard";

  // 🤝 সেশন এবং রোল মার্জিং লজিক
  const handleUserSession = async (firebaseUser, toastId) => {
    try {
      const response = await axiosSecure.get(`/api/users/${firebaseUser.email}`);
      const dbUser = response.data;

      const finalUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || dbUser.name,
        photoURL: firebaseUser.photoURL || dbUser.image,
        role: dbUser.role || "student" 
      };

      setUser(finalUserData);
      toast.update(toastId, { 
        render: `Welcome back, ${finalUserData.displayName}!`, 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast.update(toastId, { render: "Profile verified, redirecting...", type: "success", isLoading: false, autoClose: 2000 });
      setUser({ ...firebaseUser, role: "student" });
      navigate(from, { replace: true });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Authenticating secure session...");
    try {
      const result = await signIn(data.email, data.password);
      await handleUserSession(result.user, toastId);
    } catch (err) {
      toast.update(toastId, { render: "Invalid email or password credentials.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const toastId = toast.loading("Connecting via Google...");
    googleSignIn()
      .then((result) => { handleUserSession(result.user, toastId); })
      .catch(() => { toast.update(toastId, { render: "Google sign-in cancelled.", type: "error", isLoading: false, autoClose: 3000 }); });
  };

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100"
      >
        
        {/* 🎨 Left Side Banner - Huhu Register Page er moto eye-friendly dark */}
        <div className="bg-slate-950 p-12 text-slate-400 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#40bfff]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-52 h-52 bg-[#40bfff]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-900/40 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-12 my-auto">
            <div>
              <span className="bg-slate-900 text-[#40bfff] border border-slate-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
                eTuitionBD
              </span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                Welcome <br /> Back To Gateway
              </h2>
            </div>

            {/* Same Feature Cards for Visual Continuity */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-200">Secure Gateway</h4>
                  <p className="text-slate-500 text-xs font-bold">Encrypted sessions with high-tier database integrity.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-200">Real-time Analytics</h4>
                  <p className="text-slate-500 text-xs font-bold">Instantly view applied jobs, payments and stats.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs font-bold text-slate-600 uppercase tracking-widest mt-6">
            © 2026 eTuitionBD. All rights reserved.
          </div>
        </div>

        {/* 📝 Right Side Form - Clean white to match Register Form style */}
        <div className="p-8 sm:p-12 my-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-slate-800 mb-1">Account Login</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Enter credentials to access dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("email", { required: "Email is required" })}
                  type="email" placeholder="Email Address" 
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">⚠️ {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("password", { required: "Password is required" })}
                  type="password" placeholder="Password" 
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.password ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">⚠️ {errors.password.message}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pr-1">
              <Link className="text-[10px] font-black text-slate-400 hover:text-[#40bfff] uppercase tracking-widest hover:underline transition-colors">Forgot Password?</Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authorizing..." : "Login Now"} 
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-300 font-black text-[9px] uppercase tracking-widest">Or Gateway Auth</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Google SSO Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-14 border border-slate-100 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
          >
            <FaChrome size={18} className="text-[#40bfff]" /> Continue with Google
          </button>

          <p className="text-center mt-8 font-bold text-slate-400">
            New here? <Link to="/register" className="text-[#40bfff] hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;