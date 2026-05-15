import { motion } from "framer-motion";
import { UserPlus, Search, GraduationCap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UserPlus size={32} className="text-[#40bfff]" />,
      title: "Create Account",
      description: "Sign up as a tutor or student in minutes with our simple registration process.",
      bg: "bg-blue-50"
    },
    {
      id: 2,
      icon: <Search size={32} className="text-[#40bfff]" />,
      title: "Find Match",
      description: "Search for specific subjects or post your tuition requirements to find the best match.",
      bg: "bg-emerald-50"
    },
    {
      id: 3,
      icon: <GraduationCap size={32} className="text-[#40bfff]" />,
      title: "Start Learning",
      description: "Connect with your perfect match and start your journey of expert learning.",
      bg: "bg-purple-50"
    }
  ];

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            How It <span className="text-[#40bfff]">Works</span>
          </motion.h2>
          <p className="text-slate-500 font-bold text-lg">
            A simple 3-step process to get started with eTuitional.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] text-center group"
            >
              {/* Step Number */}
              <div className="absolute top-6 right-8 text-6xl font-black text-slate-50 opacity-10 group-hover:text-primary/20 transition-colors">
                0{step.id}
              </div>
              
              {/* Icon Wrapper */}
              <div className={`w-20 h-20 ${step.bg} rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform duration-500 group-hover:rotate-6 shadow-sm`}>
                {step.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;