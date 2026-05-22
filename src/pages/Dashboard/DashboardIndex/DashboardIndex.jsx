import { Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../Loading/Loading";

const DashboardIndex = () => {
  const { user, loading } = useAuth();

  // অথেনটিকেশন লোড হতে সময় লাগলে আমাদের প্রিমিয়াম লোডার দেখাবে
  if (loading) {
    return <Loading />;
  }

  // ফায়ারবেস বা ডাটাবেজ থেকে আসা ইউজারের রোল ডিটেক্ট করা
  const role = user?.role || "student"; // ডিফল্ট স্টুডেন্ট বা টিউটর রাখতে পারো

  // রোল অনুযায়ী সঠিক ড্যাশবোর্ড পাথে রিডাইরেক্ট
  if (role === "admin") {
    return <Navigate to="admin" replace />;
  }
  if (role === "tutor") {
    return <Navigate to="tutor" replace />;
  }
  
  // স্টুডেন্ট হলে তাকে তার ডিফল্ট পেজ 'student/my-posts' এ পাঠানো হবে
  return <Navigate to="student/my-posts" replace />;
};

export default DashboardIndex;