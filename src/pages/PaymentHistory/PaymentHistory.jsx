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

  // 🔄 ১. TanStack useQuery: ব্যাকএন্ড থেকে ইউজারের ইমেইল অনুযায়ী পেমেন্ট লিস্ট নিয়ে আসা
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/payments/${user?.email}`);
      return res.data;
    },
  });

  // 🎨 ২. স্ট্যাটাস অনুযায়ী টেইলউইন্ড কাস্টম ব্যাজ স্টাইল
  const statusStyles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    failed: "bg-rose-50 text-rose-500 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  // 📊 ৩. ডাটাবেজের রিয়েল ডাটা থেকে ওভারভিউカードের ভ্যালু ডাইনামিকালি হিসাব করা
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;
    return parseFloat(amountStr.replace(/[^0-9.-]/g, "")) || 0;
  };

  // সফল ক্রেডিট বা আয় হিসাব
  const totalEarnings = payments
    .filter((txn) => txn.type === "credit" && txn.status === "success")
    .reduce((sum, txn) => sum + parseAmount(txn.amount), 0);

  // সফল ডেবিট বা প্ল্যাটফর্ম ফি হিসাব
  const platformFees = payments
    .filter((txn) => txn.type === "debit" && txn.status === "success")
    .reduce((sum, txn) => sum + parseAmount(txn.amount), 0);

  // ৪. সার্চ ইনপুট ফিল্টারিং লজিক (Title অথবা Transaction ID দিয়ে)
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 💳 Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-1 leading-tight">Payment History</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Track your earnings, tuition fees, and invoices</p>
      </div>

      {/* 📊 Quick Overview Cards - Mobile First Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Earnings Card */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.01)] flex items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowDownLeft size={22} sm:size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
              {totalEarnings.toLocaleString()} BDT
            </h3>
          </div>
        </div>

        {/* Primary Method Card */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.01)] flex items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-[#40bfff] rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard size={22} sm:size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-wider">Primary Method</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 truncate max-w-[150px] sm:max-w-none">
              {payments.length > 0 ? payments[0].method : "bKash wallet"}
            </h3>
          </div>
        </div>

        {/* Platform Fees Card */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.01)] flex items-center gap-4 sm:gap-5 col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowUpRight size={22} sm:size={24} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-wider">Platform Fees Paid</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
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
          placeholder="Search by ID or title..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-xs sm:text-sm text-slate-700"
        />
      </div>

      {/* 💻 Desktop & Tablet View: সলিড রেসপন্সিভ টেবিল */}
      <div className="hidden sm:block bg-white rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-xs uppercase tracking-widest">
                <th className="p-5 sm:p-6 rounded-tl-[2.5rem] sm:rounded-tl-[3rem]">Transaction Details</th>
                <th className="p-5 sm:p-6">Method</th>
                <th className="p-5 sm:p-6">Amount</th>
                <th className="p-5 sm:p-6">Status</th>
                <th className="p-5 sm:p-6 rounded-tr-[2.5rem] sm:rounded-tr-[3rem] text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id || txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 sm:p-6">
                      <div className="space-y-1 min-w-0">
                        <p className="text-slate-800 font-black text-sm sm:text-base break-words">{txn.tuitionTitle}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                          ID: {txn.id || txn._id?.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 sm:p-6">
                      <div className="space-y-1 shrink-0">
                        <p className="text-slate-700 font-black">{txn.method}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Calendar size={12} /> {txn.date}
                        </p>
                      </div>
                    </td>
                    <td className={`p-5 sm:p-6 font-black text-sm sm:text-base shrink-0 ${txn.type === 'credit' ? 'text-emerald-500' : 'text-slate-700'}`}>
                      {txn.type === 'credit' ? `+ ${txn.amount}` : `- ${txn.amount}`}
                    </td>
                    <td className="p-5 sm:p-6 shrink-0">
                      <span className={`px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${statusStyles[txn.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {txn.status === 'success' ? 'Successful' : txn.status}
                      </span>
                    </td>
                    <td className="p-5 sm:p-6 text-right shrink-0">
                      <button 
                        disabled={txn.status === 'failed'}
                        className={`h-10 w-10 border rounded-xl transition-all flex items-center justify-center shadow-sm ml-auto ${
                          txn.status === 'failed' 
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-[#40bfff] hover:text-white hover:border-[#40bfff]'
                        }`}
                        title="Download Receipt"
                      >
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-16 text-slate-400 font-black uppercase tracking-widest bg-white text-xssm">
                     No payment logs found matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 Mobile View: আল্ট্রা-ক্লিন রেসপন্সিভ কার্ড স্ট্যাক (টেবিল ভেঙে স্ক্রিন নষ্ট হওয়া রোধ করবে) */}
      <div className="block sm:hidden space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => (
            <div 
              key={txn._id || txn.id} 
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-800 leading-snug break-words">{txn.tuitionTitle}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    ID: {txn.id || txn._id?.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border shrink-0 ${statusStyles[txn.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {txn.status === 'success' ? 'Success' : txn.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-xs">
                <div className="text-slate-500 font-bold space-y-0.5">
                  <p className="text-slate-700 font-black">{txn.method}</p>
                  <p className="text-[10px] flex items-center gap-1"><Calendar size={10} /> {txn.date}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <p className={`font-black text-sm ${txn.type === 'credit' ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {txn.type === 'credit' ? `+ ${txn.amount}` : `- ${txn.amount}`}
                  </p>
                  <button 
                    disabled={txn.status === 'failed'}
                    className={`h-9 w-9 border rounded-xl flex items-center justify-center transition-all ${
                      txn.status === 'failed' 
                        ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-[#40bfff] hover:text-white'
                    }`}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[11px]">
            No matching payment logs found
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentHistory;