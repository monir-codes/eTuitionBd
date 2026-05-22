import { motion } from "framer-motion";
import { CreditCard, Download, ArrowUpRight, ArrowDownLeft, Calendar, Search } from "lucide-react";
import { useState } from "react";

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Transactions Data: ব্যাকএন্ডের সাথে ডাইনামিকালি মেলানোর জন্য রেডি স্ট্রাকচার
  const transactions = [
    {
      id: "TXN-982103",
      tuitionTitle: "Class 10 Mathematics Tutor Fee",
      amount: "5,500 BDT",
      date: "May 15, 2026",
      method: "bKash",
      type: "credit", // tutor এর জন্য credit (আয়), student এর জন্য debit (ব্যয়)
      status: "success"
    },
    {
      id: "TXN-451029",
      tuitionTitle: "HSC Physics Tuition Advance",
      amount: "7,000 BDT",
      date: "May 02, 2026",
      method: "Nagad",
      type: "credit",
      status: "success"
    },
    {
      id: "TXN-110293",
      tuitionTitle: "Class 8 All Subjects Specialist Fee",
      amount: "4,500 BDT",
      date: "Apr 28, 2026",
      method: "Bank Transfer",
      type: "credit",
      status: "failed"
    },
    {
      id: "TXN-334012",
      tuitionTitle: "Admission Platform Premium Toolkit",
      amount: "1,200 BDT",
      date: "Apr 10, 2026",
      method: "bKash",
      type: "debit",
      status: "success"
    }
  ];

  const statusStyles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    failed: "bg-rose-50 text-rose-500 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  // সার্চ লজিক ফিল্টারিং
  const filteredTransactions = transactions.filter(txn =>
    txn.tuitionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">12,500 BDT</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-[#40bfff] rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Primary Method</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">bKash wallet</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Platform Fees Paid</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">1,200 BDT</h3>
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
          className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-[#40bfff]/20 outline-none transition-all text-sm"
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
              {filteredTransactions.length > 0 ? filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Title & ID */}
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-slate-800 font-black text-base">{txn.tuitionTitle}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ID: {txn.id}</p>
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
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${statusStyles[txn.status]}`}>
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
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400 font-black uppercase tracking-widest">
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