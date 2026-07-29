import { useEffect, useState, useRef } from "react";

const GoogleAuthButton = ({ onSuccess, onError, role = "participant", label = "Continue with Google" }) => {
  const [loading, setLoading] = useState(false);
  const [gisError, setGisError] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!clientId) return;

    const scriptId = "google-gis-script";
    let script = document.getElementById(scriptId);

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              try {
                // SECURITY FIX: Send raw signed Google ID Token (credential) to backend for server-side verification.
                // Do NOT decode payload client-side or trust unverified request body fields.
                onSuccess({
                  credential: response.credential,
                  role,
                });
              } catch (err) {
                if (onError) onError(err);
              }
            },
            error_callback: () => {
              setGisError(true);
            },
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              width: "100%",
              text: "continue_with",
              shape: "rectangular",
            });
          }
        } catch {
          setGisError(true);
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      script.onerror = () => setGisError(true);
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGoogle();
    }
  }, [clientId, role, onSuccess, onError]);

  const handleDemoGoogleClick = () => {
    setLoading(true);
    setTimeout(() => {
      onSuccess({
        email: "dishant@avishkar.dev",
        name: "Dishant Jhava (Google)",
        picture: "https://lh3.googleusercontent.com/a/default-user",
        role,
      });
      setLoading(false);
    }, 500);
  };

  if (clientId && !gisError) {
    return (
      <div className="w-full flex flex-col items-center">
        <div ref={googleBtnRef} className="w-full min-h-[44px] flex items-center justify-center" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDemoGoogleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-200"
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.13C3.26 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.4l4-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span>{loading ? "Authenticating with Google..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
