import { motion } from "framer-motion";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LatestTutors = () => {
  const tutors = [
    {
      id: 1,
      name: "Sabbir Ahmed",
      subject: "Math & Physics Expert",
      rating: 4.9,
      image: "https://i.pravatar.cc/150?u=sabbir",
      experience: "5 Years Exp.",
      verified: true
    },
    {
      id: 2,
      name: "Tahmina Akter",
      subject: "English Literature",
      rating: 4.8,
      image: "https://i.pravatar.cc/150?u=tahmina",
      experience: "3 Years Exp.",
      verified: true
    },
    {
      id: 3,
      name: "Rifat Hasan",
      subject: "Chemistry Specialist",
      rating: 5.0,
      image: "https://i.pravatar.cc/150?u=rifat",
      experience: "4 Years Exp.",
      verified: true
    }
  ];

  return (
    <section style={{ fontFamily: "'League Spartan', sans-serif" }} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              Our Top <span className="text-[#40bfff]">Tutors</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg">Learn from the most highly rated educators in the platform.</p>
          </div>
          <Link to="/tutors" className="hidden md:flex items-center gap-2 font-black text-[#40bfff] hover:underline">
            Browse All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor, idx) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-6 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <img src={tutor.image} className="rounded-3xl object-cover shadow-lg" alt={tutor.name} />
                {tutor.verified && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle size={20} className="text-[#40bfff]" fill="white" />
                  </div>
                )}
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-1">{tutor.name}</h4>
              <p className="text-[#40bfff] font-bold text-sm mb-4 uppercase tracking-wider">{tutor.subject}</p>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                  <Star size={14} fill="#f1c40f" className="text-[#f1c40f]" />
                  <span className="text-sm font-black text-slate-700">{tutor.rating}</span>
                </div>
                <span className="text-sm font-bold text-slate-400">{tutor.experience}</span>
              </div>

              <Link to={`/tutor/${tutor.id}`}>
                <button className="w-full py-4 rounded-2xl bg-white border-2 border-slate-100 font-black text-slate-700 hover:border-[#40bfff] hover:text-[#40bfff] transition-all">
                  View Profile
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTutors;