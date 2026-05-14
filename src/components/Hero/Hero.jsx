import { motion } from "framer-motion";
import { Search, MapPin, BookOpen, GraduationCap, Video } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-20 bg-gradient-to-br from-[#f0f9ff] via-white to-white overflow-hidden">
      
      {/* Background Decorative Circles - Inspired by Screenshot 2026-05-15 021033.png */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -translate-x-12 -translate-y-12" />
      <div className="absolute top-20 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-16" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content & Search UI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight mb-6">
            Learn From <span className="text-[#3fc0ff] italic">Expert Tutors</span> <br />
            Face-To-Face Or Online
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
            eTuitionBd is a complete platform for managing tuition activities including tuition posting, tutor applications, and payments.
          </p>

          {/* 🔍 Search Box UI: Referencing Screenshot 2026-05-15 021033.png */}
          <div className="bg-[#e0f2fe]/60 p-6 rounded-2xl border border-blue-100 shadow-sm max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <select className="select select-bordered w-full bg-white text-slate-500 font-medium h-12">
                <option disabled selected>Select Curriculum</option>
                <option>English Medium</option>
                <option>Bangla Medium</option>
              </select>
              <select className="select select-bordered w-full bg-white text-slate-500 font-medium h-12">
                <option disabled selected>Select Grade</option>
                <option>Class 9</option>
                <option>Class 10 (SSC 2027)</option>
              </select>
              <select className="select select-bordered w-full bg-white text-slate-500 font-medium h-12">
                <option disabled selected>Select Subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" placeholder="Enter Keyword (Optional)" className="input input-bordered flex-grow h-12 bg-white" />
              <button className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-bold px-12 h-12 rounded-lg text-lg shadow-lg shadow-blue-200">
                Search
              </button>
            </div>
          </div>

          {/* Popular Searches Tags */}
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-wider text-[11px]">Popular Searches:</span>
            <button className="badge badge-lg bg-[#3fc0ff]/10 text-[#3fc0ff] border-none py-4 px-4 font-bold text-xs hover:bg-[#3fc0ff] hover:text-white transition-all">Mathematics</button>
            <button className="badge badge-lg bg-slate-100 text-slate-500 border-none py-4 px-4 font-bold text-xs">Physics</button>
            <button className="badge badge-lg bg-slate-100 text-slate-500 border-none py-4 px-4 font-bold text-xs">Chemistry</button>
          </div>
        </motion.div>

        {/* Right Side: Professional Image & Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          {/* Main Hero Image */}
          <div className="relative z-10 w-full max-w-md">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop" 
              alt="Tutor" 
              className="rounded-[3rem] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Floating Stats 1: Registered Students */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 -left-10 z-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-4"
          >
            <div className="bg-[#48bb78] text-white p-2 rounded-full"><GraduationCap size={20}/></div>
            <div>
              <p className="font-black text-slate-800 text-lg leading-none">5000+</p>
              <p className="text-xs text-slate-400 font-bold">Registered Students</p>
            </div>
          </motion.div>

          {/* Floating Stats 2: Tutor Screened */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 -right-10 z-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-50 text-center"
          >
            <div className="flex -space-x-3 mb-2 justify-center">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar"/></div>)}
            </div>
            <p className="font-black text-slate-800 text-lg leading-none">500+</p>
            <p className="text-xs text-slate-400 font-bold">Tutor Screened</p>
          </motion.div>

          {/* Live Sessions Badge */}
          <div className="absolute top-20 -right-5 z-20 bg-[#ff6b6b] text-white p-3 rounded-2xl shadow-lg flex items-center gap-2">
            <Video size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">100+ Live Sessions</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;