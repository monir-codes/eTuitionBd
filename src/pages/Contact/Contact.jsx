import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosSecure = useAxios();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axiosSecure.post("/api/contact", data);
      
      if (response.data.success) {
        toast.success("Message stored in database! eTuitionBD team will connect soon. 🚀");
        reset(); 
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(error.response?.data?.message || "Failed to establish database pipeline. ⚠️");
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoItems = [
    { id: 1, icon: <Mail size={22} />, label: "Email Us", val: "support@etuitionbd.com", bg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100/50", text: "text-white" },
    { id: 2, icon: <Phone size={22} />, label: "Call Us", val: "+880 1700-000000", bg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-100/50", text: "text-white" },
    { id: 3, icon: <MapPin size={22} />, label: "Location", val: "Bogra, Bangladesh", bg: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-100/50", text: "text-white" },
    { id: 4, icon: <Mail size={22} />, label: "Alternative Email", val: "info@etuitionbd.com", bg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100/50", text: "text-white" },
    { id: 5, icon: <Phone size={22} />, label: "Urgent Support", val: "+880 1700-111111", bg: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-100/50", text: "text-white" },
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#40bfff]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* ✉️ Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-[#40bfff] border border-blue-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} /> Contact Desk
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight"
          >
            Get In <span className="text-[#40bfff]">Touch</span>
          </motion.h1>
          <p className="text-slate-400 font-bold text-sm sm:text-base uppercase tracking-wider">
            Have questions about finding a tutor or posting a tuition? We are live 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start relative z-10">
          
          {/* 📜 Left Column: Premium SaaS-style Grid/Scroll Container */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:max-h-[570px] overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white shadow-sm p-5 space-y-3.5 custom-scrollbar lg:block hidden"
          >
            <h4 className="text-xs font-black text-slate-400 px-2 uppercase tracking-widest mb-2">Corporate Channels</h4>
            {infoItems.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-slate-50 bg-slate-50/40 flex items-center gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 hover:border-slate-100 group">
                <div className={`w-12 h-12 ${item.bg} ${item.text} rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-black text-slate-700 truncate">{item.val}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mobile View Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:hidden w-full">
            {infoItems.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm w-full min-w-0">
                <div className={`w-11 h-11 ${item.bg} ${item.text} rounded-xl flex items-center justify-center shrink-0 shadow-md`}>{item.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-black text-slate-700 truncate">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 📝 Right Column: Ultra-Premium Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-6 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100 w-full"
          >
            <div className="mb-8 border-b border-slate-50 pb-5 flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#40bfff]" /> Dispatch Message Core
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                <ShieldCheck size={12} /> SSL Secured Data Pipeline
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
              <div className="grid md:grid-cols-2 gap-5 w-full">
                {/* Name */}
                <div className="w-full">
                  <input 
                    {...register("name", { required: "Name is strictly required" })}
                    type="text" 
                    placeholder="Your Full Identity" 
                    className={`w-full px-5 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${errors.name ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1.5 ml-2 font-black uppercase tracking-wider">⚠️ {errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="w-full">
                  <input 
                    {...register("email", { 
                      required: "Email is strictly required", 
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address format" } 
                    })}
                    type="email" 
                    placeholder="Email Address" 
                    className={`w-full px-5 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1.5 ml-2 font-black uppercase tracking-wider">⚠️ {errors.email.message}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="w-full">
                <input 
                  {...register("subject", { required: "Subject context level is required" })}
                  type="text" 
                  placeholder="Subject Matter Topic" 
                  className={`w-full px-5 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${errors.subject ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
                {errors.subject && <p className="text-red-500 text-[10px] mt-1.5 ml-2 font-black uppercase tracking-wider">⚠️ {errors.subject.message}</p>}
              </div>

              {/* Message */}
              <div className="w-full">
                <textarea 
                  {...register("message", { required: "Message payload content field cannot be empty" })}
                  rows="5" 
                  placeholder="Compose your transactional message query here..." 
                  className={`w-full p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all resize-none ${errors.message ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-[10px] mt-1.5 ml-2 font-black uppercase tracking-wider">⚠️ {errors.message.message}</p>}
              </div>

              {/* Submit Button with Loading Trigger */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#40bfff] text-white h-12 sm:h-14 px-10 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-500/10 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Processing Node...
                  </>
                ) : (
                  <>
                    Commit Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* 🎨 Custom Scrollbar Design */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #40bfff;
        }
      `}</style>
    </div>
  );
};

export default Contact;