
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, role } = useAuth();

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] font-sans text-[var(--text-primary)] transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-muted)] font-bold text-sm">‹</span>
            <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">{role} Dashboard</span>
          </div>

          <div className="flex items-center gap-3 font-normal">
            <Link
              to="/hackathons"
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-2xs hover:opacity-90 transition-all"
            >
              Browse Events →
            </Link>

            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
