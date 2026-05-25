import { useForm, useFieldArray } from "react-hook-form"; // ✅ useFieldArray যোগ করা হয়েছে requirements এর জন্য
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
  Trash2
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
    control, // useFieldArray এর জন্য লাগবে
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      // requirements এ ডিফল্ট একটা ফিল্ড ওপেন থাকবে
      requirements: [{ value: "" }]
    }
  });

  // 🛠️ requirements ফিল্ডকে ডাইনামিক অ্যারে বানানোর সেটআপ
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements"
  });

  // 🎯 সাবমিট হ্যান্ডলার (আপনার মঙ্গোডিবি অবজেক্ট ফরম্যাট অনুযায়ী ১০০% ম্যাচড)
  const onSubmitTuition = async (data) => {
    if (!user?.email) return toast.error("User email missing!");
    setLoading(true);

    // ডাইনামিক ইনপুট থেকে শুধু স্ট্রিং টেক্সটগুলো বের করে অ্যারে বানানো
    const requirementsArray = data.requirements
      .map(req => req.value.trim())
      .filter(val => val !== "");

    // 📦 আপনার রিকোয়ারমেন্ট অনুযায়ী নিখুঁত পেলোড অবজেক্ট
    const postPayload = {
      title: data.title,
      subject: data.subjects,
      location: data.location,
      salary: `${data.salary} BDT`,
      days: data.daysPerWeek,
      category: data.category,
      studentGender: data.studentGender,
      preferredTutor: data.preferredTutor,
      description: data.description,
      requirements: requirementsArray.length > 0 ? requirementsArray : ["Not specified"],
      studentEmail: user?.email,
      studentName: user?.displayName || "Mst. Rokeya Begum",
      postedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // e.g. "May 25, 2026"
      status: "open"
    };

    try {
      const res = await axiosSecure.post("/api/tuitions", postPayload);
      
      if (res.data) {
        toast.success("Tuition post published successfully!");
        reset({
          title: "", subjects: "", location: "", salary: "", 
          daysPerWeek: "", description: "", requirements: [{ value: "" }]
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Create Tuition Post</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Fill in the fields below to publish a new tuition requirement
        </p>
      </div>

      {/* 📝 Main Form */}
      <div className="max-w-4xl bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-[#40bfff]" /> Tuition Requirements & Details
        </h3>

        <form onSubmit={handleSubmit(onSubmitTuition)} className="space-y-6">
          
          {/* ১. Tuition Title */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
              Tuition Title / Headline
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                placeholder="e.g. Need a Tutor for Class 10 Student (SSC 2027)"
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
              />
            </div>
            {errors.title && <p className="text-red-500 text-xs mt-2 ml-2 font-black">⚠️ {errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* ২. Class / Level */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Class / Student Level
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("classLevel", { required: "Class level is required" })}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700 appearance-none"
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

            {/* ৩. Subjects */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Subjects to Teach
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("subjects", { required: "Subjects are required" })}
                  type="text"
                  placeholder="e.g. Mathematics & Higher Math"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* ৪. Medium / Category */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Medium / Category
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("category", { required: "Medium is required" })}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700 appearance-none"
                >
                  <option value="Bangla Medium">Bangla Medium</option>
                  <option value="English Medium">English Medium</option>
                  <option value="English Version">English Version</option>
                  <option value="Madrasah Medium">Madrasah Medium</option>
                </select>
              </div>
            </div>

            {/* ৫. Student Gender */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Student Gender
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("studentGender", { required: "Student gender is required" })}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700 appearance-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* ৬. Preferred Tutor */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Preferred Tutor
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  {...register("preferredTutor")}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700 appearance-none"
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* ৭. Location */}
            <div className="sm:col-span-1">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Location / Area Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("location", { required: "Location is required" })}
                  type="text"
                  placeholder="e.g. Sultanganj Para, Bogra"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {/* ৮. Salary */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Salary Budget (Monthly)
              </label>
              <div className="relative">
                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("salary", { required: "Salary is required" })}
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {/* ৯. Days Per Week */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Days Per Week
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("daysPerWeek", { required: "Days selection is required" })}
                  type="text"
                  placeholder="e.g. 3 Days/Week"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* ১০. Description */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
              Description / Details
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-5 text-slate-300" size={18} />
              <textarea
                {...register("description", { required: "Description is required" })}
                rows="4"
                placeholder="Looking for an experienced tutor for my younger brother..."
                className="w-full pl-12 pr-4 p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700 resize-none"
              />
            </div>
          </div>

          {/* ১১. ডাইনামিক Requirements (অ্যারে ইনপুট) */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
              Specific Requirements (Dynamic List)
            </label>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">
                    #{index + 1}
                  </span>
                  <input
                    {...register(`requirements.${index}.value`)}
                    type="text"
                    placeholder="e.g. Must have a strong background in Science/Mathematics."
                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-slate-700"
                  />
                </div>
                
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-2 text-xs font-black text-[#40bfff] uppercase tracking-wider bg-blue-50/50 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all"
            >
              <Plus size={14} /> Add More Requirement
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#40bfff] text-white h-14 px-8 rounded-2xl font-black text-md shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Publish Tuition Post
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PostTuition;