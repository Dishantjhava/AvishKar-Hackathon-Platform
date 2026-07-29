import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
  direction = "up",
  once = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        } else {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold, once]);

  const transformInitialMap = {
    up: "translate-y-8 scale-95",
    down: "-translate-y-8 scale-95",
    left: "-translate-x-10 scale-95",
    right: "translate-x-10 scale-95",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${isVisible ? delay : 0}ms` }}
      className={`
        transition-all duration-700 ease-out
        ${isVisible
          ? "opacity-100 scale-100 translate-x-0 translate-y-0"
          : `opacity-0 ${transformInitialMap[direction] || "translate-y-8 scale-95"}`
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
