import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="fixed inset-0 bg-[#f8fafc] flex flex-col items-center justify-center z-[9999]"
    >
      {/* 🔮 Center Glowing Background Element */}
      <div className="absolute w-[400px] h-[400px] bg-[#40bfff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-8">
        
        {/* 🎨 Dynamic Animated Logo Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer Track */}
          <div className="absolute inset-0 border-[6px] border-slate-100 rounded-[2rem]"></div>
          
          {/* Animated Spinning Premium Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
            className="absolute inset-0 border-[6px] border-[#40bfff] rounded-[2rem] border-t-transparent border-r-transparent"
          ></motion.div>

          {/* Inner Pulsing Core Dot */}
          <motion.div 
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className="w-4 h-4 bg-[#40bfff] rounded-full shadow-[0_0_15px_rgba(64,191,255,0.6)]"
          ></motion.div>
        </div>

        {/* ✍️ Premium Typography Tracking Label */}
        <div className="text-center space-y-2 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-black tracking-tighter text-slate-800"
          >
            eTuition<span className="text-[#40bfff]">BD</span>
          </motion.h2>
          
          {/* Text-based Loading Dot Animation */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 pl-[0.25em]"
          >
            Loading Securely
          </motion.p>
        </div>

        {/* 📏 Minimalist Horizontal Progress Bar */}
        <div className="w-40 h-[4px] bg-slate-100 rounded-full overflow-hidden relative">
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