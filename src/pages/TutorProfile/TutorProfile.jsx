import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Star, 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  MessageSquare,
  BadgeCheck,
  Video
} from "lucide-react";

const TutorProfile = () => {
  const { id } = useParams();

  // Mock Data: Backend structure for dynamic fetching
  const tutor = {
    name: "Sabbir Ahmed",
    title: "Math & Physics Specialist",
    image: "https://i.pravatar.cc/300?u=sabbir",
    location: "Bogra Sadar, Rajshahi",
    rating: 4.9,
    reviews: 124,
    verified: true,
    experience: "5+ Years",
    education: "B.Sc in Civil Engineering, BUET",
    about: "I am a passionate educator with over 5 years of experience in teaching SSC and HSC students. My goal is to make complex Physics and Math concepts simple and easy to understand. I focus on conceptual learning rather than memorization.",
    expertise: ["General Math", "Higher Math", "Physics", "Chemistry"],
    availability: "4:00 PM - 9:00 PM",
    achievements: ["Top Rated Tutor 2025", "Certified Science Educator"],
  };

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* 👤 Left Sidebar: Main Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6 lg:sticky lg:top-28"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                  <img src={tutor.image} className="w-full h-full object-cover" alt={tutor.name} />
                </div>
                {tutor.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-[#40bfff] text-white p-1.5 rounded-full shadow-lg border-4 border-white">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-black text-slate-800 mb-1">{tutor.name}</h1>
              <p className="text-[#40bfff] font-bold uppercase tracking-widest text-xs mb-4">{tutor.title}</p>
              
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  <Star size={18} fill="#f1c40f" className="text-[#f1c40f]" />
                  <span className="font-black text-slate-700">{tutor.rating}</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200" />
                <span className="text-sm font-bold text-slate-400">{tutor.reviews} Reviews</span>
              </div>

              <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <MapPin size={18} className="text-[#40bfff]" /> {tutor.location}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Briefcase size={18} className="text-[#40bfff]" /> {tutor.experience} Experience
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Calendar size={18} className="text-[#40bfff]" /> {tutor.availability}
                </div>
              </div>

              <button className="w-full mt-8 py-4 rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={20} /> Contact Tutor
              </button>
            </div>

            <div className="bg-[#40bfff]/5 p-8 rounded-[2.5rem] border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <Video size={20} className="text-[#40bfff]" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter">Demo Session</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">
                Book a 15-minute free demo session to see if the teaching style matches your needs.
              </p>
              <button className="w-full py-3 rounded-xl border-2 border-[#40bfff] text-[#40bfff] font-black hover:bg-[#40bfff] hover:text-white transition-all text-sm">
                Book Free Demo
              </button>
            </div>
          </motion.div>

          {/* 📝 Right Side: About & Detailed Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <BadgeCheck className="text-[#40bfff]" /> About Me
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {tutor.about}
              </p>
            </div>

            {/* Education & Expertise Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <GraduationCap className="text-[#40bfff]" /> Education
                </h3>
                <p className="text-slate-600 font-bold">{tutor.education}</p>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <BookOpen className="text-[#40bfff]" /> Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.expertise.map((item, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement / Stats Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Achievements</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {tutor.achievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Star size={18} className="text-[#40bfff]" />
                    </div>
                    <span className="font-bold text-slate-700">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default TutorProfile;