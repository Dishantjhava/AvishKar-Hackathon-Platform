import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  /* Footer bar should ONLY be rendered on the landing page ("/") */
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Global Scroll Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#E02567] via-pink-500 to-amber-500 z-[100] transition-all duration-150 ease-out shadow-sm pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {isLandingPage && <Footer />}
    </div>
  );
};

export default MainLayout;
