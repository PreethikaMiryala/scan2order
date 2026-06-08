import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function GoogleLoginButton({ className = "" }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  // async function handleClick() {
  //   try {
  //     setLoading(true);
  //     await loginWithGoogle();
  //   } catch (error) {
  //     toast.error(error.message || "Google sign-in failed");
  //     setLoading(false);
  //   }
  // }
  async function handleClick() {
  try {
    console.log("GOOGLE LOGIN CLICKED");

    setLoading(true);

    const result = await loginWithGoogle();

    console.log("GOOGLE RESULT:", result);
  } catch (error) {
    console.error("GOOGLE ERROR:", error);

    toast.error(error.message || "Google sign-in failed");

    setLoading(false);
  }
}

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={loading}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className={`button-sweep flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#1F1A17]/15 bg-[#FFFDF9] px-5 text-sm font-semibold text-[#1F1A17] transition hover:border-[#1F1A17]/45 hover:shadow-lg hover:shadow-[#1F1A17]/8 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold text-[#C96A4A]">G</span>
      {loading ? "Opening Google..." : "Continue with Google"}
    </motion.button>
  );
}

export default GoogleLoginButton;
