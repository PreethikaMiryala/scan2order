import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="inline-grid grid-cols-[40px_44px_40px] items-center overflow-hidden rounded-full border border-[#1F1A17]/15 bg-[#FFFDF9]">
      <button aria-label="Decrease quantity" className="grid h-10 place-items-center text-[#1F1A17] transition hover:bg-[#1F1A17]/8" onClick={onDecrease}>
        <Minus size={16} />
      </button>
      <span className="relative grid h-10 place-items-center overflow-hidden text-center text-sm font-semibold text-[#1F1A17]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={quantity} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.18 }}>
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>
      <button aria-label="Increase quantity" className="grid h-10 place-items-center text-[#1F1A17] transition hover:bg-[#1F1A17]/8" onClick={onIncrease}>
        <Plus size={16} />
      </button>
    </div>
  );
}

export default QuantityControl;
