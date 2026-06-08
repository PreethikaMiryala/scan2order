import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, LogOut, Menu as MenuIcon, QrCode, ReceiptText } from "lucide-react";
import BackButton from "../components/BackButton";
import Brand from "../components/Brand";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Live Orders", icon: BarChart3 },
  { to: "/admin/menu", label: "Menu", icon: ReceiptText },
  { to: "/admin/qr-codes", label: "QR Codes", icon: QrCode },
];

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] lg:grid lg:grid-cols-[284px_1fr]">
      <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="sticky top-0 z-30 border-b border-[#1F1A17]/8 bg-[#FFFDF9]/76 px-4 py-4 shadow-[0_18px_50px_rgba(31,26,23,0.06)] backdrop-blur-2xl lg:h-screen lg:border-b-0 lg:border-r lg:px-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Brand />
          <MenuIcon className="h-6 w-6 text-[#1F1A17] lg:hidden" />
        </div>
        <nav className="mt-5 grid grid-cols-3 gap-2 lg:mt-10 lg:block lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-w-0 items-center justify-center gap-2 rounded-full px-2 py-3 text-xs font-semibold transition duration-300 sm:gap-3 sm:px-4 sm:text-sm lg:justify-start ${
                    isActive ? "bg-[#1F1A17] text-white shadow-lg shadow-[#1F1A17]/12" : "text-[#1F1A17] hover:-translate-y-0.5 hover:bg-[#1F1A17]/7 hover:shadow-[0_12px_28px_rgba(31,26,23,0.08)]"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" /> <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <Button variant="secondary" className="mt-5 hidden w-full lg:flex" onClick={handleLogout}>
          <LogOut size={17} /> Logout
        </Button>
      </motion.aside>
      <main className="min-w-0 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-7">
          <BackButton />
        </div>
        <Outlet />
      </main>
      <button
        onClick={handleLogout}
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#1F1A17] text-white shadow-xl lg:hidden"
        aria-label="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}

export default AdminLayout;
