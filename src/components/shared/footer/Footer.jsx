import { FaFacebook, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaRegEnvelope, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
// Using a single reliable import source from react-icons/fa


// Separate import for X logo to ensure Vite finds it

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="bg-white border-t border-slate-100 pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Section 1: About Platform */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-[3px] border-[#40bfff] rounded-full border-t-transparent -rotate-45 transition-transform duration-500 group-hover:rotate-45"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              eTuition<span className="text-[#40bfff]">al</span>
            </span>
          </Link>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xs text-[15px]">
            eTuitional is a premium tuition management platform bridging the gap between expert tutors and students with automated security.
          </p>
          
          {/* Social Media - Requirement: New X Logo */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#40bfff] hover:text-white transition-all shadow-sm">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#40bfff] hover:text-white transition-all shadow-sm">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#40bfff] hover:text-white transition-all shadow-sm">
              <FaLinkedinIn size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#40bfff] hover:text-white transition-all shadow-sm">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Explore</h4>
          <ul className="space-y-4 font-semibold text-slate-500">
            <li><Link to="/" className="hover:text-[#40bfff] transition-colors">Home</Link></li>
            <li><Link to="/tuitions" className="hover:text-[#40bfff] transition-colors">Find Tuitions</Link></li>
            <li><Link to="/tutors" className="hover:text-[#40bfff] transition-colors">Find Tutors</Link></li>
            <li><Link to="/about" className="hover:text-[#40bfff] transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-4 font-semibold text-slate-500">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#40bfff] mt-1 shrink-0" size={16} />
              <span>Bogra, Rajshahi Division, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <FaRegEnvelope className="text-[#40bfff] shrink-0" size={16} />
              <span>support@etuitional.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#40bfff] shrink-0" size={16} />
              <span>+880 1700-000000</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Newsletter */}
        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Newsletter</h4>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 font-bold focus:ring-2 focus:ring-[#40bfff]/20 focus:bg-white outline-none transition-all"
            />
            <button className="absolute right-2 top-2 bg-[#40bfff] text-white p-2.5 rounded-lg hover:bg-[#3498db] shadow-md transition-all">
              <FaRegEnvelope size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Copyright Requirement */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-bold text-slate-400 text-sm">
          © {currentYear} eTuitionBD. All rights reserved.
        </p>
        <p className="font-bold text-slate-500 text-sm">
          Crafted by <span className="text-[#40bfff] font-black uppercase tracking-tighter">Monir</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;