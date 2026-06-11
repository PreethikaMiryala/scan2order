import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import Brand from "../components/Brand";
import Button from "../components/Button";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";
import { getAccessKeyHint } from "../services/authService";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
  login,
  sessionExpired,
  authError,
  isAuthenticated,
} = useAuth();
  const [form, setForm] = useState({ email: "", password: "", accessKey: "" });
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
  if (isAuthenticated) {
    navigate("/admin/dashboard", { replace: true });
  }
}, [isAuthenticated, navigate]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-[#F6F4EE] text-[#1F1A17] lg:grid-cols-[1fr_0.85fr]">
      <section className="relative hidden overflow-hidden bg-[#1F1A17] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <motion.img initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.8 }} src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80" alt="Restaurant interior" className="absolute inset-0 h-full w-full object-cover opacity-36" />
        <div className="absolute inset-0 bg-[#1F1A17]/65" />
        <div className="relative"><Brand light /></div>
        <div className="relative max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/65">Private restaurant console</p>
          <h1 className="mt-4 font-serif-display text-6xl leading-none">Command the dining room with calm precision.</h1>
          <p className="mt-6 text-lg leading-8 text-white/72">Manage live table orders, seasonal menus, and table QR codes from one premium workspace.</p>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} onSubmit={handleSubmit} className="luxury-card w-full max-w-md rounded-3xl p-6 sm:p-8">
          <div className="lg:hidden"><Brand /></div>
          <ShieldCheck className="mt-8 h-9 w-9 text-[#C96A4A] lg:mt-0" />
          <h2 className="mt-5 font-serif-display text-4xl text-[#1F1A17]">Admin login</h2>
          <p className="mt-3 text-sm leading-6 text-[#1F1A17]/65">{getAccessKeyHint()}</p>
          {(sessionExpired || location.state?.expired) ? (
            <p className="mt-4 rounded-lg bg-[#C96A4A]/10 p-3 text-sm font-semibold text-[#9b3e28]">
              Your session expired. Please sign in again.
            </p>
          ) : null}
          {authError ? (
            <p className="mt-4 rounded-lg bg-[#B85C3E]/8 p-3 text-sm font-semibold text-[#B85C3E]">
              {authError}
            </p>
          ) : null}

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1F1A17]">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1F1A17]/45" />
                <input className="premium-input h-12 pl-12 pr-4" name="email" type="email" value={form.email} onChange={updateField} required />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1F1A17]">Password</span>
              <input className="premium-input h-12 px-4" name="password" type="password" value={form.password} onChange={updateField} required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1F1A17]">Access Key</span>
              <span className="relative block">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1F1A17]/45" />
                <input className="premium-input h-12 pl-12 pr-4" name="accessKey" type="password" value={form.accessKey} onChange={updateField} required />
              </span>
            </label>
          </div>

          <Button className="mt-6 w-full" disabled={loading}>{loading ? "Opening dashboard..." : "Login"}</Button>
          <GoogleLoginButton className="mt-3" />
          <Link to="/" className="mt-5 block text-center text-sm font-semibold text-[#1F1A17]">Return to landing page</Link>
        </motion.form>
      </main>
    </div>
  );
}

export default AdminLoginPage;
