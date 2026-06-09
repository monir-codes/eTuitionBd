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

  // 🔍 URL থেকে প্যারামগুলো ধরছি
  const queryParams = new URLSearchParams(location.search);
  const tuitionId = queryParams.get("tuitionId");
  const tutorId = queryParams.get("tutorId"); // যদিও ব্যাকএন্ডে ইমেইল লাগবে, তাই আমরা এটা পরে হ্যান্ডেল করব

  useEffect(() => {
    const approveTutorApplication = async () => {
      if (!tuitionId) {
        toast.error("Invalid transaction parameters.");
        navigate("/dashboard/student/my-posts");
        return;
      }

      try {
        // 🚀 ২. পেমেন্ট ভেরিফিকেশন ও স্ট্যাটাস আপডেট কল
        // আপনার ব্যাকএন্ডের `/api/tuitions/application-status` এপিআই কুয়েরিতে tuitionId এবং tutorEmail চায়।
        // তাই আমাদের আগে টিউশন ডাটা থেকে tutorEmail খুঁজে বের করতে হতে পারে অথবা সরাসরি আপডেট করতে হবে।
        
        const res = await axiosSecure.patch(`/api/tuitions/status/${tuitionId}`, {
          status: "Approved", // টিউশন পোস্ট এপ্রুভড
        });

        if (res.data.modifiedCount > 0) {
          toast.success("Payment Secured! Tuition status updated.");
          navigate("/dashboard/student/my-posts");
        }
      } catch (error) {
        console.error("Status Sync Error:", error);
        toast.error("Payment received, but failed to sync system status.");
      } finally {
        setVerifying(false);
      }
    };

    approveTutorApplication();
  }, [tuitionId, axiosSecure, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 select-none">
      <div className="max-w-md w-full bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl text-center space-y-6">
        {verifying ? (
          <div className="space-y-4">
            <Loader2 className="animate-spin text-[#40bfff] mx-auto" size={48} />
            <h2 className="text-2xl font-black text-slate-800">Verifying Ledger...</h2>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Hiring Secured!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;