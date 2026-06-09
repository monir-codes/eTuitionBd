import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, ChevronDown, GraduationCap, ShieldCheck, Wallet, UserCheck } from "lucide-react";

const FAQSection = () => {
  // কোন আকোর্ডিয়নটা ওপেন থাকবে তার স্টেট (ডিফল্ট প্রথমটা ওপেন থাকবে)
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      icon: <GraduationCap size={20} className="text-[#40bfff]" />,
      question: "How do I apply for a tuition post as a tutor?",
      answer: "First, create a tutor account and complete your profile details (qualification, institution, etc.). Once completed, browse the 'Tuitions' page, select a post that matches your skills, and click the 'Apply' button to submit your application directly to the student/parent."
    },
    {
      icon: <UserCheck size={20} className="text-emerald-500" />,
      question: "How long does it take to get verified as a tutor?",
      answer: "After submitting your credentials, our admin panel reviews your certificates and institutional identity. The verification process usually takes 12 to 24 hours. Once verified, a 'Verified Tutor' badge will appear on your profile, increasing your selection chances."
    },
    {
      icon: <Wallet size={20} className="text-amber-500" />,
      question: "Is there any matching fee, and how do I pay?",
      answer: "Students post requirements completely for free. For tutors, once you are selected for a tuition, you can securely pay the platform matching fee using our fully integrated Stripe debit/credit card gateway directly from your Dashboard."
    },
    {
      icon: <ShieldCheck size={20} className="text-indigo-500" />,
      question: "Can I cancel or modify my tuition application?",
      answer: "Yes, you can manage all your applications from your dashboard. You can withdraw or update your proposal text at any time, provided the application status is still 'pending' and has not been approved or processed by the student yet."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="py-20 bg-white select-none border-t border-slate-100"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="bg-blue-50 text-[#40bfff] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
            Have Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-4">
            Frequently Asked <span className="text-[#40bfff]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-bold mt-2">
            Clear answers to help tutors and students navigate eTuitionBD effortlessly.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`border rounded-2xl sm:rounded-[1.5rem] transition-all duration-300 ${
                  isOpen 
                    ? "bg-[#f0f9ff]/40 border-blue-100 shadow-lg shadow-blue-50/50" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Accordion Trigger/Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left outline-none focus:outline-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className={`p-2 rounded-xl transition-colors ${isOpen ? "bg-white shadow-sm" : "bg-slate-50"}`}>
                      {faq.icon}
                    </div>
                    <span className="font-black text-slate-700 text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Accordion Content Layout */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pl-14 sm:pl-16 text-slate-500 font-medium text-xs sm:text-sm leading-relaxed border-t border-slate-100/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;