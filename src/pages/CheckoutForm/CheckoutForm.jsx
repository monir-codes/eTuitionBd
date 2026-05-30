import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Loader2, CreditCard } from "lucide-react";

const CheckoutForm = ({ price, tuitionTitle, tuitionId, tutorId }) => {
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);

  const handleCheckoutRedirect = async () => {
    setLoading(true);
    try {
      // ব্যাকএন্ড থেকে স্ট্রাইপ লিংকটা নিয়ে আসা
      const res = await axiosSecure.post("/api/create-checkout-session", {
        price,
        tuitionTitle,
        tuitionId,
        tutorId
      });

      if (res.data.url) {
        // 🚀 ইউজারকে সরাসরি স্ট্রাইপের অফিশিয়াল পেমেন্ট ফর্মে পাঠিয়ে দেওয়া!
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to redirect to Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckoutRedirect}
      disabled={loading}
      className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black shadow-lg hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          <CreditCard size={18} />
          <span>Pay {price} BDT via Stripe Form</span>
        </>
      )}
    </button>
  );
};

export default CheckoutForm;