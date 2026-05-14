import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="font-sans">
      {/* Sticky Navbar */}
      
      {/* Dynamic Content */}
      <main className="min-h-[calc(100vh-300px)]">
        <Outlet />
      </main>
      
      {/* Footer */}
    </div>
  );
};

export default MainLayout;