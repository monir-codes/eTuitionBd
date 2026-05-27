import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  CircleDollarSign,
  Trash2,
  ExternalLink,
  Loader2,
  CreditCard,
  Edit3,
  X,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    location: "",
    salary: "",
    daysPerWeek: "",
  });

  // 🔄 TanStack Query
  const { data: myPosts = [], isLoading } = useQuery({
    queryKey: ["my-posts", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tuitions/my-posts/${user?.uid}`);
      return res.data;
    },
  });

  // 🗑️ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await axiosSecure.delete(`/api/tuitions/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Your tuition post has been deleted.",
        icon: "success",
        customClass: {
          popup: "rounded-[2rem]",
          confirmButton: "bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-sm",
        },
        buttonsStyling: false,
      });
      queryClient.invalidateQueries({ queryKey: ["my-posts", user?.uid] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    },
  });

  // 📝 Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(
        `/api/tuitions/${selectedPost._id}`,
        updatedData,
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Tuition post updated successfully.",
        icon: "success",
        customClass: {
          popup: "rounded-[2rem]",
          confirmButton: "bg-[#40bfff] text-white px-6 py-3 rounded-xl font-black text-sm",
        },
        buttonsStyling: false,
      });
      queryClient.invalidateQueries({ queryKey: ["my-posts", user?.uid] });
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this tuition post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-xl max-w-[90vw] sm:max-w-md",
        title: "text-slate-800 font-black text-xl sm:text-2xl",
        htmlContainer: "text-slate-400 font-bold text-xs sm:text-sm",
        confirmButton: "h-12 px-5 bg-rose-500 text-white rounded-xl font-black text-xs mx-1 sm:mx-2 hover:bg-rose-600 transition-all",
        cancelButton: "h-12 px-5 bg-slate-100 text-slate-500 rounded-xl font-black text-xs mx-1 sm:mx-2 hover:bg-slate-200 transition-all",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(postId);
      }
    });
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title || "",
      subject: post.subject || "",
      classLevel: post.classLevel || "",
      location: post.location || "",
      salary: post.salary || "",
      daysPerWeek: post.daysPerWeek || post.days || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    updateMutation.mutate(editForm);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        {/* Top Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">
              My Tuition Posts
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              Manage your posts and view applicants
            </p>
          </div>

          <Link to="/dashboard/student/post-tuition" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-12 sm:h-14 px-6 bg-[#40bfff] text-white rounded-2xl font-black shadow-lg shadow-blue-500/10 hover:bg-[#3498db] transition-all text-sm flex items-center justify-center gap-2 active:scale-95">
              <Plus size={18} /> New Circular
            </button>
          </Link>
        </div>

        {/* Posts Stack Card Wrapper */}
        <div className="space-y-4 sm:space-y-6 w-full">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <div
                key={post._id}
                className="w-full bg-white p-5 sm:p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 group"
              >
                {/* Left Metadata Panel */}
                <div className="space-y-3.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors leading-snug break-words max-w-full">
                      {post.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        post.status === "open"
                          ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  {/* Icon Info Row */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-5 text-xs sm:text-sm text-slate-400 font-bold">
                    <span className="flex items-center gap-2 min-w-0">
                      <MapPin size={16} className="text-[#40bfff] shrink-0" />
                      <span className="truncate text-slate-600">{post.location}</span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0">
                      <CircleDollarSign size={16} className="text-[#2ecc71] shrink-0" />
                      <span className="text-slate-700">{post.salary} BDT</span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0">
                      <Users size={16} className="text-indigo-400 shrink-0" />
                      <span className="text-slate-700">{post.applicants || 0} Applicants</span>
                    </span>
                  </div>
                </div>

                {/* Right Responsive Action Panel */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2.5 w-full lg:w-auto lg:justify-end border-t lg:border-none border-slate-50 pt-4 lg:pt-0">
                  <Link
                    to={`/dashboard/student/applicants/${post._id}`}
                    className="w-full sm:w-auto"
                  >
                    <button className="w-full h-11 sm:h-12 px-5 bg-slate-950 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      View Applicants
                      <ExternalLink size={13} />
                    </button>
                  </Link>

                  {post.status === "approved" && (
                    <Link
                      to={`/dashboard/payment/${post._id}`}
                      className="w-full sm:w-auto"
                    >
                      <button className="w-full h-11 sm:h-12 px-5 bg-[#2ecc71] text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-100 hover:bg-emerald-600 transition-all">
                        <CreditCard size={13} />
                        Pay Advance
                      </button>
                    </Link>
                  )}

                  <button
                    onClick={() => handleEditClick(post)}
                    className="w-full sm:w-auto h-11 sm:h-12 px-5 flex items-center justify-center gap-2 bg-blue-50 text-[#40bfff] rounded-xl hover:bg-[#40bfff] hover:text-white transition-all font-black text-xs"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deleteMutation.isPending}
                    className="w-full sm:w-12 h-11 sm:h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                    title="Delete Post"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 px-6">
              <p className="font-black text-slate-300 uppercase tracking-widest text-xs sm:text-sm">
                You haven't posted any tuition yet
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 📱 ওয়ান-শট মোবাইল রেসপন্সিভ মোডাল পপআপ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full sm:max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 relative shadow-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto flex flex-col justify-between"
          >
            {/* Header Sticky Zone */}
            <div className="mb-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all z-10"
              >
                <X size={16} />
              </button>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
                Edit Tuition Post
              </h2>
              <p className="text-slate-400 font-bold text-xs sm:text-sm">
                Update your tuition circular details below
              </p>
            </div>

            {/* Inputs Container Form */}
            <form onSubmit={handleUpdatePost} className="space-y-5 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    value={editForm.classLevel}
                    onChange={(e) => setEditForm({ ...editForm, classLevel: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Budget (BDT)
                  </label>
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-xs text-slate-600 uppercase tracking-wider">
                    Days Per Week
                  </label>
                  <input
                    type="text"
                    value={editForm.daysPerWeek}
                    onChange={(e) => setEditForm({ ...editForm, daysPerWeek: e.target.value })}
                    className="w-full h-12 sm:h-14 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm outline-none focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                  />
                </div>
              </div>

              {/* Action Submit Sticky block */}
              <div className="pt-4 border-t border-slate-50 mt-6">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full h-12 sm:h-14 rounded-2xl bg-[#40bfff] text-white font-black hover:bg-[#3498db] transition-all shadow-lg shadow-blue-100 flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Update Post Information"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MyPosts;