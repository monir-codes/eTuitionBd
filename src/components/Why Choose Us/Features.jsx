import { motion } from "framer-motion";
import { ShieldCheck, Zap, Clock, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Verified Tutors",
      desc: "Every tutor on eTuitional goes through a strict verification process.",
      icon: <ShieldCheck className="w-10 h-10 text-primary" />
    },
    {
      title: "Fast Matching",
      desc: "Our AI-powered system finds the best tutor for you within minutes.",
      icon: <Zap className="w-10 h-10 text-primary" />
    },
    {
      title: "Flexible Timing",
      desc: "Choose your preferred time slots for face-to-face or online sessions.",
      icon: <Clock className="w-10 h-10 text-primary" />
    },
    {
      title: "Secure Payment",
      desc: "Integrated automated payment tracking for a hassle-free experience.",
      icon: <CreditCard className="w-10 h-10 text-primary" />
    }
  ];

  return (
    <section className="py-24 bg-white" style={{ fontFamily: "'League Spartan', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight">
              Why Students & Parents <br /> 
              <span className="text-primary italic">Trust Us</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
              We provide a seamless experience for both students seeking knowledge and expert tutors looking to share their expertise.
            </p>
            <button className="btn btn-primary h-14 px-10 rounded-2xl text-white font-black shadow-xl shadow-primary/20 normal-case text-lg border-none">
              Explore All Features
            </button>
          </motion.div>

          {/* Right Side: Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] bg-[#f0f9ff]/50 border border-blue-50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h4>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;