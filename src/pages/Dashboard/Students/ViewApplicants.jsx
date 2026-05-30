import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Check,
  X,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
  AlertTriangle,
  FileText,
  ArrowLeft,
} from "lucide-react";

import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ViewApplicants = () => {
  const { id } = useParams(); // tuitionId
  const { user } = useAuth();

  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // ✅ Fetch applicants
  const {
    data: applicants = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["applicants", id],

    enabled: !!id,

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/tuitions/applicants/${id}`
      );

      return res.data;
    },
  });

  // ✅ Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ tutorId }) => {
      const res = await axiosSecure.patch(
        `/api/tuitions/application-status`,
        {
          tuitionId: id,
          tutorId,
          status: "rejected",
        }
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message ||
            "Failed to reject application."
        );
      }

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicants", id],
      });

      toast.success(
        "Tutor proposal rejected successfully."
      );
    },

    onError: (err) => {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject application."
      );
    },
  });

  // ✅ Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async ({
      tutorId,
      tuitionTitle,
      price,
    }) => {
      const res = await axiosSecure.post(
        "/api/create-checkout-session",
        {
          price: Number(price) || 5000,
          tuitionTitle,
          tuitionId: id,
          tutorId,
          studentEmail: user?.email,
          studentName: user?.displayName,
        }
      );

      if (!res.data?.url) {
        throw new Error(
          "Failed to create payment session."
        );
      }

      return res.data;
    },

    onSuccess: (data) => {
      toast.info(
        "Redirecting to Stripe Secure Gateway..."
      );

      window.location.href = data.url;
    },

    onError: (err) => {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Gateway communication failed."
      );
    },
  });

  // ✅ Accept Handler
  const handleAcceptClick = (
    tutorId,
    tuitionTitle,
    salary
  ) => {
    const cleanPrice =
      typeof salary === "string"
        ? salary.replace(/[^0-9.]/g, "")
        : salary;

    checkoutMutation.mutate({
      tutorId,
      tuitionTitle:
        tuitionTitle ||
        "Tuition Payment Matched",
      price: cleanPrice,
    });
  };

  // ✅ Loading UI
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2
          className="animate-spin text-[#40bfff]"
          size={40}
        />

        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest text-center">
          Loading Applied Tutors...
        </p>
      </div>
    );
  }

  // ✅ Error UI
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 px-4 text-center">
        <AlertTriangle size={40} />

        <p className="font-black uppercase tracking-wider">
          Sync Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
      style={{
        fontFamily: "'League Spartan', sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">
            Tutor Applications
          </h1>

          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
            Review proposals, check profiles, and
            hire the perfect tutor
          </p>
        </div>

        <Link to="/dashboard/student/my-posts">
          <button className="inline-flex items-center gap-2 text-slate-500 font-black hover:text-[#40bfff] transition-colors uppercase tracking-widest text-[10px] sm:text-xs">
            <ArrowLeft size={14} />
            My Circulars
          </button>
        </Link>
      </div>

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        {applicants.length > 0 ? (
          applicants.map((app) => (
            <div
              key={app.tutorId || app._id}
              className={`bg-white p-5 sm:p-6 lg:p-8 rounded-[2.5rem] sm:rounded-[3rem] border transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${
                app.status === "accepted"
                  ? "border-emerald-200 shadow-lg shadow-emerald-100/20 bg-emerald-50/5"
                  : app.status === "rejected"
                  ? "border-rose-100/70 bg-rose-50/5 opacity-75"
                  : "border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-100/20"
              }`}
            >
              {/* Status */}
              {app.status === "accepted" && (
                <span className="absolute top-5 right-6 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Approved / Hired
                </span>
              )}

              {app.status === "rejected" && (
                <span className="absolute top-5 right-6 bg-rose-50 text-rose-500 border border-rose-100 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Rejected
                </span>
              )}

              {/* Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 min-w-0 pr-24">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                    <img
                      src={
                        app.tutorImage ||
                        "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      className="w-full h-full object-cover"
                      alt="Tutor"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 truncate">
                      {app.tutorName}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-[#40bfff] font-black flex items-center gap-1 mt-0.5 uppercase tracking-wider truncate">
                      <GraduationCap
                        size={13}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {app.tutorInstitution ||
                          "Expert Varsity Mentor"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-500 pt-1 border-y border-slate-50 py-3 w-full">
                  <p className="flex items-center gap-1.5 min-w-0">
                    <Mail
                      size={13}
                      className="text-slate-400 shrink-0"
                    />

                    <span className="truncate text-slate-600">
                      {app.tutorEmail}
                    </span>
                  </p>

                  <p className="flex items-center gap-1.5 min-w-0">
                    <Phone
                      size={13}
                      className="text-slate-400 shrink-0"
                    />

                    <span className="text-slate-600">
                      {app.tutorPhone ||
                        "Hidden on Log"}
                    </span>
                  </p>
                </div>

                {/* Proposal */}
                <div className="bg-slate-50/80 p-4 rounded-2xl space-y-1 border border-slate-100/50 w-full">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <FileText size={12} />
                    Tutor's Proposal Statement
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-words">
                    {app.proposal ||
                      "No cover letter submitted by the tutor."}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              {(app.status === "pending" ||
                !app.status) && (
                <div className="flex flex-col sm:flex-row gap-2.5 border-t border-slate-50/80 pt-4 mt-2 w-full">
                  {/* Accept */}
                  <button
                    onClick={() =>
                      handleAcceptClick(
                        app.tutorId,
                        app.tuitionTitle,
                        app.tuitionSalary
                      )
                    }
                    disabled={
                      checkoutMutation.isPending ||
                      rejectMutation.isPending
                    }
                    className="w-full sm:flex-1 h-11 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-emerald-100 disabled:opacity-50 shadow-sm active:scale-95"
                  >
                    {checkoutMutation.isPending ? (
                      <Loader2
                        className="animate-spin"
                        size={14}
                      />
                    ) : (
                      <Check size={14} />
                    )}

                    <span>
                      Accept & Pay Securely
                    </span>
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() =>
                      rejectMutation.mutate({
                        tutorId: app.tutorId,
                      })
                    }
                    disabled={
                      checkoutMutation.isPending ||
                      rejectMutation.isPending
                    }
                    className="w-full sm:w-28 h-11 bg-rose-50 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-rose-100 disabled:opacity-50 active:scale-95"
                  >
                    {rejectMutation.isPending ? (
                      <Loader2
                        className="animate-spin"
                        size={14}
                      />
                    ) : (
                      <X size={14} />
                    )}

                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] sm:rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 px-4">
            <AlertTriangle
              size={36}
              className="text-slate-300"
            />

            <p className="font-black text-slate-300 uppercase tracking-widest text-xs sm:text-sm">
              No tutors have applied to this post yet
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ViewApplicants;