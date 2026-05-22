import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Shield } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
// import axios from "axios"; // ব্যাকএন্ড কানেকশনের জন্য

const ProfileSettings = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const role = user?.role || "student";

  const onUpdateProfile = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Updating your account settings...");
    
    try {
      const updatedInfo = {
        name: data.fullName,
        phone: data.phone,
      };
      
      console.log("Updating Personal Info:", updatedInfo);
      // await axios.patch(`http://localhost:5000/api/users/${user.email}`, updatedInfo);
      
      toast.update(toastId, { 
        render: "Profile details updated successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(toastId, { render: "Update failed.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    if (!data.newPassword) return;
    const toastId = toast.loading("Updating password...");
    
    try {
      console.log("Changing Password to:", data.newPassword);
      // ফায়ারবেস বা ব্যাকএন্ড পাসওয়ার্ড আপডেট লজিক এখানে হবে
      
      toast.update(toastId, { 
        render: "Password changed successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(toastId, { render: "Password update failed.", type: "error", isLoading: false, autoClose: 3000 });
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
        <h1 className="text-3xl font-black text-slate-800 mb-2">Account Settings</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Manage your profile details and security configurations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* 👤 Left Block: Personal Information */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
            <User size={20} className="text-[#40bfff]" /> Personal Information
          </h3>
          
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    {...register("fullName", { required: "Name is required" })} 
                    defaultValue={user?.displayName || ""} 
                    type="text" 
                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    value={user?.email || ""} 
                    readOnly 
                    type="email" 
                    className="w-full pl-12 pr-4 h-14 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    {...register("phone")} 
                    placeholder="e.g. +880 17XXXXXXXX" 
                    type="text" 
                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Account Role Badge */}
              <div>
                <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">Account Role</label>
                <div className="w-full px-5 h-14 bg-slate-100 rounded-2xl font-black text-slate-500 flex items-center capitalize">
                  <Shield size={18} className="text-slate-400 mr-2" /> {role}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="bg-[#40bfff] text-white h-14 px-8 rounded-2xl font-black text-md shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2">
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>

        {/* 🔒 Right Block: Security / Password Change */}
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
            <Lock size={20} className="text-rose-500" /> Security
          </h3>
          
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("currentPassword")} 
                  type={showCurrentPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register("newPassword", { minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
                  type={showNewPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" 
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-2 ml-2 font-black">⚠️ {errors.newPassword.message}</p>}
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black text-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              Update Password
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
};

export default ProfileSettings;