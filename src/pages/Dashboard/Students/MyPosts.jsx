import { motion } from "framer-motion";
import { Users, MapPin, CircleDollarSign, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const MyPosts = () => {
  // Mock Data: ব্যাকএন্ড কানেক্ট করলে এখানে API থেকে ডাটা আসবে
  const myPosts = [
    {
      _id: "1",
      title: "Need Mathematics Tutor for Class 9",
      location: "Bogra Sadar",
      salary: "5500 BDT",
      applicants: 12,
      status: "open"
    },
    {
      _id: "2",
      title: "Chemistry Tutor for HSC 2nd Year",
      location: "Sherpur, Bogra",
      salary: "7000 BDT",
      applicants: 5,
      status: "closed"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
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

      <div className="grid gap-6">
        {myPosts.length > 0 ? myPosts.map((post) => (
          <div key={post._id} className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group">
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-[#40bfff] transition-colors">{post.title}</h3>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${post.status === 'open' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  {post.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-slate-400 font-bold">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#40bfff]" /> {post.location}</span>
                <span className="flex items-center gap-1.5"><CircleDollarSign size={16} className="text-[#2ecc71]" /> {post.salary}</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-slate-400" /> {post.applicants} Applicants</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0">
              <Link to={`/dashboard/applicants/${post._id}`} className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all">
                View Applicants <ExternalLink size={14} />
              </Link>
              <button className="h-12 w-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="font-black text-slate-300 uppercase tracking-widest">You haven't posted any tuition yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyPosts;