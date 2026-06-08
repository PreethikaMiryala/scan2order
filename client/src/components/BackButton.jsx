import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full border border-[#D8D3C8] bg-[#F6F4EE] px-4 py-2 text-sm font-semibold text-[#1F1A17] shadow-[0_12px_32px_rgba(31,26,23,0.08)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-[#C96A4A]/45 hover:text-[#C96A4A] hover:shadow-[0_16px_36px_rgba(31,26,23,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C96A4A] active:translate-y-0 sm:px-5 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <span>Back</span>
    </button>
  );
}

export default BackButton;
