import { motion } from "framer-motion";
import { CreditCard, Download, ArrowUpRight, ArrowDownLeft, Calendar, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 ১. TanStack useQuery: ব্যাকএন্ড থেকে ইউজারের ইমেইল অনুযায়ী পেমেন্ট লিস্ট নিয়ে আসা
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/payments/${user?.email}`);
      return res.data;
    },
  });

  // 🎨 ২. স্ট্যাটাস অনুযায়ী টেইলউইন্ড কাস্টম ব্যাজ স্টাইল
  const statusStyles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    failed: "bg-rose-50 text-rose-500 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  // 📊 ৩. ডাটাবেজের রিয়েল ডাটা থেকে ওভারভিউ কার্ডের ভ্যালু ডাইনামিকালি হিসাব করা
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;
    return parseFloat(amountStr.replace(/[^0-9.-]/g, "")) || 0;
  };

  // সফল ক্রেডিট বা আয় হিসাব
  const totalEarnings = payments
    .filter((txn) => txn.type === "credit" && txn.status === "success")
    .reduce((sum, txn) => sum + parseAmount(txn.amount), 0);

  // সফল ডেবিট বা প্ল্যাটফর্ম ফি হিসাব
  const platformFees = payments
    .filter((txn) => txn.type === "debit" && txn.status === "success")
    .reduce((sum, txn) => sum + parseAmount(txn.amount), 0);

  // ৪. সার্চ ইনপুট ফিল্টারিং লজিক (Title অথবা Transaction ID দিয়ে)
  const filteredTransactions = payments.filter(
    (txn) =>
      txn.tuitionTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ⏳ ডাটা ফেচিং লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#40bfff]" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 💳 Top Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment History</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Track your earnings, tuition fees, and invoices</p>
      </div>

      {/* 📊 Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {totalEarnings.toLocaleString()} BDT
            </h3>
          </div>
        </div>

        {/* Primary Method Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-[#40bfff] rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Primary Method</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {payments.length > 0 ? payments[0].method : "bKash wallet"}
            </h3>
          </div>
        </div>

        {/* Platform Fees Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Platform Fees Paid</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {platformFees.toLocaleString()} BDT
            </h3>
          </div>
        </div>
      </div>

      {/* 🔍 Search Input Filter Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="Search by Transaction ID or title..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm text-slate-700"
        />
      </div>

      {/* 📜 Transactions Table & Layout */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-xs uppercase tracking-widest">
                <th className="p-6 rounded-tl-[3rem]">Transaction Details</th>
                <th className="p-6">Method</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
                <th className="p-6 rounded-tr-[3rem] text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id || txn.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Title & ID */}
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-slate-800 font-black text-base">{txn.tuitionTitle}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          ID: {txn.id || txn._id?.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    {/* Method & Date */}
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-slate-700 font-black">{txn.method}</p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Calendar size={12} /> {txn.date}
                        </p>
                      </div>
                    </td>
                    {/* Amount with Type Color */}
                    <td className={`p-6 font-black text-base ${txn.type === 'credit' ? 'text-emerald-500' : 'text-slate-700'}`}>
                      {txn.type === 'credit' ? `+ ${txn.amount}` : `- ${txn.amount}`}
                    </td>
                    {/* Status Badge */}
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${statusStyles[txn.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {txn.status === 'success' ? 'Successful' : txn.status}
                      </span>
                    </td>
                    {/* Actions / Invoice Download */}
                    <td className="p-6 text-right">
                      <button 
                        disabled={txn.status === 'failed'}
                        className={`h-10 w-10 border rounded-xl transition-all flex items-center justify-center shadow-sm mx-auto mr-0 ${
                          txn.status === 'failed' 
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-[#40bfff] hover:text-white hover:border-[#40bfff]'
                        }`}
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* 📥 Empty State */
                <tr>
                  <td colSpan="5" className="text-center p-20 text-slate-400 font-black uppercase tracking-widest bg-white">
                     No payment logs found matching criteria
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

export default PaymentHistory;