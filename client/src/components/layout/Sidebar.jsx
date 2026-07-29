
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Icon from "../common/Icon";

const Sidebar = () => {
  const { role, user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navByRole = {
    admin: [
      { section: "OVERVIEW", links: [{ label: "Analytics & Users", path: "/dashboard/admin", iconName: "analytics" }] },
      { section: "PLATFORM", links: [{ label: "Browse Hackathons", path: "/hackathons", iconName: "trophy" }] },
      { section: "ACCOUNT",  links: [{ label: "My Profile", path: "/profile", iconName: "profile" }] },
    ],
    organizer: [
      { section: "WORKSPACE", links: [{ label: "My Hackathons", path: "/dashboard/organizer", iconName: "dashboard" }] },
      { section: "EXPLORE",   links: [{ label: "Browse Events", path: "/hackathons", iconName: "trophy" }] },
      { section: "ACCOUNT",   links: [{ label: "My Profile", path: "/profile", iconName: "profile" }] },
    ],
    participant: [
      { section: "WORKSPACE", links: [{ label: "My Dashboard", path: "/dashboard/participant", iconName: "dashboard" }] },
      { section: "TEAM",      links: [{ label: "Team Roster", path: "/team", iconName: "users" }] },
      { section: "EXPLORE",   links: [{ label: "Browse Events", path: "/hackathons", iconName: "trophy" }] },
      { section: "ACCOUNT",   links: [{ label: "My Profile", path: "/profile", iconName: "profile" }] },
    ],
    judge: [
      { section: "WORKSPACE", links: [{ label: "Assigned Reviews", path: "/dashboard/judge", iconName: "judge" }] },
      { section: "EXPLORE",   links: [{ label: "Browse Events", path: "/hackathons", iconName: "trophy" }] },
      { section: "ACCOUNT",   links: [{ label: "My Profile", path: "/profile", iconName: "profile" }] },
    ],
  };

  const sections = navByRole[role] || navByRole.participant;

  return (
    <aside className="w-64 bg-[var(--bg-surface)] text-[var(--text-primary)] flex flex-col justify-between p-6 min-h-screen border-r border-[var(--border-color)] flex-shrink-0 transition-colors duration-200">
      <div>
        {/* Header & Logo with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <NavLink to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight font-sans uppercase text-[var(--text-primary)]">
              AvishKar<span className="text-[var(--primary-pink)] font-black">:</span>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="p-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface-elevated)] hover:opacity-80 transition-all cursor-pointer"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Profile Summary Card */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-2xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-[var(--text-primary)] text-xs truncate">{user?.name}</p>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--pink-tint)] text-[var(--primary-pink)] capitalize mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {sections.map((sec) => (
            <div key={sec.section}>
              <p className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                {sec.section}
              </p>
              <div className="space-y-1">
                {sec.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[var(--pink-tint)] text-[var(--primary-pink)] border border-[#E02567]/20 shadow-2xs font-bold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                      }`
                    }
                  >
                    <Icon name={link.iconName} className="w-4 h-4 text-current" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Icon name="logout" className="w-4 h-4 text-current" />
            <span>Sign out</span>
          </span>
          <span>→</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
