import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  UserCircle,
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Image,
  Phone,
  ShieldCheck,
  Stars,
  Zap,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const { createUser, updateUserProfile, setUser } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [role, setRole] = useState("student"); // ডিফল্ট সিলেক্টেড রোল
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating your account... Please wait.");

    try {
      if (!data.photo || data.photo.length === 0) {
        throw new Error("Please select a profile photo!");
      }

      const imageFile = data.photo[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imageBBKey = import.meta.env.VITE_IMG_API;
      const imageApi = `https://api.imgbb.com/1/upload?key=${imageBBKey}`;

      const imageRes = await axios.post(imageApi, formData);

      if (!imageRes.data.success) {
        throw new Error("Image upload failed! Try another image.");
      }

      const uploadedImageUrl = imageRes.data.data.url;

      // 🔐 ফায়ারবেসে ইউজার ক্রিয়েট করা
      const result = await createUser(data.email, data.password);
      const newUser = result.user;

      // 👤 ইউজারের নাম এবং ছবির লিংক দিয়ে প্রোফাইল আপডেট
      await updateUserProfile(data.fullName, uploadedImageUrl);

      // 💾 ডাটাবেজ বা স্টেট আপডেট রোল সহ
      const finalUserData = {
        ...newUser,
        displayName: data.fullName,
        photoURL: uploadedImageUrl,
        role: role,
      };

      // এখানে আপনার MongoDB ব্যাকএন্ডে ইউজার ডাটা পাঠাতে পারেন:
      // await axios.post('http://localhost:5000/api/users', { name: data.fullName, email: data.email, role, phone: data.phone, image: uploadedImageUrl });

      setUser(finalUserData);

      toast.update(toastId, {
        render: `Welcome to eTuitionBD, ${data.fullName}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      navigate("/dashboard"); // সরাসরি ড্যাশবোর্ডে পাঠানোই বেস্ট প্র্যাকটিস
    } catch (err) {
      console.error("Registration Error:", err);
      toast.update(toastId, {
        render: err.message || "Registration failed! Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100"
      >
        {/* 🎨 Optimized Left Side Banner (Rich UX) */}
        {/* 🎨 Optimized Left Side Banner (Dark Luxury & Eye-Friendly) */}
        <div className="bg-slate-950 p-12 text-slate-400 flex flex-col justify-between relative overflow-hidden">
          {/* Soft Background Glowing Elements - চড়া আলোর বদলে হালকা গ্লো */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#40bfff]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-52 h-52 bg-[#40bfff]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-900/40 rounded-full blur-2xl"></div>

          <div className="relative z-10 space-y-12 my-auto">
            <div>
              <span className="bg-slate-900 text-[#40bfff] border border-slate-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
                eTuitionBD
              </span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                Start Your <br /> Journey With{" "}
                <span className="text-[#40bfff]">Us</span>
              </h2>
            </div>

            {/* 🎯 ইনফো কার্ডগুলোকে ডার্ক মোডে গ্লাস-মর্ফিজম স্টাইল দেওয়া হয়েছে */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-200">
                    100% Verified Tutors
                  </h4>
                  <p className="text-slate-500 text-xs font-bold">
                    Background checked & certified experts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-200">
                    Instant Matching
                  </h4>
                  <p className="text-slate-500 text-xs font-bold">
                    Get immediate requests from preferred regions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <Stars size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-200">
                    Premium Dashboard
                  </h4>
                  <p className="text-slate-500 text-xs font-bold">
                    Track payments, classes and student details seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs font-bold text-slate-600 uppercase tracking-widest mt-6">
            © 2026 eTuitionBD. All rights reserved.
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 sm:p-12">
          <h3 className="text-3xl font-black text-slate-800 mb-8">
            Create Account
          </h3>

          {/* Role Selection */}
          <div className="flex gap-4 mb-8">
            {["student", "tutor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === r ? "border-[#40bfff] bg-blue-50 text-[#40bfff]" : "border-slate-100 text-slate-400"}`}
              >
                {r === "student" ? (
                  <UserCircle size={24} />
                ) : (
                  <GraduationCap size={24} />
                )}
                <span className="font-black uppercase text-[10px] tracking-widest">
                  {r}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  {...register("fullName", { required: "Name is required" })}
                  type="text"
                  placeholder="Full Name"
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.fullName ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  type="text"
                  placeholder="Phone Number"
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.phone ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                />
              </div>
              {/* ফিক্সড: errors.fullName পরিবর্তন করে errors.phone করা হয়েছে */}
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                  ⚠️ {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  type="password"
                  placeholder="Password"
                  className={`w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all ${errors.password ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"}`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Photo */}
            <div>
              <div className="relative">
                <Image
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  {...register("photo", {
                    required: "Profile photo is required",
                  })}
                  type="file"
                  accept="image/*"
                  className="file-input w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 outline-none transition-all"
                />
              </div>
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                  ⚠️ {errors.photo.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group mt-6"
            >
              Register as {role}{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <p className="text-center mt-8 font-bold text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#40bfff] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
