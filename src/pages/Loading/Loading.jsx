import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="fixed inset-0 w-full h-full bg-[#f8fafc] flex flex-col items-center justify-center z-[9999] overflow-hidden select-none px-4" // 🔥 overflow-hidden এবং px-4 লক করা হলো অ্যান্টি-স্ক্রল ট্র্যাপের জন্য
    >
      {/* 🔮 Center Glowing Background Element (মোবাইলের জন্য সাইজ ব্যালেন্সড) */}
      <div className="absolute w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#40bfff]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-6 sm:gap-8 max-w-xs sm:max-w-md text-center">
        
        {/* 🎨 Dynamic Animated Logo Icon */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
          {/* Outer Track */}
          <div className="absolute inset-0 border-[5px] sm:border-[6px] border-slate-100 rounded-[1.5rem] sm:rounded-[2rem]"></div>
          
          {/* Animated Spinning Premium Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
            className="absolute inset-0 border-[5px] sm:border-[6px] border-[#40bfff] rounded-[1.5rem] sm:rounded-[2rem] border-t-transparent border-r-transparent"
          ></motion.div>

          {/* Inner Pulsing Core Dot */}
          <motion.div 
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#40bfff] rounded-full shadow-[0_0_15px_rgba(64,191,255,0.6)]"
          ></motion.div>
        </div>

        {/* ✍️ Premium Typography Tracking Label */}
        <div className="space-y-1.5 sm:space-y-2 relative z-10 w-full">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800"
          >
            eTuition<span className="text-[#40bfff]">BD</span>
          </motion.h2>
          
          {/* Text-based Loading Dot Animation */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-slate-400 pl-[0.25em]"
          >
            Loading Securely
          </motion.p>
        </div>

        {/* 📏 Minimalist Horizontal Progress Bar */}
        <div className="w-32 sm:w-40 h-[4px] bg-slate-100 rounded-full overflow-hidden relative shrink-0">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#40bfff] to-transparent rounded-full"
          ></motion.div>
        </div>

      </div>
    </div>
  );
};

export default Loading;