import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, MapPin, BookOpen, CircleDollarSign, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import Loading from "../Loading/Loading";
import useAuth from "../../hooks/useAuth";

const MyBookmarks = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // 🔄 ১. তানস্ট্যাক কুয়েরি দিয়ে ইউজারের বুকমার্ক করা পোস্টগুলো লাইভ আনা
  const { data: bookmarkedPosts = [], isLoading } = useQuery({
    queryKey: ["my-bookmarks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/my-bookmarks/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email // ইমেইল থাকলেই কেবল কুয়েরি চলবে
  });

  // 🗑️ ২. বুকমার্ক রিমুভ করার মিউটেশন লজিক
  const removeBookmarkMutation = useMutation({
    mutationFn: async (tuitionId) => {
      const res = await axiosSecure.delete(`/api/bookmarks?userEmail=${user?.email}&tuitionId=${tuitionId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-bookmarks", user?.email]);
      toast.success("Bookmark removed successfully.");
    }
  });

  if (isLoading) return <Loading />;

  return (
    <div style={{ fontFamily: "'League Spartan', sans-serif" }} className="space-y-6 w-full max-w-7xl mx-auto px-2 py-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">My Bookmarks</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Your saved preferred tuition circulars</p>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {bookmarkedPosts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-800 leading-snug line-clamp-2">{post.title}</h3>
                
                <div className="space-y-2 text-xs font-bold text-slate-500 border-t border-b border-slate-50 py-3">
                  <p className="flex items-center gap-2"><BookOpen size={14} className="text-[#40bfff]" /> {post.subject}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {post.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-2 border-t border-slate-50">
                <span className="text-emerald-600 font-black text-lg flex items-center"><CircleDollarSign size={16} />{post.salary}</span>
                
                {/* রিমুভ বাটন */}
                <button 
                  onClick={() => removeBookmarkMutation.mutate(post._id)}
                  disabled={removeBookmarkMutation.isPending}
                  className="h-9 w-9 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 rounded-xl transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
                  title="Remove Bookmark"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-dashed rounded-[2.5rem] text-slate-400 font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-3">
          <AlertTriangle size={32} className="text-slate-300" />
          No bookmarked tuition posts found
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;