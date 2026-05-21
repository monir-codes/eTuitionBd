import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, GraduationCap, BookOpen, Clock, Camera, Save } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const TutorHome = () => {
  const { user, updateUserProfile, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Updating profile details...");

    try {
      let uploadedImageUrl = user?.photoURL;

      // 📸 ছবি সিলেক্ট করা থাকলে ImgBB-তে আপলোড হবে
      if (data.photo && data.photo.length > 0) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imageRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_API}`,
          formData
        );

        if (imageRes.data.success) {
          uploadedImageUrl = imageRes.data.data.url;
        }
      }

      // 👤 ফায়ারবেস প্রোফাইল আপডেট
      await updateUserProfile(data.fullName, uploadedImageUrl);

      // 💾 ডাটাবেজের জন্য ফাইনাল অবজেক্ট (MongoDB-তে পাঠানোর জন্য রেডি)
      const updatedTutorData = {
        name: data.fullName,
        photo: uploadedImageUrl,
        institute: data.institute,
        subject: data.subject,
        experience: data.experience,
        bio: data.bio,
      };

      console.log("Saving to MongoDB:", updatedTutorData);
      // await axios.put(`http://localhost:5000/api/tutors/${user.email}`, updatedTutorData);
      

      setUser({ ...user, displayName: data.fullName, photoURL: uploadedImageUrl });

      toast.update(toastId, { 
        render: "Profile updated successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: "Failed to update profile.", 
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
        <h1 className="text-3xl font-black text-slate-800 mb-2">Tutor Profile</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Set up your teaching profile to attract students</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Profile Picture Upload Section */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img 
              src={user?.photoURL || "https://i.pravatar.cc/150"} 
              className="w-full h-full object-cover rounded-[2.5rem] border-4 border-slate-50" 
              alt="Profile" 
            />
            <label className="absolute bottom-0 right-0 p-2 bg-[#40bfff] text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <Camera size={18} />
              <input type="file" {...register("photo")} className="hidden" accept="image/*" />
            </label>
          </div>
          <h3 className="text-xl font-black text-slate-800">{user?.displayName || "Tutor Name"}</h3>
          <p className="text-slate-400 font-bold text-sm mt-1">{user?.email}</p>
        </div>

        {/* Input Form Fields */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input {...register("fullName", { required: "Name is required" })} defaultValue={user?.displayName || ""} type="text" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Institute / University</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input {...register("institute", { required: "Institute is required" })} placeholder="e.g. BUET / Dhaka University" type="text" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Expertise Subjects</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input {...register("subject", { required: "Subject is required" })} placeholder="e.g. Physics, Math" type="text" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Teaching Experience</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input {...register("experience", { required: "Experience is required" })} placeholder="e.g. 3 Years" type="text" className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">About / Bio</label>
            <textarea {...register("bio")} rows="4" placeholder="Write a short bio about your teaching style..." className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all resize-none"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#40bfff] text-white h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2">
            <Save size={18} /> {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TutorHome;