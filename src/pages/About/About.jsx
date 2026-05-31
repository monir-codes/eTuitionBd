import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Users, Target, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CounterItem = ({ targetValue, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });

  const numericTarget = parseInt(targetValue.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = targetValue.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setCount(Math.floor(progress * numericTarget));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, numericTarget, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
};

const About = () => {
  const stats = [
    { id: 1, value: "5k+", label: "Active Students" },
    { id: 2, value: "500+", label: "Verified Tutors" },
    { id: 3, value: "15k+", label: "Hours Taught" },
    { id: 4, value: "99%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: <ShieldCheck size={28} className="text-[#40bfff]" />,
      title: "Automated Security",
      desc: "We ensure safe matches and background checks for every tutor on our platform to build a secure environment."
    },
    {
      icon: <Target size={28} className="text-[#40bfff]" />,
      title: "Right Matchmaking",
      desc: "Our smart filtering system helps students find the perfect educator based on budget, subjects, and location."
    },
    {
      icon: <Award size={28} className="text-[#40bfff]" />,
      title: "Premium Quality",
      desc: "We prioritize skilled and experienced tutors from top institutions to maintain excellent educational standards."
    }
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 lg:space-y-28 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left space-y-4 sm:space-y-6 max-w-2xl mx-auto lg:mx-0 w-full"
          >
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#40bfff] bg-blue-50/60 px-4 py-1.5 rounded-full inline-block mb-3 sm:mb-4">
                Who We Are
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight tracking-tight">
                Bridging the Gap Between <br />
                <span className="text-[#40bfff]">Expert Tutors</span> & Students
              </h1>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-medium leading-relaxed">
              eTuitional is a premium, secure, and smart tuition management platform in Bangladesh. We simplify the process of finding verified local or online tutors, allowing parents and students to experience hassle-free learning with automated tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <Link to="/tuitions" className="w-full sm:w-auto">
                <button className="h-12 sm:h-14 w-full sm:px-8 bg-[#40bfff] text-white font-black rounded-xl sm:rounded-2xl shadow-md shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider active:scale-95">
                  Find Tuitions <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/tutors" className="w-full sm:w-auto">
                <button className="h-12 sm:h-14 w-full sm:px-8 bg-white border border-slate-200 text-slate-700 font-black rounded-xl sm:rounded-2xl hover:border-[#40bfff] hover:text-[#40bfff] transition-all text-xs sm:text-sm uppercase tracking-wider active:scale-95">
                  Browse Tutors
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 relative w-full max-w-xl mx-auto lg:max-w-none"
          >
            <div className="space-y-4 sm:space-y-6 w-full">
              <div className="h-32 sm:h-44 lg:h-48 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#40bfff] to-[#2980b9] shadow-md shadow-blue-100 w-full"></div>
              <div className="h-44 sm:h-56 lg:h-64 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-slate-100 p-5 sm:p-8 flex flex-col justify-end shadow-sm w-full min-w-0">
                <Users size={32} className="text-[#40bfff] mb-3 sm:mb-4 shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-black text-slate-800 truncate">Community Driven</h4>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-12 w-full">
              <div className="h-44 sm:h-56 lg:h-64 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 p-5 sm:p-8 flex flex-col justify-between text-white shadow-lg w-full min-w-0">
                <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Our Vision</span>
                <p className="text-base sm:text-lg lg:text-xl font-bold leading-snug tracking-tight">Making quality education accessible across Bangladesh.</p>
              </div>
              <div className="h-32 sm:h-44 lg:h-48 rounded-[2rem] sm:rounded-[2.5rem] bg-[#40bfff]/5 border border-blue-50/50 w-full"></div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-50 p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.04)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center w-full divide-y sm:divide-y-0 sm:divide-x divide-slate-50"
        >
          {stats.map((stat, idx) => (
            <div key={stat.id} className={`space-y-0.5 sm:space-y-1 w-full min-w-0 ${idx > 0 ? "pt-4 sm:pt-0" : ""}`}>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800">
                <CounterItem targetValue={stat.value} duration={2000} />
              </h3>
              <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest truncate px-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="space-y-8 sm:space-y-12 w-full">
          <div className="text-center max-w-xl mx-auto px-2 space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Our Core Values</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">The principles driving a safe learning ecosystem</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className={`bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 flex flex-col items-start w-full min-w-0 ${
                  idx === 2 ? "sm:col-span-2 lg:col-span-1 max-w-none sm:max-w-md lg:max-w-none mx-auto lg:mx-0" : ""
                }`}
              >
                <div className="w-12 h-12 bg-blue-50/60 rounded-xl flex items-center justify-center mb-5 shrink-0">
                  {val.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2 truncate w-full">{val.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-xs sm:text-sm break-words w-full">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;