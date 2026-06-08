import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onCancel, onConfirm, loading = false }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[#1F1A17]/50 p-4 backdrop-blur-md">
          <motion.section initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="luxury-card w-full max-w-md rounded-3xl p-6">
            <h2 className="font-serif-display text-4xl text-[#1F1A17]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#1F1A17]/65">{message}</p>
            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
              <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Working..." : confirmLabel}</Button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
