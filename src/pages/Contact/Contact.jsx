import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Contact Form Data:", data);
    toast.success("Message sent successfully! eTuitionBD team will contact you soon.");
    reset(); 
  };

  const infoItems = [
    { id: 1, icon: <Mail size={24} />, label: "Email Us", val: "support@etuitionbd.com", bg: "bg-blue-50", text: "text-[#40bfff]" },
    { id: 2, icon: <Phone size={24} />, label: "Call Us", val: "+880 1700-000000", bg: "bg-emerald-50", text: "text-emerald-500" },
    { id: 3, icon: <MapPin size={24} />, label: "Location", val: "Bogra, Bangladesh", bg: "bg-rose-50", text: "text-rose-500" },
    { id: 4, icon: <Mail size={24} />, label: "Alternative Email", val: "info@etuitionbd.com", bg: "bg-blue-50", text: "text-[#40bfff]" },
    { id: 5, icon: <Phone size={24} />, label: "Urgent Support", val: "+880 1700-111111", bg: "bg-emerald-50", text: "text-emerald-500" },
  ];

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ✉️ Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            Get In <span className="text-[#40bfff]">Touch</span>
          </motion.h1>
          <p className="text-slate-500 font-bold text-lg">
            Have questions about finding a tutor or posting a tuition on <span className="text-[#40bfff]">eTuitionBD</span>? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* 📜 Left Column: Premium Scrollable Info Container */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:h-[500px] overflow-y-auto rounded-[3rem] border border-slate-100 bg-white shadow-sm p-6 space-y-4 custom-scrollbar lg:block hidden"
          >
            <h4 className="text-lg font-black text-slate-800 mb-4 px-2 uppercase tracking-tight">Contact Info</h4>
            {infoItems.map((item) => (
              <div key={item.id} className="p-6 rounded-[2rem] border border-slate-50 bg-[#f8fafc]/50 flex items-center gap-5 transition-all hover:bg-white hover:shadow-md hover:border-[#40bfff]/20 group">
                <div className={`w-14 h-14 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.label}</p>
                  <p className="text-md font-black text-slate-700 break-all">{item.val}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mobile View */}
          <div className="grid sm:grid-cols-3 gap-4 lg:hidden">
            {infoItems.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 ${item.bg} ${item.text} rounded-xl flex items-center justify-center shrink-0`}>{item.icon}</div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 📝 Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-slate-100"
          >
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
              <MessageSquare size={24} className="text-[#40bfff]" /> Send a Message
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <input 
                    {...register("name", { required: "Name is strictly required" })}
                    type="text" 
                    placeholder="Your Name" 
                    className={`w-full px-5 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.name ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-2 ml-2 font-black uppercase tracking-wide">⚠️ {errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <input 
                    {...register("email", { 
                      required: "Email is strictly required", 
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
                    })}
                    type="email" 
                    placeholder="Email Address" 
                    className={`w-full px-5 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-2 ml-2 font-black uppercase tracking-wide">⚠️ {errors.email.message}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <input 
                  {...register("subject", { required: "Subject is strictly required" })}
                  type="text" 
                  placeholder="Subject" 
                  className={`w-full px-5 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.subject ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
                />
                {errors.subject && <p className="text-red-500 text-xs mt-2 ml-2 font-black uppercase tracking-wide">⚠️ {errors.subject.message}</p>}
              </div>

              {/* Message */}
              <div>
                <textarea 
                  {...register("message", { required: "Message field cannot be empty" })}
                  rows="5" 
                  placeholder="Your Message..." 
                  className={`w-full p-5 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all resize-none ${errors.message ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-2 ml-2 font-black uppercase tracking-wide">⚠️ {errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#40bfff] text-white h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group"
              >
                Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* 🎨 Custom Scrollbar Track */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #40bfff;
        }
      `}</style>
    </div>
  );
};

export default Contact;