import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [verifying, setVerifying] = useState(true);

  // 🔍 ১. স্ট্রাইপের ব্যাক করা URL এর লেজ থেকে আইডিগুলো লুফে নেওয়া
  const queryParams = new URLSearchParams(location.search);
  const tuitionId = queryParams.get("tuitionId");
  const tutorId = queryParams.get("tutorId");

  useEffect(() => {
    const approveTutorApplication = async () => {
      if (!tuitionId || !tutorId) {
        toast.error("Invalid transaction parameters.");
        navigate("/dashboard/student/my-posts");
        return;
      }

      try {
        // 🚀 ২. আপনার সেই জাদুকরী এপিআই কল করে পেন্ডিং স্ট্যাটাস 'approved' করা হচ্ছে
        const res = await axiosSecure.patch("/api/tuitions/application-status", {
          tuitionId: tuitionId,
          tutorId: tutorId,
          status: "approved", // পেন্ডিং থেকে ডিরেক্ট এপ্রুভড!
        });

        if (res.data.success) {
          toast.success("Payment Secured! Tutor Status updated to Approved.");
        }
      } catch (error) {
        console.error("Status Sync Error:", error);
        toast.error("Payment received, but failed to sync tutor status manually.");
      } finally {
        setVerifying(false);
        // ⏳ ৩. ৩ সেকেন্ড পরParent ইউজারকে তার ড্যাশবোর্ডে ব্যাক করানো
        setTimeout(() => {
          navigate("/dashboard/student/my-posts");
        }, 3000);
      }
    };

    approveTutorApplication();
  }, [tuitionId, tutorId, axiosSecure, navigate]);

  return (
    <div 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 select-none"
    >
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-100/50 text-center space-y-6">
        
        {verifying ? (
          /* ⏳ ভেরিফিকেশন এনিমেশন */
          <div className="space-y-4">
            <Loader2 className="animate-spin text-[#40bfff] mx-auto" size={48} />
            <h2 className="text-2xl font-black text-slate-800">Verifying Ledger...</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Unlocking Tutor Match Protocol</p>
          </div>
        ) : (
          /* 🎉 সাকসেস গেটআপ */
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100/50">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Hiring Secured!</h2>
            <p className="text-slate-500 font-bold text-sm leading-relaxed">
              The tutor application status is now <span className="text-emerald-500 font-black uppercase">Approved</span>. You are being redirected to your dashboard...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;