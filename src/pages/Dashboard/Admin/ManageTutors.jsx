import { motion } from "framer-motion";
import { Check, X, ShieldCheck, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

const ManageTutors = () => {
  // Mock Requests Data: MongoDB থেকে ডাইনামিকালি নিয়ে আসার জন্য স্ট্রাকচার রেডি
  const verificationRequests = [
    {
      id: "T901",
      name: "Sabbir Rahman",
      email: "sabbir.buet@gmail.com",
      institute: "BUET",
      subject: "Physics, Higher Math",
      status: "Pending"
    },
    {
      id: "T902",
      name: "Anika Tahsin",
      email: "anika.du@gmail.com",
      institute: "Dhaka University",
      subject: "Chemistry, Biology",
      status: "Pending"
    }
  ];

  const handleApprove = (id, name) => {
    // এখানে axios.patch করে ব্যাকএন্ডের রোল বা ভেরিফাইড স্ট্যাটাস ট্রু করতে হবে
    console.log(`Approved Tutor ID: ${id}`);
    toast.success(`${name} is now a Verified Tutor on eTuitionBD!`);
  };

  const handleReject = (id, name) => {
    console.log(`Rejected Tutor ID: ${id}`);
    toast.error(`Verification request rejected for ${name}.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Verify Tutors</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Review background details and grant badges</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-xs uppercase tracking-widest">
                <th className="p-6 rounded-tl-[3rem]">Tutor Info</th>
                <th className="p-6">Institution</th>
                <th className="p-6">Expertise</th>
                <th className="p-6 rounded-tr-[3rem] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {verificationRequests.length > 0 ? verificationRequests.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#40bfff]">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="text-slate-800 font-black">{tutor.name}</p>
                        <p className="text-xs text-slate-400">{tutor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-black text-slate-700">{tutor.institute}</td>
                  <td className="p-6 text-xs bg-slate-50/50 rounded-xl">{tutor.subject}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(tutor.id, tutor.name)}
                        className="h-10 w-10 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-sm"
                        title="Verify Tutor"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleReject(tutor.id, tutor.name)}
                        className="h-10 w-10 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-sm"
                        title="Reject Request"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
                     No pending verification requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageTutors;