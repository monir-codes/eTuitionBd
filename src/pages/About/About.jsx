import { motion } from "framer-motion";
import { ShieldCheck, Users, Target, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { id: 1, value: "5k+", label: "Active Students" },
    { id: 2, value: "500+", label: "Verified Tutors" },
    { id: 3, value: "15k+", label: "Hours Taught" },
    { id: 4, value: "99%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: <ShieldCheck size={32} className="text-[#40bfff]" />,
      title: "Automated Security",
      desc: "We ensure safe matches and background checks for every tutor on our platform to build a secure environment."
    },
    {
      icon: <Target size={32} className="text-[#40bfff]" />,
      title: "Right Matchmaking",
      desc: "Our smart filtering system helps students find the perfect educator based on budget, subjects, and location."
    },
    {
      icon: <Award size={32} className="text-[#40bfff]" />,
      title: "Premium Quality",
      desc: "We prioritize skilled and experienced tutors from top institutions to maintain excellent educational standards."
    }
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* 🚀 Section 1: Intro / Hero Style Banner */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-[#40bfff] bg-blue-50 px-4 py-2 rounded-full inline-block mb-4">
              Who We Are
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6 leading-tight">
              Bridging the Gap Between <br />
              <span className="text-[#40bfff]">Expert Tutors</span> & Students
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
              eTuitional is a premium, secure, and smart tuition management platform in Bangladesh. We simplify the process of finding verified local or online tutors, allowing parents and students to experience hassle-free learning with automated tracking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/tuitions">
                <button className="h-14 px-8 bg-[#40bfff] text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center gap-2">
                  Find Tuitions <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/tutors">
                <button className="h-14 px-8 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl hover:border-[#40bfff] hover:text-[#40bfff] transition-all">
                  Browse Tutors
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side Decorative Visual Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6 relative"
          >
            <div className="space-y-6">
              <div className="h-48 rounded-[3rem] bg-gradient-to-br from-[#40bfff] to-[#2980b9] shadow-lg shadow-blue-100"></div>
              <div className="h-64 rounded-[3rem] bg-white border border-slate-100 p-8 flex flex-col justify-end shadow-sm">
                <Users size={40} className="text-[#40bfff] mb-4" />
                <h4 className="text-xl font-black text-slate-800">Community Driven</h4>
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="h-64 rounded-[3rem] bg-slate-900 p-8 flex flex-col justify-between text-white shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Our Vision</span>
                <p className="text-xl font-bold leading-tight">Making quality education accessible across Bangladesh.</p>
              </div>
              <div className="h-48 rounded-[3rem] bg-[#40bfff]/10 border border-blue-50"></div>
            </div>
          </motion.div>
        </div>

        {/* 📊 Section 2: Numbers/Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] border border-slate-50 p-10 shadow-[0_15px_50px_-20px_rgba(0,0,0,0.05)] grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-800">{stat.value}</h3>
              <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* 🛡️ Section 3: Core Values (Features Grid) */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">Our Core Values</h2>
            <p className="text-slate-500 font-bold">The principles that drive our platform to provide a safe learning ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{val.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;