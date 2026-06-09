import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Languages, Award, Lightbulb } from 'lucide-react';

const CategoriesGrid = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Bangla Medium",
      desc: "Find expert tutors for National Curriculum class 1 to HSC.",
      icon: <Languages size={24} className="text-[#40bfff]" />,
      bg: "bg-blue-50/50",
      queryParam: "Bangla Medium"
    },
    {
      title: "English Medium",
      desc: "Top tutors for Edexcel, Cambridge O-Level, and A-Level sheets.",
      icon: <BookOpen size={24} className="text-emerald-500" />,
      bg: "bg-emerald-50/50",
      queryParam: "English Medium"
    },
    {
      title: "English Version",
      desc: "Tutors proficient in National Curriculum translated to English.",
      icon: <Award size={24} className="text-amber-500" />,
      bg: "bg-amber-50/50",
      queryParam: "English Version"
    },
    {
      title: "Madrasah Medium",
      desc: "Verified tutors specialized in Arabic, Quranic studies, and General subjects.",
      icon: <Lightbulb size={24} className="text-indigo-500" />,
      bg: "bg-indigo-50/50",
      queryParam: "Madrasah Medium"
    }
  ];

  const handleCategoryClick = (param) => {
    // 🚀 রিয়েল একশন: ক্লিক করলে সরাসরি এক্সপ্লোর পেজে ওই মিডিয়াম ফিল্টার হয়ে যাবে
    navigate(`/tuitions?category=${encodeURIComponent(param)}`);
  };

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="py-16 bg-[#f8fafc] select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Browse Tuitions by <span className="text-[#40bfff]">Mediums</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-bold mt-1">
            One-click access to find specific tuition circulars instantly.
          </p>
        </div>

        {/* Grid Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => handleCategoryClick(cat.queryParam)}
              className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#40bfff]/30 shadow-sm hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group active:scale-95"
            >
              <div>
                <div className={`w-12 h-12 ${cat.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-slate-800 text-lg group-hover:text-[#40bfff] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              
              <div className="text-[11px] font-black uppercase text-slate-400 group-hover:text-[#40bfff] tracking-widest mt-6 flex items-center gap-1.5 transition-colors">
                Explore All &rarr;
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesGrid;