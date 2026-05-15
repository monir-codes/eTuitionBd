import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserCircle, GraduationCap, Mail, Lock, User, ArrowRight } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState("student");
  
  // React Hook Form initialization
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const finalData = { ...data, role };
    console.log("Registration Data:", finalData);
    // integrate your backend API here
  };

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100">
        
        {/* Left Side Banner */}
        <div className="bg-[#40bfff] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 leading-tight">Start Your <br /> Journey with Us</h2>
            <p className="text-blue-50 font-bold text-lg">Join the most trusted tuition platform in Bangladesh.</p>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Form Side */}
        <div className="p-8 sm:p-12">
          <h3 className="text-3xl font-black text-slate-800 mb-8">Create Account</h3>

          {/* Role Selection */}
          <div className="flex gap-4 mb-8">
            {['student', 'tutor'].map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === r ? "border-[#40bfff] bg-blue-50 text-[#40bfff]" : "border-slate-100 text-slate-400"}`}>
                {r === 'student' ? <UserCircle size={24} /> : <GraduationCap size={24} />}
                <span className="font-black uppercase text-[10px] tracking-widest">{r}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("fullName", { required: "Name is required" })}
                  type="text" placeholder="Full Name" 
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.fullName ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  type="email" placeholder="Email Address" 
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  type="password" placeholder="Password" 
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.password ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group">
              Register as {role} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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