import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, Video, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // 🚀 নেভিগেশনের জন্য ইম্পোর্ট
import useAxios from "../../hooks/useAxios";

const Hero = () => {
  const navigate = useNavigate(); // 🚀 রাউটার হ্যান্ডলার
  const axiosSecure = useAxios();

  // 🎯 ড্রপডাউন ও ইনপুট ফিল্ডের রিয়েল স্টেট বাইন্ডিং
  const [selectedMedium, setSelectedMedium] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [keyword, setKeyword] = useState("");

  // 📸 অটো-স্লাইডারের জন্য ইমেজের অ্যারে
  const tutorImages = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // 🔥 TanStack React Query v5 Integration (১০০% রিয়েল ডাটা ক্যাশিং)
  const { data: stats = { totalStudents: 0, totalTutors: 0 } } = useQuery({
    queryKey: ["publicPlatformStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/public-stats");
      return {
        totalStudents: res.data?.totalStudents || 0,
        totalTutors: res.data?.totalTutors || 0,
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % tutorImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [tutorImages.length]);

  // 🚀 সার্চ ফর্ম সাবমিট হ্যান্ডলার (ডাটা নিয়ে সরাসরি /tuitions পেজে হিট করবে)
  const handleHeroSearch = (e) => {
    e.preventDefault();
    
    // 🛠️ URLSearchParams দিয়ে ডাইনামিক কুয়েরি স্ট্রিং তৈরি
    const queryParams = new URLSearchParams();
    
    if (selectedMedium) queryParams.append("category", selectedMedium);
    if (selectedClass) queryParams.append("classLevel", selectedClass);
    if (selectedSubject) queryParams.append("subject", selectedSubject);
    if (keyword.trim()) queryParams.append("search", keyword.trim());

    // 🔄 ডাটা প্যারামিটার সহ ইউজারকে সরাসরি Tuitions পেজে রিডাইরেক্ট করা হচ্ছে ভাই
    navigate(`/tuitions?${queryParams.toString()}`);
  };

  // পপুলার ট্যাগগুলোতে ক্লিক করলে সরাসরি ওই সাবজেক্ট সার্চ হবে
  const handleTagClick = (tag) => {
    navigate(`/tuitions?subject=${tag}`);
  };

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="relative h-auto lg:h-[70vh] min-h-[600px] pt-28 pb-12 bg-[#f0f9ff]/50 overflow-hidden flex items-center"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-blue-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-40 h-40 bg-blue-500/5 rounded-full translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Content: Text & Search UI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left z-10"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-800 leading-[1.1] mb-4">
            Learn From <span className="text-[#3fc0ff] italic">Expert Tutors</span> <br className="hidden sm:block" />
            Face-To-Face Or Online
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto lg:mx-0 mb-6 font-medium leading-relaxed">
            eTuitionBd is a complete platform for managing tuition activities including tuition posting, tutor applications, and payments.
          </p>

          {/* 🔍 ১০০% ফাংশনাল রিয়েল সার্চ বক্স ফর্ম */}
          <form onSubmit={handleHeroSearch} className="bg-[#e0f2fe]/60 p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-sm max-w-2xl mx-auto lg:mx-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <select 
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="select select-bordered w-full bg-white text-slate-500 font-bold h-11 min-h-[44px] rounded-xl focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm"
              >
                <option value="">Select Medium</option>
                <option value="English Medium">English Medium</option>
                <option value="Bangla Medium">Bangla Medium</option>
                <option value="English Version">English Version</option>
              </select>

              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select select-bordered w-full bg-white text-slate-500 font-bold h-11 min-h-[44px] rounded-xl text-xs sm:text-sm"
              >
                <option value="">Select Class</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10 (SSC 2027)</option>
                <option value="HSC Level">HSC Level</option>
              </select>

              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="select select-bordered w-full bg-white text-slate-500 font-bold h-11 min-h-[44px] rounded-xl text-xs sm:text-sm"
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter Location / Keyword" 
                className="input input-bordered flex-grow h-11 bg-white rounded-xl font-medium text-sm" 
              />
              <button type="submit" className="btn bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-8 h-11 min-h-[44px] rounded-xl text-base shadow-lg shadow-blue-200 transition-all active:scale-95">
                Search
              </button>
            </div>
          </form>

          {/* Popular Searches Tags */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center lg:justify-start items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full lg:w-auto mb-1 lg:mb-0">Popular:</span>
            {["Mathematics", "Physics", "English", "Chemistry"].map((tag) => (
              <button 
                key={tag} 
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white border border-slate-100 text-slate-500 font-bold text-[11px] hover:bg-primary/10 hover:text-primary transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Content: ইমেজ স্লাইডার পার্ট */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:flex justify-center lg:justify-end"
        >
          <div className="relative z-10 w-full max-w-[340px] lg:max-w-[380px] h-[400px] lg:h-[480px]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImage}
                src={tutorImages[currentImage]} 
                alt="Expert Tutor" 
                className="rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] absolute inset-0 w-full h-full"
              />
            </AnimatePresence>
            
            {/* 📊 Students Counter */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 lg:-left-10 top-1/4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-2.5 z-20"
            >
              <div className="bg-emerald-500 text-white p-2 rounded-xl"><Users size={16}/></div>
              <div className="pr-1">
                <p className="font-black text-slate-800 text-base leading-none">{stats.totalStudents}+</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-tight mt-0.5">Students Active</p>
              </div>
            </motion.div>

            {/* 📊 Tutors Counter */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 bottom-1/4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-50 text-center z-20"
            >
              <div className="flex -space-x-2.5 mb-1.5 justify-center">
                {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="avatar" />)}
              </div>
              <p className="font-black text-slate-800 text-base leading-none">{stats.totalTutors}+</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-tight mt-0.5">Verified Tutors</p>
            </motion.div>

            {/* Live Badge */}
            <div className="absolute -top-3 right-8 bg-[#ff6b6b] text-white px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce z-20">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Video size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Live Connect</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;