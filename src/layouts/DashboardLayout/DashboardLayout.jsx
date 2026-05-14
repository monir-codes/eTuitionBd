import { Outlet, Link, NavLink } from "react-router-dom";
import { FaHome, FaUser, FaBook, FaPlusCircle, FaHistory, FaUsers, FaThList } from "react-icons/fa";

const DashboardLayout = () => {
  // এই রোলটি আমরা পরবর্তীতে Context বা JWT থেকে পাবো (Admin/Student/Tutor)
  const role = "student"; 

  return (
    <div className="drawer lg:drawer-open font-sans">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col bg-slate-50">
        {/* Dashboard Top Navbar (Mobile only toggle) */}
        <div className="w-full navbar bg-white shadow-sm lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-primary italic text-xl">eTuitionBd</div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div> 

      {/* Sidebar Content */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-white text-base-content border-r">
          {/* Logo Section */}
          <div className="mb-10 px-4 py-2">
            <Link to="/" className="text-2xl font-bold text-primary italic">eTuitionBd</Link>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{role} Dashboard</p>
          </div>

          {/* Student Routes */}
          {role === 'student' && (
            <>
              <li><NavLink to="/dashboard/my-tuitions"><FaBook /> My Tuitions</NavLink></li>
              <li><NavLink to="/dashboard/post-tuition"><FaPlusCircle /> Post New Tuition</NavLink></li>
              <li><NavLink to="/dashboard/applied-tutors"><FaUsers /> Applied Tutors</NavLink></li>
              <li><NavLink to="/dashboard/payments"><FaHistory /> Payments</NavLink></li>
            </>
          )}

          {/* Tutor Routes */}
          {role === 'tutor' && (
            <>
              <li><NavLink to="/dashboard/my-applications"><FaHistory /> My Applications</NavLink></li>
              <li><NavLink to="/dashboard/ongoing-tuitions"><FaBook /> Ongoing Tuitions</NavLink></li>
              <li><NavLink to="/dashboard/revenue"><FaHistory /> Revenue History</NavLink></li>
            </>
          )}

          {/* Admin Routes */}
          {role === 'admin' && (
            <>
              <li><NavLink to="/dashboard/manage-users"><FaUsers /> User Management</NavLink></li>
              <li><NavLink to="/dashboard/manage-tuitions"><FaThList /> Tuition Management</NavLink></li>
              <li><NavLink to="/dashboard/reports"><FaHistory /> Reports & Analytics</NavLink></li>
            </>
          )}

          {/* Shared Routes */}
          <div className="divider my-4"></div>
          <li><NavLink to="/dashboard/profile"><FaUser /> Profile Settings</NavLink></li>
          <li><NavLink to="/"><FaHome /> Back to Home</NavLink></li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;