import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-md w-full space-y-8">
        
        {/* 🪟 Animated Illustration / Icon Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center"
        >
          {/* Background soft glow */}
          <div className="absolute inset-0 bg-[#40bfff]/10 blur-3xl rounded-full w-48 h-48 mx-auto -z-10"></div>
          
          <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-center text-[#40bfff]">
            <AlertCircle size={64} strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* 📝 Text Content */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black text-slate-800 tracking-tighter"
          >
            4<span className="text-[#40bfff]">0</span>4
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-slate-700"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 font-bold max-w-sm mx-auto leading-relaxed"
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>
        </div>

        {/* 🔄 Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#40bfff] text-white h-14 px-8 rounded-2xl font-black text-md shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group">
              <Home size={18} /> Back to Home
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white text-slate-700 border border-slate-100 h-14 px-8 rounded-2xl font-black text-md shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default ErrorPage;