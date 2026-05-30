import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  MapPin,
  CircleDollarSign,
  Calendar,
  Users,
  GraduationCap,
  Save,
  Loader2,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const PostTuition = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      requirements: [{ value: "" }],
    },
  });

  // 🛠️ Requirements ডাইনামিক অ্যারে সেটআপ
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const onSubmitTuition = async (data) => {
    if (!user?.email) return toast.error("User email missing!");
    setLoading(true);

    const requirementsArray = data.requirements
      .map((req) => req.value.trim())
      .filter((val) => val !== "");

    // 📦 ব্যাকএন্ড পেলোড অবজেক্ট
    const postPayload = {
      title: data.title,
      studentUID: user?.uid,
      classLevel: data.classLevel,
      subject: data.subjects,
      location: data.location,
      salary: `${data.salary} BDT`,
      days: `${data.daysPerWeek} Days/Week`,
      category: data.category,
      studentGender: data.studentGender,
      preferredTutor: data.preferredTutor,
      description: data.description,
      requirements: requirementsArray.length > 0 ? requirementsArray : ["Not specified"],
      studentEmail: user?.email,
      studentName: user?.displayName,
      postedAt: new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka", 
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/api/tuitions", postPayload);

      if (res.data) {
        toast.success("Tuition post published successfully!");
        reset({
          title: "",
          subjects: "",
          location: "",
          salary: "",
          daysPerWeek: "",
          description: "",
          requirements: [{ value: "" }],
        });
        navigate("/dashboard/student/my-posts");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to publish tuition post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Header */}
      <div className="border-b border-slate-100/60 pb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">
          Create Tuition Post
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
          Fill in the fields below to publish a new tuition requirement
        </p>
      </div>

      {/* 📝 Main Form Container */}
      <div className="w-full max-w-4xl bg-white p-5 sm:p-8 lg:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-[#40bfff] shrink-0" /> 
          <span>Tuition Requirements & Details</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmitTuition)} className="space-y-5sm sm:space-y-6">
          
          {/* ১. Tuition Title */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
              Tuition Title / Headline
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                placeholder="e.g. Need a Tutor for Class 10 Student (SSC 2027)"
                className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-[11px] mt-1 ml-2 font-black">⚠️ {errors.title.message}</p>
            )}
          </div>

          {/* ২ ও ৩. Class & Subjects Grid (মোবাইলে ১ কলাম, ট্যাবলেটে ২ কলাম) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Class / Student Level
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("classLevel", { required: "Class level is required" })}
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Class</option>
                  <option value="Class 1-5">Class 1-5</option>
                  <option value="Class 6-8">Class 6-8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="SSC Candidate">SSC Candidate</option>
                  <option value="HSC 1st Year">HSC 1st Year</option>
                  <option value="HSC 2nd Year">HSC 2nd Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Subjects to Teach
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("subjects", { required: "Subjects are required" })}
                  type="text"
                  placeholder="e.g. Mathematics & Higher Math"
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ৪, ৫, ৬. Medium, Gender, Tutor Preference Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Medium / Category
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("category", { required: "Medium is required" })}
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Bangla Medium">Bangla Medium</option>
                  <option value="English Medium">English Medium</option>
                  <option value="English Version">English Version</option>
                  <option value="Madrasah Medium">Madrasah Medium</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Student Gender
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("studentGender", { required: "Student gender is required" })}
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Preferred Tutor
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("preferredTutor")}
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* ৭, ৮, ৯. Location, Salary, Schedule (মোবাইলে নিচে নিচে নামবে, ট্যাবলেটে ৩ ভাগে সোজা হবে) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Location Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("location", { required: "Location is required" })}
                  type="text"
                  placeholder="e.g. Sultanganj Para, Bogra"
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Salary Budget (Monthly)
              </label>
              <div className="relative">
                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("salary", { required: "Salary is required" })}
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                Days Per Week
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("daysPerWeek", { required: "Days selection is required" })}
                  type="text"
                  placeholder="e.g. 3 Days/Week"
                  className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ১০. Description */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
              Description / Details
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
              <textarea
                {...register("description", { required: "Description is required" })}
                rows="4"
                placeholder="Looking for an experienced tutor for my younger brother..."
                className="w-full pl-12 pr-4 p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* ১১. ডাইনামিক Requirements List (আল্ট্রা রেসপন্সিভ সেটআপ) */}
          <div className="space-y-3.5">
            <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
              Specific Requirements (Dynamic List)
            </label>

            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 sm:gap-3 w-full">
                  <div className="relative flex-grow min-w-0">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[11px] sm:text-xs">
                      #{index + 1}
                    </span>
                    <input
                      {...register(`requirements.${index}.value`)}
                      type="text"
                      placeholder="e.g. Must have a strong background in Science/Mathematics."
                      className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                    />
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-12 w-12 sm:h-14 sm:w-14 bg-rose-50 text-rose-500 rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shrink-0 shadow-sm active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#40bfff] uppercase tracking-wider bg-blue-50/50 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              <Plus size={14} /> Add More Requirement
            </button>
          </div>

          {/* Submit Button Block */}
          <div className="pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#40bfff] text-white h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/10 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={16} />
              )}
              <span>Publish Tuition Post</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PostTuition;