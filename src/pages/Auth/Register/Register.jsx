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
  Image as ImageIcon,
  Phone,
  ShieldCheck,
  Stars,
  Zap,
  UploadCloud,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile, setUser } = useAuth();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  // ফাইল সিলেক্ট হয়েছে কি না তা মোবাইলে লাইভ ট্র্যাক করার জন্য ওয়াচিং
  const selectedPhotoFile = watch("photo");

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

      // 👤 ইউজারের প্রোফাইল আপডেট
      await updateUserProfile(data.fullName, uploadedImageUrl);

      // 💾 ডাটাবেজের পেলোড
      const backendUserData = { 
        name: data.fullName, 
        email: data.email, 
        role: role, 
        phone: data.phone, 
        image: uploadedImageUrl ,
        createdAt: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
      };

      const serverRes = await axiosSecure.post('/api/users', backendUserData);
      // console.log("Server Response:", serverRes.data);

      const finalUserData = {
        ...newUser,
        displayName: data.fullName,
        photoURL: uploadedImageUrl,
        role: role,
      };
      setUser(finalUserData);

      toast.update(toastId, {
        render: `Welcome to eTuitionBD, ${data.fullName}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      navigate("/dashboard"); 

    } catch (err) {
      console.error("Registration Error Details:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Registration failed! Please try again.";
      
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-20 pb-12 sm:pt-28 sm:pb-20 flex items-center justify-center px-4 sm:px-6 select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl shadow-blue-100/60 overflow-hidden border border-slate-100"
      >
        {/* 🎨 Left Side Banner (মোবাইলে সিকিউরড কার্ড হয়ে যাবে, ডেক্সটপে ৫ কলাম পাবে) */}
        <div className="lg:col-span-5 bg-slate-950 p-8 sm:p-12 text-slate-400 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#40bfff]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-52 h-52 bg-[#40bfff]/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-8 lg:space-y-12 my-auto">
            <div>
              <span className="bg-slate-900 text-[#40bfff] border border-slate-800/80 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 inline-block">
                eTuitionBD
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Start Your <br className="hidden lg:block" /> Journey With{" "}
                <span className="text-[#40bfff]">Us</span>
              </h2>
            </div>

            {/* ফিচার লিস্ট: মোবাইল স্ক্রিনে ছোট দেখাবে */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-200">
                    100% Verified Tutors
                  </h4>
                  <p className="text-slate-500 text-[11px] sm:text-xs font-bold truncate sm:whitespace-normal">
                    Background checked & certified experts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <Zap size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-200">
                    Instant Matching
                  </h4>
                  <p className="text-slate-500 text-[11px] sm:text-xs font-bold">
                    Get immediate requests from preferred regions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#40bfff]/10 text-[#40bfff] flex items-center justify-center shrink-0 shadow-md">
                  <Stars size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-200">
                    Premium Dashboard
                  </h4>
                  <p className="text-slate-500 text-[11px] sm:text-xs font-bold">
                    Track payments, classes and student details seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest mt-8 lg:mt-6">
            © 2026 eTuitionBD. All rights reserved.
          </div>
        </div>

        {/* Form Side (ডেক্সটপে ৭ কলাম পাবে যাতে ইনপুট এরিয়া বড় থাকে) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 w-full">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 sm:mb-8">
            Create Account
          </h3>

          {/* Role Selection Tabs */}
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            {["student", "tutor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-3.5 sm:py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 active:scale-95 ${
                  role === r 
                    ? "border-[#40bfff] bg-blue-50/50 text-[#40bfff]" 
                    : "border-slate-100 text-slate-400 hover:border-slate-200"
                }`}
              >
                {r === "student" ? <UserCircle size={22} /> : <GraduationCap size={22} />}
                <span className="font-black uppercase text-[9px] sm:text-[10px] tracking-widest">
                  {r}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("fullName", { required: "Name is required" })}
                  type="text"
                  placeholder="Full Name"
                  className={`w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${
                    errors.fullName ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-[11px] mt-1 ml-2 font-bold">⚠️ {errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  type="text"
                  placeholder="Phone Number"
                  className={`w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${
                    errors.phone ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-[11px] mt-1 ml-2 font-bold">⚠️ {errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  })}
                  type="email"
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${
                    errors.email ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1 ml-2 font-bold">⚠️ {errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  type="password"
                  placeholder="Password"
                  className={`w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 placeholder-slate-400 focus:ring-2 outline-none transition-all ${
                    errors.password ? "ring-2 ring-red-200" : "focus:ring-[#40bfff]/20"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 ml-2 font-bold">⚠️ {errors.password.message}</p>
              )}
            </div>

            {/* 📸 আল্ট্রা-ক্লিন কাস্টম রিঅ্যাক্ট ফাইল ইনপুট লেআউট (রেসপন্সিভ মাস্টারপিস) */}
            <div>
              <label className="relative flex items-center justify-center w-full h-14 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#40bfff]/50 rounded-xl sm:rounded-2xl cursor-pointer transition-all overflow-hidden group/file">
                <input
                  {...register("photo", { required: "Profile photo is required" })}
                  type="file"
                  accept="image/*"
                  className="hidden" // মেকানিজম হাইড করা হলো কাস্টম ডিজাইনের জন্য
                />
                <div className="flex items-center gap-3 px-4 font-bold text-xs sm:text-sm text-slate-500 group-hover/file:text-[#40bfff] transition-colors max-w-full">
                  {selectedPhotoFile && selectedPhotoFile[0] ? (
                    <>
                      <ImageIcon size={18} className="text-emerald-500 shrink-0" />
                      <span className="text-emerald-600 truncate max-w-[180px] sm:max-w-[300px]">
                        {selectedPhotoFile[0].name}
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={18} className="text-slate-400 group-hover/file:text-[#40bfff]" />
                      <span className="truncate">Upload Profile Image</span>
                    </>
                  )}
                </div>
              </label>
              {errors.photo && (
                <p className="text-red-500 text-[11px] mt-1 ml-2 font-bold">⚠️ {errors.photo.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#40bfff] text-white h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 group mt-6 active:scale-[0.98]"
            >
              Register as {role}{" "}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-6 sm:mt-8 font-bold text-xs sm:text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#40bfff] hover:underline font-black">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;