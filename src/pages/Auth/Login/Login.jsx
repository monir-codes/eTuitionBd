import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // axios.post('/api/login', data)...
  };

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Login to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register("email", { required: "Email is required" })}
                type="email" placeholder="Email Address" 
                className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register("password", { required: "Password is required" })}
                type="password" placeholder="Password" 
                className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.password ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link className="text-[10px] font-black text-[#40bfff] uppercase tracking-widest hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group">
            Login Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 font-bold text-slate-400">
          New here? <Link to="/register" className="text-[#40bfff] hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;