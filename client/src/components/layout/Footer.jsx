import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--bg-surface)] text-[var(--text-main)] border-t border-[var(--border-color)] transition-colors duration-300 pt-16 pb-10 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Glow Blob */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--primary-pink)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Newsletter Banner */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[var(--bg-app)] to-[var(--bg-surface)] border border-[var(--border-color)] mb-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-main)] mb-2 font-display">
              Stay ahead in upcoming hackathons 🚀
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Get notified about new high-prize hackathons, team invitations, and tech challenges directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-pink)] transition-all min-w-[260px]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E02567] to-pink-600 hover:from-pink-600 hover:to-[#E02567] text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-pink-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {subscribed ? "✓ Subscribed!" : "Subscribe Now"}
            </button>
          </form>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <span className="text-3xl font-black tracking-tight text-[var(--text-main)] font-sans">
                AvishKar<span className="text-[var(--primary-pink)] font-black">:</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
              India's premier hackathon management platform built for organizers, student builders, hackers, and industry judges.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Dishantjhava/AvishKar-Hackathon-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[var(--bg-app)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-pink)] hover:border-[var(--primary-pink)]/40 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[var(--bg-app)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-pink)] hover:border-[var(--primary-pink)]/40 transition-all duration-200"
                aria-label="Discord"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[var(--bg-app)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-pink)] hover:border-[var(--primary-pink)]/40 transition-all duration-200"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-4 font-display">
              PLATFORM
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/hackathons" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  Browse Hackathons
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/organizer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  Create Hackathon
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  Team Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Community */}
          <div>
            <h4 className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-4 font-display">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  Discord Server
                </a>
              </li>
              <li>
                <a href="https://github.com/Dishantjhava/AvishKar-Hackathon-Platform" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <button onClick={() => setActiveModal("blog")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left">
                  Tech Blog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal("mentors")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left">
                  Become a Judge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div>
            <h4 className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-4 font-display">
              LEGAL & SUPPORT
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveModal("privacy")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal("terms")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal("contact")} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <p>© 2026 AvishKar. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <p>Built with 💖 for high-growth tech teams & builders.</p>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-pink)] hover:border-[var(--primary-pink)]/40 transition-all cursor-pointer flex items-center gap-1.5 font-medium ml-2"
              title="Scroll to Top"
            >
              <span>Back to top</span>
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Privacy Policy</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  AvishKar respects your privacy. We collect minimal telemetry required to deliver hackathon management, user authentication, and project submission services. Your personal data is encrypted and never sold to third parties.
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Terms of Service</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  By participating in hackathons hosted on AvishKar, you agree to maintain code originality, abide by code-of-conduct guidelines, and respect judging criteria. Plagiarism results in immediate disqualification.
                </p>
              </div>
            )}

            {activeModal === "contact" && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Contact Support</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  Need help organizing a hackathon or technical assistance?
                </p>
                <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-color)] text-xs text-[var(--text-main)] space-y-1">
                  <p><strong>Email:</strong> support@avishkar.dev</p>
                  <p><strong>Community:</strong> discord.gg/avishkar</p>
                  <p><strong>Hours:</strong> Mon - Sat, 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>
            )}

            {activeModal === "blog" && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">AvishKar Tech Blog</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Discover guides on building AI agents, winning hackathon pitches, effective team formation, and web3 architecture. Articles are published weekly by leading developers.
                </p>
              </div>
            )}

            {activeModal === "mentors" && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Become an Event Judge</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Experienced engineer or founder? Apply to evaluate hackathon submissions on AvishKar. Select "Judge" as your role upon signup or email mentors@avishkar.dev.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-[var(--primary-pink)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
