import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const CheckoutForm = ({ price, tuitionTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  // 🔄 ব্যাকএন্ড থেকে ক্লায়েন্ট সিক্রেট নিয়ে আসা
  useEffect(() => {
    if (price > 0) {
      axiosSecure.post("/api/create-payment-intent", { price })
        .then(res => setClientSecret(res.data.clientSecret));
    }
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || processing) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);
    const toastId = toast.loading("Processing payment...");

    // ১. কার্ড ভেরিফিকেশন
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 3000 });
      setProcessing(false);
      return;
    }

    // ২. পেমেন্ট কনফার্মেশন
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email || "anonymous",
          name: user?.displayName || "anonymous",
        },
      },
    });

    if (confirmError) {
      toast.update(toastId, { render: confirmError.message, type: "error", isLoading: false, autoClose: 3000 });
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // 📦 ৩. পements কালেকশনের জন্য আপনার রিকোয়ারমেন্ট অনুযায়ী অবজেক্ট রেডি করা
      const paymentPayload = {
        id: paymentIntent.id, // Transaction ID
        tuitionTitle: tuitionTitle,
        amount: `${price} BDT`,
        date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', year: 'numeric', month: 'short', day: 'numeric' }),
        method: "Stripe (Card)",
        type: "debit", // স্টুডেন্টের জন্য debit
        status: "success",
        email: user?.email
      };

      // ডাটাবেজে সেভ করা
      const res = await axiosSecure.post("/api/payments", paymentPayload);
      if (res.data.insertedId) {
        toast.update(toastId, { render: "Payment Successful!", type: "success", isLoading: false, autoClose: 3000 });
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1e293b",
                fontFamily: "'League Spartan', sans-serif",
                "::placeholder": { color: "#cbd5e1" },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {processing ? <Loader2 className="animate-spin" size={18} /> : `Pay ${price} BDT`}
      </button>
    </form>
  );
};

export default CheckoutForm;