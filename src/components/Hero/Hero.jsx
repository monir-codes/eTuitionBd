import { motion } from "framer-motion";
import { Search, GraduationCap, Video, Users } from "lucide-react";

const Hero = () => {
  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="relative min-h-screen pt-24 pb-12 bg-[#f0f9ff]/50 overflow-hidden flex items-center"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-blue-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-40 h-40 bg-blue-500/5 rounded-full translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content: Text & Search UI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] mb-6">
            Learn From <span className="text-[#3fc0ff] italic">Expert Tutors</span> <br className="hidden sm:block" />
            Face-To-Face Or Online
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 font-medium leading-relaxed">
            eTuitionBd is a complete platform for managing tuition activities including tuition posting, tutor applications, and payments.
          </p>

          {/* 🔍 Search Box UI: Fully Responsive */}
          <div className="bg-[#e0f2fe]/60 p-4 sm:p-6 rounded-3xl border border-blue-100 shadow-sm max-w-2xl mx-auto lg:mx-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <select className="select select-bordered w-full bg-white text-slate-500 font-bold h-12 rounded-xl focus:ring-2 focus:ring-primary/20">
                <option disabled selected>Select Curriculum</option>
                <option>English Medium</option>
                <option>Bangla Medium</option>
              </select>
              <select className="select select-bordered w-full bg-white text-slate-500 font-bold h-12 rounded-xl">
                <option disabled selected>Select Grade</option>
                <option>Class 9</option>
                <option>Class 10 (SSC 2027)</option>
              </select>
              <select className="select select-bordered w-full bg-white text-slate-500 font-bold h-12 rounded-xl">
                <option disabled selected>Select Subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter Keyword (Optional)" 
                className="input input-bordered flex-grow h-12 bg-white rounded-xl font-medium" 
              />
              <button className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-10 h-12 rounded-xl text-lg shadow-lg shadow-blue-200 transition-all active:scale-95">
                Search
              </button>
            </div>
          </div>

          {/* Popular Searches Tags: Responsive flex */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start items-center">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest w-full lg:w-auto mb-2 lg:mb-0">Popular:</span>
            {["Mathematics", "Physics", "English", "Science"].map((tag) => (
              <button key={tag} className="px-4 py-1.5 rounded-full bg-white border border-slate-100 text-slate-500 font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all">
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Content: Image & Floating Stats (Hidden on smaller mobile) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden sm:flex justify-center lg:justify-end"
        >
          {/* Main Hero Image with Rounded Corners */}
          <div className="relative z-10 w-full max-w-[400px] lg:max-w-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop" 
              alt="Expert Tutor" 
              className="rounded-[3rem] lg:rounded-[4rem] shadow-2xl border-8 border-white"
            />
            
            {/* Floating Stats 1: Students */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 lg:-left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3"
            >
              <div className="bg-emerald-500 text-white p-2 rounded-xl"><Users size={20}/></div>
              <div className="pr-2">
                <p className="font-black text-slate-800 text-lg leading-none">5000+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Students</p>
              </div>
            </motion.div>

            {/* Floating Stats 2: Tutors */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 lg:-right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 text-center"
            >
              <div className="flex -space-x-3 mb-2 justify-center">
                {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar"/>)}
              </div>
              <p className="font-black text-slate-800 text-lg leading-none">500+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Verified Tutors</p>
            </motion.div>

            {/* Live Badge */}
            <div className="absolute -top-4 right-10 bg-[#ff6b6b] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
              <Video size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;