import { motion } from "framer-motion";

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-[#1F1A17] text-white hover:bg-[#B85C3E] shadow-[0_18px_40px_rgba(31,26,23,0.18)]",
    secondary: "bg-[#FFFDF9]/88 text-[#1F1A17] border border-[#D8D3C8] hover:border-[#B85C3E]/30 hover:bg-[#FFFDF9]",
    accent: "bg-[#C96A4A] text-white hover:bg-[#B85C3E] shadow-[0_18px_40px_rgba(201,106,74,0.18)]",
    ghost: "text-[#1F1A17] hover:bg-[#1F1A17]/7",
    danger: "bg-[#B85C3E] text-white hover:bg-[#651818]",
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={`button-sweep motion-safe inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
