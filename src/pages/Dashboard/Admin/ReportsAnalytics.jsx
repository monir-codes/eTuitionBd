import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { DollarSign, CreditCard, Calendar, ArrowUpRight, Search, FileSpreadsheet, AlertCircle } from "lucide-react";
import Loading from "../../Loading/Loading";

const ReportsAnalytics = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 ১. TanStack Query দিয়ে সফল ট্রানজেকশন ও টোটাল আর্নিং রিপোর্ট ফেচ করা
  const { data: reportData, isLoading, isError } = useQuery({
    queryKey: ["financial-report"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/financial-reports");
      return res.data;
    }
  });

  // ডাটাবেজ ফলব্যাক সেফটি
  const transactions = reportData?.transactions || [];
  const totalEarnings = reportData?.totalEarnings || 0;

  // 🔍 ২. ক্লায়েন্ট-সাইড ফিল্টারিং (সহজ লুপ)
  const filteredTransactions = transactions.filter((tx) => {
    const id = tx?.transactionId ? String(tx.transactionId).toLowerCase() : "";
    const email = tx?.userEmail ? String(tx.userEmail).toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return id.includes(search) || email.includes(search);
  });

  // 📊 ৩. খাঁটি টেলউইন্ড চার্টের জন্য লেটেস্ট ৫টি ডাটা প্রিপেয়ার করা
  const latestTransactions = transactions.slice(0, 5).reverse();
  
  // চার্টের সর্বোচ্চ হাইট বের করার জন্য ট্রানজেকশনের ম্যাক্সিমাম অ্যামাউন্ট বের করা
  const amounts = latestTransactions.map(tx => parseFloat(tx?.amount) || 0);
  const maxAmount = Math.max(...amounts, 1); // ০ দিয়ে ভাগ হওয়া ঠেকাতে ডিফল্ট ১

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-rose-500 text-center px-4">
        <AlertCircle size={40} />
        <p className="font-bold uppercase tracking-wider text-sm">Failed to sync financial analytics engine</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-7xl mx-auto px-2 py-2 overflow-hidden"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* 👑 Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Reports & Analytics</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Centralized Financial Performance Dashboard</p>
      </div>

      {/* 📊 Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Card 1: Total Earnings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Total Platform Earnings</p>
            <h2 className="text-3xl font-black text-slate-900 flex items-baseline">
              ${totalEarnings}
              <span className="text-xs font-bold text-emerald-500 ml-1.5 flex items-center gap-0.5"><ArrowUpRight size={12}/> Net gross</span>
            </h2>
          </div>
          <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Card 2: Successful Checkouts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Successful Checkouts</p>
            <h2 className="text-3xl font-black text-slate-900">
              {transactions.length}
              <span className="text-xs font-bold text-slate-400 ml-1.5 font-sans">Invoices</span>
            </h2>
          </div>
          <div className="h-11 w-11 bg-blue-50 text-[#40bfff] rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* 📈 ৪. পিওর টেলউইন্ড লাক্সারি গ্রাফ সেকশন (Recharts মুক্ত ও ১০০% সেফ) */}
      <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm w-full min-w-0">
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-black text-slate-800">Revenue Flow & Growth Trend</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Visualizing live inflow records from recent checkouts</p>
        </div>
        
        {/* কাস্টম গ্রাফ লেআউট */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-end min-h-[260px] sm:min-h-[320px]">
          {latestTransactions.length > 0 ? (
            <div className="flex items-end justify-around h-48 sm:h-60 w-full pt-6">
              {latestTransactions.map((tx, idx) => {
                const currentAmount = parseFloat(tx?.amount) || 0;
                // ম্যাক্সিমাম অ্যামাউন্টের সাথে তুলনা করে পার্সেন্টেজ হাইট বের করা
                const barHeight = (currentAmount / maxAmount) * 100;
                
                // ডেট ফরম্যাটার
                let displayDate = "Recent";
                if (tx?.date) displayDate = tx.date;
                else if (tx?.postedAt) {
                  displayDate = new Date(tx.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }

                return (
                  <div key={tx._id || idx} className="flex flex-col items-center group w-12 sm:w-16 relative">
                    {/* মাউস নিলে ওপরে যে সুন্দর প্রাইস বাটন দেখাবে */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded-md transition-all duration-200 pointer-events-none z-10">
                      ${currentAmount}
                    </div>

                    {/* ডাইনামিক এনিমেটেড বার গ্রাফ */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-7 sm:w-10 bg-gradient-to-t from-[#40bfff]/40 to-[#40bfff] hover:to-[#33a6dd] rounded-t-lg shadow-sm cursor-pointer relative"
                    >
                      {/* ভেতরের গ্লোয়িং রিফ্লেকশন লাইন */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 rounded-t-lg"></div>
                    </motion.div>

                    {/* এক্স-অক্ষ (তারিখ) */}
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 mt-2 whitespace-nowrap">
                      {displayDate}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 sm:h-60 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-xs">
              Not enough ledger data to render trend chart
            </div>
          )}
        </div>
      </div>

      {/* 🔍 ৫. সার্চ ফিল্টার বার */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by Transaction ID or User Email..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="text-xs text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-4 h-11 rounded-xl border shrink-0">
          <FileSpreadsheet size={14} className="text-[#40bfff]" /> Verified Audit Logs
        </div>
      </div>

      {/* 📜 ৬. ট্রানজেকশন হিস্ট্রি টেবিল (Consistent Layout) */}
      <div className="bg-transparent sm:bg-white rounded-none sm:rounded-[2.5rem] border-none sm:border border-slate-100 sm:shadow-sm overflow-hidden w-full">
        {/* 💻 Desktop Table View */}
        <div className="hidden sm:block w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-950 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest">
                <th className="p-4 lg:p-5 w-[30%] rounded-tl-none sm:rounded-tl-[2.5rem]">Transaction ID</th>
                <th className="p-4 lg:p-5 w-[32%]">User Accounts</th>
                <th className="p-4 lg:p-5 w-[20%]">Payment Purpose</th>
                <th className="p-4 lg:p-5 w-[18%] text-right pr-6">Amount Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-600">
              {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 lg:p-5 font-mono text-xs text-slate-700 select-all truncate">{tx.transactionId}</td>
                  <td className="p-4 lg:p-5 min-w-0">
                    <p className="text-slate-800 font-black truncate w-full">{tx.userName || "Platform User"}</p>
                    <p className="text-xs text-slate-400 font-medium truncate w-full">{tx.userEmail}</p>
                  </td>
                  <td className="p-4 lg:p-5 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-blue-50 text-[#40bfff] border border-blue-100 text-[10px] font-black uppercase tracking-wider rounded-md">
                      {tx.purpose || "Tuition Fee"}
                    </span>
                  </td>
                  <td className="p-4 lg:p-5 text-right whitespace-nowrap pr-6 text-emerald-600 font-black">
                    +${tx.amount}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
                     No ledger transaction logs recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile View: Card Mode */}
        <div className="block sm:hidden space-y-4 w-full">
          {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
            <div key={tx._id} className="p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">#{tx.transactionId}</span>
                <span className="text-emerald-600 font-black text-sm">+${tx.amount}</span>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-slate-800 font-black">{tx.userName || "Platform User"}</p>
                <p className="text-slate-400 font-medium">{tx.userEmail}</p>
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-slate-400">
                <span className="px-2 py-0.5 bg-blue-50 text-[#40bfff] border rounded uppercase tracking-wider">{tx.purpose || "Tuition Fee"}</span>
                <span className="flex items-center gap-1"><Calendar size={12}/> Successful</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed text-slate-400 font-black text-xs uppercase tracking-widest">
               No invoice transactions matching filters
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsAnalytics;