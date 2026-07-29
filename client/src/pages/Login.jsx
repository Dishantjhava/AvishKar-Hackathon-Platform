
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import GoogleAuthButton from "../components/common/GoogleAuthButton";
import DotField from "../components/common/DotField";
import { login as loginAPI, googleLogin as googleLoginAPI } from "../services/authService";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { validateEmail } from "../utils/validators";

const Login = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.search.includes("session=expired")) {
      setSessionExpired(true);
    }
  }, [location.search]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setApiError("");
    setSessionExpired(false);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field) => () => {
    if (field === "email" && form.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
    }
    if (field === "password" && !form.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset instructions: Please contact your platform administrator or support team to reset your password.");
  };

  const handleGoogleSuccess = async (googlePayload) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await googleLoginAPI(googlePayload);
      const { user, token } = res.data;

      login(user, token);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      navigate(redirect || "/dashboard");
    } catch (err) {
      if (!err.response) {
        setApiError("Cannot connect to backend server. Please make sure the server is running (npm run dev).");
      } else {
        setApiError(err.response?.data?.message || "Google authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(form.email);
    const passErr  = form.password ? "" : "Password is required.";

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await loginAPI({ email: form.email, password: form.password });
      const { user, token } = res.data;

      login(user, token);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      navigate(redirect || "/dashboard");
    } catch (err) {
      if (!err.response) {
        setApiError("Cannot connect to server. Please verify your backend server is running (npm run dev).");
      } else {
        setApiError(
          err.response.data?.message || "Invalid email or password. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden transition-colors duration-200">
      {/* Theme-Aware High-Visibility DotField Background */}
      <DotField
        dotRadius={2.5}
        dotSpacing={16}
        cursorRadius={600}
        bulgeStrength={85}
        glowRadius={250}
        sparkle={true}
        waveAmplitude={1}
        gradientFrom={isDark ? "rgba(255, 77, 140, 0.45)" : "rgba(224, 37, 103, 0.75)"}
        gradientTo={isDark ? "rgba(224, 37, 103, 0.25)" : "rgba(255, 77, 140, 0.5)"}
        glowColor={isDark ? "rgba(255, 77, 140, 0.35)" : "rgba(224, 37, 103, 0.45)"}
      />

      <div className="w-full max-w-md relative z-10">
        <Card variant="light" padding="lg" className="shadow-2xl backdrop-blur-md bg-[var(--bg-surface)]/95 border border-[var(--border-color)] text-[var(--text-primary)]">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">Welcome back</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1 font-normal">Sign in to manage your hackathons & teams</p>
          </div>

          {sessionExpired && (
            <div className="mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs rounded-xl p-3.5 font-normal leading-relaxed">
              ⚠️ Your session has expired. Please sign in again to continue.
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mb-5">
            <GoogleAuthButton onSuccess={handleGoogleSuccess} label="Sign in with Google" />
          </div>

          {/* Accessible High-Contrast Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[var(--border-color)] w-full" />
            <span className="bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider absolute">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-normal">
            <Input
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={errors.email}
              required
              placeholder="you@example.com"
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-xs font-semibold text-[var(--text-primary)]">
                  Password <span className="text-[var(--primary-pink)]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-[var(--primary-pink)] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[var(--bg-surface)] text-[var(--text-primary)] ${
                  errors.password ? "border-red-500 bg-red-50/20" : "border-[var(--border-color)] focus:border-[var(--primary-pink)]"
                }`}
              />
              {errors.password && <p className="text-xs text-red-600 font-normal mt-1">{errors.password}</p>}
            </div>

            {apiError && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-xl px-4 py-3 font-normal leading-relaxed">
                ⚠ {apiError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2 cursor-pointer shadow-md"
              disabled={loading}
            >
              {loading ? <Loader size="sm" /> : "Sign in →"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-secondary)] font-normal">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[var(--primary-pink)] font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
