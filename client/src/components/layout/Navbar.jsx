
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import TextType from "../common/TextType";

const Navbar = () => {
  const { isAuth, user, role, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "For organizers",   href: "/#organizers" },
    { label: "For participants", href: "/#participants" },
    { label: "Hackathons",       href: "/hackathons" },
    { label: "Leaderboard",      href: "/leaderboard" },
  ];

  const handleNavClick = (e, link) => {
    if (link.href === "/hackathons" || link.href === "/leaderboard") {
      e.preventDefault();
      navigate(link.href);
      return;
    }

    if (link.href.startsWith("/#")) {
      const targetId = link.href.replace("/#", "");
      e.preventDefault();

      const triggerHighlight = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        window.dispatchEvent(new CustomEvent("highlight-card", { detail: { cardId: targetId } }));
      };

      if (location.pathname === "/") {
        triggerHighlight();
      } else {
        navigate("/");
        setTimeout(triggerHighlight, 150);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    if (!role) return "/";
    return `/dashboard/${role}`;
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-6 md:px-12 py-3.5
        transition-all duration-200
        ${scrolled
          ? "bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-xs border-b border-[var(--border-color)]"
          : "bg-[var(--bg-surface)] border-b border-[var(--border-color)]"
        }
      `}
    >
      <Link to="/" className="flex items-center gap-1 group">
        <span className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-sans">
          AvishKar<span className="text-[var(--primary-pink)] font-black">:</span>
        </span>
      </Link>

      {/* Hide marketing links on Auth pages for 100% focused UX */}
      {!isAuthPage && (
        <ul className="hidden md:flex items-center gap-7 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-pink)] text-sm font-medium transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        {/* Sun/Moon Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="p-2 rounded-xl text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {isAuthPage ? (
          isLoginPage ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-[var(--text-secondary)] font-normal">Don't have an account?</span>
              <Link to="/signup" className="text-sm font-semibold text-[var(--primary-pink)] hover:underline">
                Sign up →
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-[var(--text-secondary)] font-normal">Already have an account?</span>
              <Link to="/login" className="text-sm font-semibold text-[var(--primary-pink)] hover:underline">
                Log in →
              </Link>
            </div>
          )
        ) : isAuth ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(getDashboardRoute())}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:opacity-90 transition-all capitalize cursor-pointer"
            >
              Role: <span className="text-[var(--primary-pink)] font-bold">{role}</span>
            </button>

            <Button
              variant="dark"
              size="sm"
              onClick={() => navigate(getDashboardRoute())}
            >
              My Dashboard →
            </Button>

            <Link to="/profile" title="View Profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-red-500 px-2 py-1 transition-colors cursor-pointer"
            >
              Sign out 🚪
            </button>
          </div>
        ) : (
          <>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-[var(--pink-tint)] text-[var(--primary-pink)] border border-pink-200 dark:border-pink-900/30 mr-1 min-w-[148px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-pink)] animate-ping opacity-75 shrink-0" />
              <TextType
                text={["New to AvishKar?", "Join in 30 seconds"]}
                as="span"
                typingSpeed={45}
                pauseDuration={1800}
                deletingSpeed={25}
                showCursor={true}
                cursorCharacter="|"
                loop={true}
                className="text-xs font-medium"
                textColors={["var(--primary-pink)"]}
              />
            </span>
            <Link
              to="/login"
              className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 transition-colors duration-150"
            >
              Log in
            </Link>
            <Button
              variant="dark"
              size="sm"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
