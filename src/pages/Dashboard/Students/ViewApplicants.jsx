import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  X,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ViewApplicants = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["applicants", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tuitions/applicants/${id}`);
      return res.data;
    },
  });

  // রিজেক্ট মিউটেশন (সঠিক কুয়েরি প্যারামিটারে tutorId পাস করা)
  const rejectMutation = useMutation({
    mutationFn: async (tutorId) => {
      // এখানে URL টি চেক করুন:
      const url = `/api/tuitions/application-status?tuitionId=${id}&tutorId=${tutorId}`;

      // axiosSecure ব্যবহার করার সময় body-তে শুধু status টি পাঠাচ্ছেন
      return await axiosSecure.patch(url, { status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants", id] });
      toast.error("Application rejected successfully.");
    },
    onError: (err) => {
      console.error("Reject Error:", err.response?.data);
      toast.error("Failed to reject: " + err.response?.data?.message);
    },
  });

  // পেমেন্ট চেকআউট মিউটেশন
  const checkoutMutation = useMutation({
    mutationFn: async ({ tutorId, tuitionTitle, price }) => {
      const res = await axiosSecure.post("/api/create-checkout-session", {
        price: Number(price.replace(/[^0-9.]/g, "")),
        tuitionTitle,
        tuitionId: id,
        tutorId,
        studentEmail: user?.email,
      });
      return res.data;
    },
    onSuccess: (data) => (window.location.href = data.url),
  });

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" size={40} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">
          Applicants ({applicants.length})
        </h1>
        <Link
          to="/dashboard/student/my-posts"
          className="flex items-center gap-2 text-slate-500 font-bold"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applicants.map((app) => (
          <div
            key={app._id}
            className={`p-6 rounded-3xl border ${app.status === "rejected" ? "opacity-60 bg-slate-50" : "bg-white"}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={app.tutorImage}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-black text-lg">{app.tutorName}</h3>
                <p className="text-xs text-slate-400 font-bold">
                  {app.tutorEmail}
                </p>
              </div>
            </div>
            <p className="text-sm bg-slate-100 p-4 rounded-xl mb-4">
              {app.proposal}
            </p>

            {app.status === "pending" ? (
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    checkoutMutation.mutate({
                      tutorId: app.tutorId,
                      tuitionTitle: app.tuitionTitle,
                      price: app.tuitionSalary,
                    })
                  }
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-xs hover:bg-emerald-600 transition-all"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Accept & Pay"
                  )}
                </button>
                <button
                  onClick={() => rejectMutation.mutate(app.tutorId)}
                  className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-black text-xs hover:bg-rose-600 transition-all"
                >
                  Reject
                </button>
              </div>
            ) : (
              <span
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${app.status === "rejected" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}
              >
                {app.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewApplicants;
