
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import GoogleAuthButton from "../components/common/GoogleAuthButton";
import DotField from "../components/common/DotField";
import { signup as signupAPI, googleLogin as googleLoginAPI } from "../services/authService";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { ROLES } from "../utils/constants";
import { validateEmail, validatePassword } from "../utils/validators";

const Signup = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.PARTICIPANT,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setApiError("");
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "name") {
      setErrors((prev) => ({ ...prev, name: form.name.trim() ? "" : "Full name is required." }));
    }
    if (field === "email" && form.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
    }
    if (field === "password" && form.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(form.password) }));
    }
    if (field === "confirmPassword" && form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: form.confirmPassword !== form.password ? "Passwords do not match." : "",
      }));
    }
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

    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const nameErr    = form.name.trim() ? "" : "Full name is required.";
    const emailErr   = validateEmail(form.email);
    const passErr    = validatePassword(form.password);
    const confirmErr = form.confirmPassword !== form.password ? "Passwords do not match." : "";

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmErr });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await signupAPI({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      const { user, token } = res.data;
      login(user, token);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      navigate(redirect || "/dashboard");
    } catch (err) {
      if (!err.response) {
        setApiError("Cannot connect to server. Please verify your backend server is running (npm run dev).");
      } else {
        setApiError(err.response.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPrivilegedRole = form.role === ROLES.ORGANIZER || form.role === ROLES.JUDGE;

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
            <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">Create your account</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1 font-normal">Join India's premier hackathon network</p>
          </div>

          <div className="flex flex-col gap-1.5 mb-5 font-normal">
            <label htmlFor="role" className="text-xs font-semibold text-[var(--text-primary)]">
              Registering as <span className="text-[var(--primary-pink)]">*</span>
            </label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange("role")}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[var(--primary-pink)] cursor-pointer"
            >
              <option value={ROLES.PARTICIPANT}>Participant (Student / Developer)</option>
              <option value={ROLES.ORGANIZER}>Organizer (College / Tech Club)</option>
              <option value={ROLES.JUDGE}>Judge (Evaluator)</option>
            </select>

            {isPrivilegedRole && (
              <div className="mt-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] rounded-xl p-3 font-normal leading-relaxed">
                🛡️ <strong>Note:</strong> Organizer & Judge roles require Admin verification. New accounts start with Participant access until verified by an Admin.
              </div>
            )}
          </div>

          {/* Google OAuth Button */}
          <div className="mb-5">
            <GoogleAuthButton onSuccess={handleGoogleSuccess} role={form.role} label="Sign up with Google" />
          </div>

          {/* Accessible High-Contrast Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[var(--border-color)] w-full" />
            <span className="bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider absolute">
              OR REGISTER WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-normal">
            <Input
              id="name"
              label="Full name"
              value={form.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              error={touched.name ? errors.name : ""}
              required
              placeholder="Dishant Jhava"
            />

            <Input
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email ? errors.email : ""}
              required
              placeholder="you@example.com"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password ? errors.password : ""}
              required
              placeholder="Min 8 chars (1 letter & 1 number)"
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={touched.confirmPassword ? errors.confirmPassword : ""}
              required
              placeholder="Re-enter password"
            />

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
              {loading ? <Loader size="sm" /> : "Create Account →"}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-secondary)] font-normal">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--primary-pink)] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
