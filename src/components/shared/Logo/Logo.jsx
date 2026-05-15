import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2.5 group select-none`}
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 🎨 The Geometric Icon: Inspired by the Reference Image */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
        {/* Background Track Circle */}
        <div className="absolute inset-0 border-[4.5px] border-slate-200 rounded-full"></div>
        
        {/* Active Gradient/Solid Circle Segment */}
        <div className="absolute inset-0 border-[4.5px] border-[#40bfff] rounded-full border-t-transparent -rotate-45 group-hover:rotate-45 transition-transform duration-700 ease-in-out"></div>
        
        {/* Optional: Small Dot for extra professional touch */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#40bfff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* ✍️ Website Name with Premium Typography */}
      <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 leading-none">
        eTuition<span className="text-[#40bfff]">BD</span>
      </span>
    </Link>
  );
};

export default Logo;