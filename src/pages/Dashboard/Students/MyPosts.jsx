import { motion } from "framer-motion";
import { Users, MapPin, CircleDollarSign, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // ✅ সুইটঅ্যালার্ট২ ইম্পোর্ট

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  console.log(user)
  console.log(user?.uid)

  // 🔄 ১. TanStack useQuery: ডাটাবেজ থেকে এই ইউজারের সব পোস্ট লাইভ নিয়ে আসা
  const { data: myPosts = [], isLoading } = useQuery({
    queryKey: ["my-posts", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tuitions/my-posts/${user?.uid}`);
      return res.data;
    },
  });

  // 🚀 ২. TanStack useMutation: পোস্ট ডিলিট করার মেকানিজম
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await axiosSecure.delete(`/api/tuitions/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      // ✅ সুইটঅ্যালার্ট সাকসেস নোটিফিকেশন
      Swal.fire({
        title: "Deleted!",
        text: "Your tuition post has been deleted.",
        icon: "success",
        customClass: {
          popup: "rounded-[2rem]",
          confirmButton: "bg-emerald-500 text-white px-6 py-3 rounded-xl font-black"
        },
        buttonsStyling: false
      });
      
      // ক্যাশ রিফ্রেশ
      queryClient.invalidateQueries({ queryKey: ["my-posts", user?.uid] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    },
  });

  // 🎯 প্রিমিয়াম সুইটঅ্যালার্ট২ ডিলিট হ্যান্ডলার
  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this tuition post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true, // ডান পাশে কনফার্ম বাটন রাখার জন্য
      customClass: {
        popup: "rounded-[2.5rem] p-8 border border-slate-100 shadow-xl",
        title: "text-slate-800 font-black text-2xl",
        htmlContainer: "text-slate-400 font-bold text-sm",
        confirmButton: "h-12 px-6 bg-rose-500 text-white rounded-xl font-black text-xs mx-2 hover:bg-rose-600 transition-all",
        cancelButton: "h-12 px-6 bg-slate-100 text-slate-500 rounded-xl font-black text-xs mx-2 hover:bg-slate-200 transition-all"
      },
      buttonsStyling: false // কাস্টম টেইলউইন্ড ক্লাস ব্যবহারের জন্য ডিফল্ট স্টাইল অফ করলাম
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(postId);
      }
    });
  };

  // ⏳ ডাটা ফেচিং লোডিং স্টেট ইউআই
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* ⚙️ Top Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">My Tuition Posts</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Manage your posts and view applicants</p>
        </div>
        <Link to="/dashboard/post-tuition">
          <button className="h-14 px-6 bg-[#40bfff] text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#3498db] transition-all">
            + New Post
          </button>
        </Link>
      </div>

      {/* 🗂️ Posts Grid View */}
      <div className="grid gap-6">
        {myPosts.length > 0 ? (
          myPosts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group"
            >
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors">
                    {post.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    post.status === 'open' 
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-5 text-sm text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#40bfff]" /> {post.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CircleDollarSign size={16} className="text-[#2ecc71]" /> {post.salary} BDT
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={16} className="text-slate-400" /> {post.applicants || 0} Applicants
                  </span>
                </div>
              </div>

              {/* 🛠️ Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0">
                <Link 
                  to={`/dashboard/student/applicants/${post._id}`} 
                  className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all"
                >
                  View Applicants <ExternalLink size={14} />
                </Link>
                
                <button 
                  onClick={() => handleDelete(post._id)}
                  disabled={deleteMutation.isPending}
                  className="h-12 w-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

            </div>
          ))
        ) : (
          /* 📥 Empty State View */
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="font-black text-slate-300 uppercase tracking-widest">You haven't posted any tuition yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyPosts;