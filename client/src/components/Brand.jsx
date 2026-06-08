import { Link } from "react-router-dom";

function Brand({ to = "/", light = false, className = "" }) {
  return (
    <Link
      to={to}
      className={`group flex min-w-0 items-center gap-3 rounded-full transition duration-300 ease-out hover:scale-[1.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c96a4a] ${className}`}
      aria-label="Scan2Order home"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${light ? "border-white/40 text-white" : "border-[#1F1A17]/20 text-[#1F1A17]"} font-serif-display text-lg`}>
        S2
      </span>
      <span className="min-w-0">
        <span className={`block truncate font-serif-display text-xl leading-none ${light ? "text-white" : "text-[#1F1A17]"}`}>
          Scan2Order
        </span>
        <span className={`block truncate text-[10px] uppercase tracking-[0.24em] ${light ? "text-white/70" : "text-[#1F1A17]/60"}`}>
          Maison Service
        </span>
      </span>
    </Link>
  );
}

export default Brand;
