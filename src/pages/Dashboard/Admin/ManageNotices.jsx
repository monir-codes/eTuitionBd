import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Megaphone, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

const ManageNotices = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);

  // 🔄 সাবমিশন মিউটেশন ইঞ্জিন ভাই
  const noticeMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/api/admin/notices", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notice published successfully to public noticeboard! 🚀");
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to sync notice with server.");
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // কারেন্ট ডেট ফরম্যাট জেনারেটর ভাই
    data.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    await noticeMutation.mutateAsync(data);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="w-full max-w-3xl mx-auto space-y-6 select-none">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-0.5">Broadcast New Notice</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Create academic bulletin or system maintenance alerts</p>
      </div>

      {/* Premium Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Notice Headline</label>
            <input 
              {...register("title", { required: "Notice title is strictly required" })}
              type="text" 
              placeholder="e.g., SSC 2027 Examination Syllabus Sync Update" 
              className={`w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ${errors.title ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
            />
            {errors.title && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">⚠️ {errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Authorization Category</label>
              <select 
                {...register("category", { required: true })}
                className="w-full h-12 px-3 bg-slate-50 border-none rounded-xl font-black text-xs text-slate-600 outline-none focus:ring-2 focus:ring-[#40bfff]/20 cursor-pointer"
              >
                <option value="Academic">Academic Matrix</option>
                <option value="System">System Protocol</option>
                <option value="Maintenance">Maintenance Warning</option>
              </select>
            </div>

            {/* Tag */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Index Scope Tag</label>
              <input 
                {...register("tag", { required: "Scope tag is required" })}
                type="text" 
                placeholder="e.g., Class 9, Payments, Optimization" 
                className={`w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ${errors.tag ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
              />
              {errors.tag && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">⚠️ {errors.tag.message}</p>}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Brief Summary Bulletin</label>
            <input 
              {...register("summary", { required: "Brief summary is required" })}
              type="text" 
              placeholder="Short one-liner context for the card view display..." 
              className={`w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ${errors.summary ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
            />
            {errors.summary && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">⚠️ {errors.summary.message}</p>}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Core Memorandum Payload</label>
            <textarea 
              {...register("content", { required: "Core text body cannot be left blank" })}
              rows="5" 
              placeholder="Write the full comprehensive details and directives here..." 
              className={`w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 resize-none ${errors.content ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
            ></textarea>
            {errors.content && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">⚠️ {errors.content.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#40bfff] text-white h-12 px-8 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={15} /> Publish Live Notice</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ManageNotices;