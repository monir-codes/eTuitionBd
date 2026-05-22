import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { FilePlus, BookOpen, MapPin, CircleDollarSign, Calendar, Info, Send } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
// import axios from "axios"; // ব্যাকএন্ড কানেকশনের জন্য

const PostTuition = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Publishing your tuition post...");

    try {
      // ব্যাকএন্ডে পাঠানোর জন্য ডাটা অবজেক্ট
      const tuitionPost = {
        ...data,
        studentEmail: user?.email,
        studentName: user?.displayName,
        postedDate: new Date().toLocaleDateString(),
        status: "open" // ডিফল্ট স্ট্যাটাস
      };

      console.log("Sending to Backend:", tuitionPost);
      // await axios.post("http://localhost:5000/api/tuitions", tuitionPost);

      toast.update(toastId, { 
        render: "Tuition posted successfully! Tutors can now apply.", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      reset(); // ফর্ম ক্লিয়ার করা
    } catch (err) {
      toast.update(toastId, { 
        render: "Failed to post tuition. Try again.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Post a New Tuition</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Find the perfect tutor for your academic needs</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 sm:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
        
        {/* Title Section */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Post Title</label>
          <div className="relative">
            <FilePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              {...register("title", { required: "A descriptive title is required" })}
              placeholder="e.g. Need a Physics Tutor for HSC"
              className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.title ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`} 
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-2 ml-2 font-black">⚠️ {errors.title.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subject */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Subject(s)</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input {...register("subject", { required: "Subject is required" })} placeholder="e.g. Math, Higher Math" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Location / Area</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input {...register("location", { required: "Location is required" })} placeholder="e.g. Bogra Sadar" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Salary */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Monthly Salary</label>
            <div className="relative">
              <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input {...register("salary", { required: "Salary is required" })} placeholder="e.g. 6000 BDT" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
          </div>

          {/* Days per week */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Days Per Week</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select {...register("days")} className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all appearance-none">
                <option value="3 Days/Week">3 Days/Week</option>
                <option value="4 Days/Week">4 Days/Week</option>
                <option value="5 Days/Week">5 Days/Week</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Class/Medium */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Class / Medium</label>
            <div className="relative">
              <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input {...register("class", { required: "Class info is required" })} placeholder="e.g. Class 10 (Bangla)" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Specific Requirements</label>
          <textarea 
            {...register("requirements")}
            rows="4" 
            placeholder="e.g. Need a female tutor from Bogra Govt College..." 
            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#40bfff] text-white h-16 px-12 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-3 group">
          {loading ? "Publishing..." : "Post Tuition"} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
};

export default PostTuition;