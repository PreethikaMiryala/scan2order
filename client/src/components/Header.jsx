import { motion } from "framer-motion";
import Brand from "./Brand";

const positionStyles = {
  fixed: "fixed inset-x-0 top-0 z-40",
  sticky: "sticky top-0 z-30",
  static: "relative z-20",
};

const surfaceStyles = {
  glass: "header-glass",
  dark: "border border-white/14 shadow-2xl shadow-black/10 backdrop-blur-2xl",
  transparent: "",
};

function Header({
  actions,
  brandLight = false,
  children,
  className = "",
  navClassName = "",
  position = "sticky",
  style,
  surface = "glass",
}) {
  return (
    <header className={`${positionStyles[position] || positionStyles.sticky} ${className}`}>
      <motion.nav
        style={style}
        className={`page-shell flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-5 ${surfaceStyles[surface] || surfaceStyles.glass} ${navClassName}`}
      >
        <Brand light={brandLight} />
        {children ? <div className="hidden min-w-0 items-center justify-center gap-6 text-sm font-medium md:flex">{children}</div> : null}
        <div className="flex shrink-0 items-center justify-end gap-2">
          {actions}
        </div>
      </motion.nav>
    </header>
  );
}

export default Header;
