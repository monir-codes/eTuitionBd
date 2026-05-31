import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Shield, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ProfileSettings = () => {
  const { user, updateUserProfile, setUser } = useAuth();
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // 📝 ফর্ম ১: পার্সোনাল ইনফরমেশন এবং ইমেজ চেঞ্জ করার জন্য
  const { register: registerProfile, handleSubmit: handleProfileSubmit, watch: watchProfile, formState: { errors: profileErrors } } = useForm();
  
  // 📝 ফর্ম ২: সিকিউর পাসওয়ার্ড আপডেটের জন্য আলাদা ইনস্ট্যান্স
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm();

  // মোবাইলে ফাইল সিলেক্টের নাম লাইভ দেখানোর জন্য ওয়াচিং
  const selectedPhotoFile = watchProfile("photo");
  const role = user?.role || "student";

  // 🔄 TanStack Mutation: ব্যাকএন্ড ডাটাবেজে ইউজার ডক আপডেট করা
  const profileUpdateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/api/user?email=${user?.email}`, updatedData);
      return res.data;
    }
  });

  // 👤 পার্সোনাল ইনফো এবং প্রোফাইল পিকচার সাবমিট হ্যান্ডলার
  const onUpdateProfile = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Updating your profile configurations...");
    
    try {
      let uploadedImageUrl = user?.photoURL || "";

      // কন্ডিশন: ইউজার যদি নতুন কোনো ফাইল সিলেক্ট করে, তবেই ImgBB তে আপলোড হবে
      if (data.photo && data.photo.length > 0) {
        const imageFile = data.photo[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imageBBKey = import.meta.env.VITE_IMG_API;
        const imageApi = `https://api.imgbb.com/1/upload?key=${imageBBKey}`;
        const imageRes = await axios.post(imageApi, formData);

        if (imageRes.data.success) {
          uploadedImageUrl = imageRes.data.data.url;
        }
      }

      const updatedInfo = {
        name: data.fullName,
        phone: data.phone,
        image: uploadedImageUrl
      };

      // ১. মঙ্গোডিবি ব্যাকএন্ড ডাটা প্যাচ
      await profileUpdateMutation.mutateAsync(updatedInfo);

      // ২. ফায়ারবেস প্রোফাইল অথ স্টেট আপডেট
      await updateUserProfile(data.fullName, uploadedImageUrl);

      // ৩. গ্লোবাল ইউজার স্টেট রি-সিঙ্ক করা
      setUser({
        ...user,
        displayName: data.fullName,
        photoURL: uploadedImageUrl,
      });

      toast.update(toastId, { 
        render: "Profile details updated successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Update failed. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // 🔒 পাসওয়ার্ড চেঞ্জ সাবমিট হ্যান্ডলার (ফায়ারবেস অথ লিংক)
  const onChangePassword = async (data) => {
    if (!data.newPassword) return;
    setPassLoading(true);
    const toastId = toast.loading("Updating password credentials...");
    
    try {
      // console.log("Changing Password to:", data.newPassword);
      // এখানে আপনার ফায়ারবেস বা ব্যাকএন্ড পাসওয়ার্ড আপডেট এপিআই কলটি বসাতে পারেন
      
      toast.update(toastId, { 
        render: "Password changed successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      resetPasswordForm();
    } catch (err) {
      toast.update(toastId, { render: "Password update failed.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setPassLoading(false);
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">Account Settings</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Manage your profile details and security configurations</p>
      </div>

      {/* মেইন রেসপন্সিভ গ্রিড: মোবাইলে নিচে নিচে, ডেক্সটপে ৩ কলামে সোজা */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* 👤 Left Block: Personal Information (২ কলাম চওড়া উইডথ) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-8 lg:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
            <User size={20} className="text-[#40bfff]" /> Personal Information
          </h3>
          
          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-5sm sm:space-y-6">
            
            {/* 📸 কাস্টম ইমেজ আপলোডার ফিল্ড */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100/60">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] overflow-hidden shadow-inner border border-slate-200 shrink-0 bg-white">
                <img src={user?.photoURL || "https://i.ibb.co/default-avatar.png"} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="w-full">
                <label className="relative flex items-center justify-center w-full h-12 bg-white border-2 border-dashed border-slate-200 hover:border-[#40bfff]/50 rounded-xl cursor-pointer transition-all overflow-hidden group/file">
                  <input
                    {...registerProfile("photo")}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 font-bold text-xs text-slate-500 group-hover/file:text-[#40bfff] max-w-full">
                    {selectedPhotoFile && selectedPhotoFile[0] ? (
                      <>
                        <ImageIcon size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-emerald-600 truncate max-w-[180px] sm:max-w-[320px]">
                          {selectedPhotoFile[0].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} className="text-slate-400 group-hover/file:text-[#40bfff]" />
                        <span className="truncate">Change Profile Picture</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    {...registerProfile("fullName", { required: "Name is required" })} 
                    defaultValue={user?.displayName || ""} 
                    type="text" 
                    className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                  />
                </div>
                {profileErrors.fullName && <p className="text-red-500 text-[11px] font-black mt-1 ml-1">⚠️ {profileErrors.fullName.message}</p>}
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    value={user?.email || ""} 
                    readOnly 
                    type="email" 
                    className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-100 border-none rounded-xl sm:rounded-2xl font-bold text-slate-400 outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    {...registerProfile("phone")} 
                    defaultValue={user?.phone || ""}
                    placeholder="e.g. +880 17XXXXXXXX" 
                    type="text" 
                    className="w-full pl-12 pr-4 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Account Role Badge */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">Account Role</label>
                <div className="w-full px-5 h-12 sm:h-14 bg-slate-100 rounded-xl sm:rounded-2xl font-black text-slate-500 flex items-center capitalize text-sm">
                  <Shield size={18} className="text-slate-400 mr-2" /> {role}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#40bfff] text-white h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/10 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* 🔒 Right Block: Security / Password Change */}
        <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm space-y-6 w-full">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
            <Lock size={18} className="text-rose-500" /> Security Setup
          </h3>
          
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...registerPassword("currentPassword")} 
                  type={showCurrentPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...registerPassword("newPassword", { minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
                  type={showNewPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="text-red-500 text-[11px] mt-1 ml-1 font-black">⚠️ {passwordErrors.newPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button type="submit" disabled={passLoading} className="w-full bg-slate-950 text-white h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                {passLoading ? <Loader2 className="animate-spin" size={16} /> : null} Update Password
              </button>
            </div>
          </form>
        </div>

      </div>
    </motion.div>
  );
};

export default ProfileSettings;