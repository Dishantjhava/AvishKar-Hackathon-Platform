
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import HackathonCard from "../components/hackathon/HackathonCard";
import CardSwap, { Card } from "../components/common/CardSwap";
import ScrollReveal from "../components/common/ScrollReveal";

const Home = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [highlightedCard, setHighlightedCard] = useState(null);

  /* Track window scroll progress for top indicator bar */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Listen for Navbar card selection highlight event */
  useEffect(() => {
    const handleHighlight = (e) => {
      const cardId = e.detail?.cardId;
      if (cardId) {
        setHighlightedCard(cardId);
        const timer = setTimeout(() => {
          setHighlightedCard(null);
        }, 2500);
        return () => clearTimeout(timer);
      }
    };
    window.addEventListener("highlight-card", handleHighlight);
    return () => window.removeEventListener("highlight-card", handleHighlight);
  }, []);

  /* Capstone-scale statistics */
  const statistics = [
    { label: "REGISTERED BUILDERS", value: "50+", subtext: "Active student developers" },
    { label: "TOTAL PRIZE POOL",    value: "₹2,00,000+", subtext: "Distributed in prizes" },
    { label: "HACKATHONS HOSTED",   value: "8+", subtext: "College events" },
    { label: "PROJECTS CREATED",    value: "25+", subtext: "Working prototypes" },
  ];

  const featuredHackathons = [
    {
      _id: "h1",
      title: "HackIndia 2026",
      theme: "AI / ML & Agents",
      mode: "Hybrid",
      prize: "₹5,00,000",
      deadline: "15 Aug 2026",
      teamSize: 4,
      status: "Open",
    },
    {
      _id: "h2",
      title: "FinTech Battle",
      theme: "Web3 & Blockchain",
      mode: "Online",
      prize: "₹2,50,000",
      deadline: "20 Aug 2026",
      teamSize: 3,
      status: "Open",
    },
    {
      _id: "h3",
      title: "GreenCode Summit",
      theme: "CleanTech & Sustainability",
      mode: "Offline",
      prize: "₹1,50,000",
      deadline: "01 Sep 2026",
      teamSize: 4,
      status: "Upcoming",
    },
  ];

  const whyParticipateItems = [
    {
      icon: "⚡",
      title: "Automated Evaluation & Judging",
      description: "Submit code and presentations with transparent, multi-criteria scoring from verified industry judges.",
    },
    {
      icon: "🤝",
      title: "Seamless Team Formation",
      description: "Find skilled teammates matching your stack (Frontend, Backend, AI/ML) and collaborate effortlessly.",
    },
    {
      icon: "🏆",
      title: "National Leaderboard & Recognition",
      description: "Earn platform rank, showcase winning projects to recruiters, and win cash prizes.",
    },
    {
      icon: "🎯",
      title: "Instant Event Hosting",
      description: "Organizers can create and launch a full hackathon with custom rules and prize pools in under 5 minutes.",
    },
  ];

  const previousWinners = [
    {
      project: "AgentFlow AI",
      hackathon: "HackIndia 2025 Winner",
      team: "NeuralSquad",
      prize: "₹3,00,000 Grand Prize",
      description: "Autonomous LLM agent system for automating complex code refactoring and PR reviews.",
    },
    {
      project: "PayShield Web3",
      hackathon: "FinTech Summit Winner",
      team: "CodeArchitects",
      prize: "₹1,50,000 1st Runner Up",
      description: "Zero-knowledge fraud detection pipeline for decentralized cross-border payments.",
    },
    {
      project: "EcoGrid IoT",
      hackathon: "GreenCode 2025 Winner",
      team: "CleanTechies",
      prize: "₹1,00,000 Innovation Award",
      description: "Smart solar grid balancer reducing microgrid power loss using IoT telemetry.",
    },
  ];

  const testimonials = [
    {
      quote: "AvishKar made hosting our college's hackathon event seamless. The live leaderboard and judging workflow saved us days of manual effort.",
      name: "Aarav M.",
      role: "Hackathon Organizer",
    },
    {
      quote: "We formed our team on AvishKar 2 days before registration closed and won 1st prize! The team management features are incredible.",
      name: "Riya P.",
      role: "Student Participant",
    },
  ];

  const brandLogos = ["NEXORA", "CIRCUITLABS", "BYTEFORGE", "QUANTIX", "VERTEXIO", "SYNAPSE", "CODEPULSE", "DEVMATRIX"];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] overflow-x-hidden relative transition-colors duration-200">
      {/* Dynamic Top Scroll Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#E02567] via-pink-500 to-amber-500 z-[100] transition-all duration-150 ease-out shadow-sm"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="hidden lg:flex items-center justify-between pointer-events-none absolute top-28 left-6 right-6 z-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 animate-float">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Registration open</span>
            <span className="text-[var(--text-muted)] font-normal">· just now</span>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 animate-float-slow">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">NEW</span>
            <span>HackIndia</span>
            <span className="text-[var(--text-muted)] font-normal">· 42 teams joined</span>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 animate-float">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-pink)]" />
            <span>+5 submissions</span>
            <span className="text-[var(--text-muted)] font-normal">· this morning</span>
          </div>
        </div>

        <ScrollReveal direction="up" className="text-center max-w-4xl mx-auto mb-14 relative z-10">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6">
            Where great hackathons <br className="hidden sm:inline" />
            <span className="font-accent-italic text-[var(--primary-pink)] font-normal inline-block hover:scale-105 transition-transform duration-300">meet great builders.</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal">
            The complete platform for college and industry hackathons. Host events, deploy automated evaluation, or discover top developer talent.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* FOR ORGANIZERS CARD */}
          <ScrollReveal direction="left" delay={100}>
            <div
              id="organizers"
              className={`
                scroll-mt-32 bg-[var(--dark-card)] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between border relative overflow-hidden group cursor-pointer transition-all duration-500 ease-out
                ${highlightedCard === "organizers"
                  ? "scale-[1.05] ring-4 ring-[#FF4D8C] border-[#FF4D8C] shadow-2xl shadow-pink-500/30 z-20 animate-pulse-glow"
                  : "border-slate-800 dark:border-slate-700/80 shadow-xl hover:border-[#FF4D8C]/50 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-500/10"
                }
              `}
            >
              <div className="relative z-10">
                <p className="text-[#FF4D8C] font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF4D8C] animate-pulse" />
                  FOR ORGANIZERS
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-white leading-tight">
                  Host your <span className="font-accent-italic text-[#FF4D8C] font-normal">next hackathon.</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-normal">
                  Create a fully configured hackathon in under 5 minutes. Manage registrations, set prize pools, and deploy automated judging workflows.
                </p>
              </div>
              <div className="relative z-10">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/dashboard/organizer")}
                  className="w-full sm:w-auto"
                >
                  Host a Hackathon →
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* FOR PARTICIPANTS CARD */}
          <ScrollReveal direction="right" delay={200}>
            <div
              id="participants"
              className={`
                scroll-mt-32 bg-[var(--pink-tint)] rounded-3xl p-8 sm:p-10 text-[var(--text-primary)] flex flex-col justify-between border relative overflow-hidden group cursor-pointer transition-all duration-500 ease-out
                ${highlightedCard === "participants"
                  ? "scale-[1.05] ring-4 ring-[#E02567] border-[#E02567] shadow-2xl shadow-pink-500/30 z-20 animate-pulse-glow"
                  : "border-pink-100 dark:border-pink-900/30 shadow-sm hover:border-[#E02567]/50 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/10"
                }
              `}
            >
              <div className="relative z-10">
                <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-pink)] animate-pulse" />
                  FOR PARTICIPANTS
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                  Find your <span className="font-accent-italic text-[var(--primary-pink)] font-normal">next build.</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-8 max-w-md font-normal">
                  Register directly for top college hackathons, form teams with skilled peers, submit projects, and climb live leaderboard rankings.
                </p>
              </div>
              <div className="relative z-10">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/hackathons")}
                  className="w-full sm:w-auto"
                >
                  Browse Hackathons →
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. STATISTICS COUNTER BAR */}
      <section className="py-12 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statistics.map((stat, idx) => (
              <ScrollReveal key={stat.label} direction="up" delay={idx * 100}>
                <div className="p-4 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                  <p className="font-heading text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-1">{stat.value}</p>
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xs text-[var(--text-secondary)] font-normal">{stat.subtext}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED HACKATHONS SECTION */}
      <section id="leaderboard" className="scroll-mt-28 py-20 px-6 md:px-12 bg-[var(--bg-page)]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                LIVE & UPCOMING
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
                Featured Hackathons
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/hackathons")}>
              View All Hackathons →
            </Button>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHackathons.map((h, idx) => (
              <ScrollReveal key={h.title} direction="up" delay={idx * 150}>
                <HackathonCard {...h} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY PARTICIPATE SECTION */}
      <section className="py-20 px-6 md:px-12 bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2">WHY AVISHKAR</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
              Built for serious builders & event organizers
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyParticipateItems.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 100}>
                <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#E02567]/40 hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 ease-out space-y-3 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-xl shadow-2xs group-hover:scale-125 group-hover:rotate-12 group-hover:border-[#E02567]/40 transition-all duration-300 animate-float">
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-[var(--text-primary)] text-base group-hover:text-[var(--primary-pink)] transition-colors">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-normal">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PREVIOUS WINNERS SPOTLIGHT (GLOWING CARDS IN DARK MODE) */}
      <section className="py-20 px-6 md:px-12 bg-[var(--bg-page)] border-t border-[var(--border-color)] overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <ScrollReveal direction="left" className="space-y-5">
            <div>
              <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span>🏆</span> HALL OF FAME
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                Previous Winners <br className="hidden sm:inline" />
                Showcase 🏆
              </h2>
            </div>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-normal max-w-md">
              Explore national hackathon winners. An interactive 3D deck powered by GSAP animations from React Bits. Click any card to inspect project details.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={() => navigate("/leaderboard")}>
                Explore All Projects →
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200} className="relative w-full min-h-[360px] flex items-center justify-center">
            {/* Multi-Layered Techy Backlight Aura for Light & Dark Modes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#E02567]/40 via-pink-400/30 to-amber-400/20 rounded-full blur-3xl opacity-80 dark:opacity-90 pointer-events-none animate-pulse-glow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl opacity-70 pointer-events-none" />

            <CardSwap
              width={440}
              height={310}
              cardDistance={45}
              verticalDistance={35}
              delay={3500}
              pauseOnHover={true}
              skewAmount={5}
              easing="elastic"
            >
              {previousWinners.map((winner, idx) => (
                <Card
                  key={winner.project}
                  className="p-6 rounded-2xl bg-[var(--bg-surface)] dark:bg-[#151922] border border-[var(--border-color)] dark:border-[#FF4D8C]/30 shadow-xl shadow-pink-500/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#E02567] dark:hover:border-[#FF4D8C] hover:shadow-2xl cursor-pointer"
                >
                  <div className="space-y-3 font-normal">
                    <div className="flex items-center justify-between">
                      <span className="inline-block text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        {winner.prize}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--text-primary)] opacity-70 uppercase tracking-wider">
                        WINNER #{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">{winner.project}</h3>
                    <p className="text-xs font-bold text-[var(--primary-pink)] uppercase tracking-wide">{winner.team} · {winner.hackathon}</p>
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] opacity-85 leading-relaxed font-normal">{winner.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-semibold">
                    <span>💡 Click card or hover to pause</span>
                    <span className="text-[var(--primary-pink)] font-bold">AvishKar →</span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-20 px-6 md:px-12 bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2">COMMUNITY STORIES</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
              Loved by hackers & organizers
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={t.name} direction={idx === 0 ? "left" : "right"} delay={idx * 150}>
                <div className="p-8 rounded-3xl bg-[var(--pink-tint)] border border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-800/50 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 ease-out space-y-4 cursor-pointer">
                  <p className="text-[var(--text-primary)] text-sm sm:text-base leading-relaxed italic font-normal">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-heading font-semibold text-[var(--text-primary)] text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-normal">{t.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FICTIONAL BRAND STRIP */}
      <section className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        <ScrollReveal direction="up" className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-8">
            The teams building what's next host on <span className="font-accent-italic text-[var(--primary-pink)] font-normal text-sm">AvishKar.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
            {brandLogos.map((logo) => (
              <span key={logo} className="font-heading font-semibold text-[var(--text-primary)] text-lg md:text-xl tracking-tighter hover:text-[var(--primary-pink)] hover:scale-110 transition-all duration-200 cursor-pointer">
                {logo}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Home;
