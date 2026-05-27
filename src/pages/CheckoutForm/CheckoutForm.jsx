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

  // 🔄 Create Payment Intent
  useEffect(() => {
    const getClientSecret = async () => {
      try {
        if (Number(price) > 0) {
          const res = await axiosSecure.post(
            "/api/payments",
            {
              price: Number(price),
            }
          );

          setClientSecret(res.data.clientSecret);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to initialize payment.");
      }
    };

    getClientSecret();
  }, [price, axiosSecure]);

  // 💳 Handle Payment
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || processing) return;

    const card = elements.getElement(CardElement);

    if (!card) return;

    setProcessing(true);

    const toastId = toast.loading("Processing payment...");

    try {
      // ✅ Create Payment Method
      const { error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (paymentMethodError) {
        toast.update(toastId, {
          render: paymentMethodError.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        setProcessing(false);
        return;
      }

      // ✅ Confirm Card Payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        });

      if (confirmError) {
        toast.update(toastId, {
          render: confirmError.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        setProcessing(false);
        return;
      }

      // ✅ Payment Success
      if (paymentIntent?.status === "succeeded") {
        const paymentPayload = {
          transactionId: paymentIntent.id,
          tuitionTitle,
          amount: Number(price),
          currency: "BDT",

          paymentMethod: "Stripe Card",
          type: "debit",
          status: "success",

          studentName: user?.displayName,
          studentEmail: user?.email,
          studentUID: user?.uid,
          studentPhoto: user?.photoURL,

          paidAt: new Date(),
        };

        // ✅ Save Payment To Database
        const res = await axiosSecure.post(
          "/api/payments",
          paymentPayload
        );

        if (res.data.insertedId) {
          toast.update(toastId, {
            render: "Payment Successful!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error(error);

      toast.update(toastId, {
        render: error.message || "Payment failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 💳 Card Input */}
      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1e293b",
                fontFamily: "'League Spartan', sans-serif",
                "::placeholder": {
                  color: "#cbd5e1",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>

      {/* 🚀 Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-[#40bfff] text-white h-14 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#3498db] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </>
        ) : (
          <>Pay {price} BDT</>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;