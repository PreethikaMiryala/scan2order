import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import Button from "./Button";
import QuantityControl from "./QuantityControl";
import { currency } from "../utils/format";

function CartDrawer({ open, onClose, cart, subtotal, updateQuantity, removeItem }) {
  const isEmpty = cart.items.length === 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.button
            aria-label="Close cart"
            className="absolute inset-0 bg-[#1F1A17]/36 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute inset-x-3 bottom-3 mx-auto max-h-[86vh] max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#FFFDF9]/94 shadow-2xl shadow-[#1F1A17]/25 backdrop-blur-2xl md:inset-x-auto md:right-5 md:top-5 md:bottom-5 md:w-[430px]"
          >
            <div className="flex items-center justify-between border-b border-[#1F1A17]/8 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1F1A17] text-white">
                  <ShoppingBag size={18} />
                </span>
                <div>
                  <p className="section-kicker">Current order</p>
                  <h2 className="font-serif-display text-3xl leading-none text-[#1F1A17]">Your cart</h2>
                </div>
              </div>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#1F1A17]/7 text-[#1F1A17]" aria-label="Close cart drawer">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[48vh] space-y-3 overflow-y-auto p-5 md:max-h-[calc(100vh-250px)]">
              <AnimatePresence initial={false}>
                {isEmpty ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-sm text-[#1F1A17]/58">
                    Add a dish to begin the service.
                  </motion.p>
                ) : (
                  cart.items.map((item) => (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -18, filter: "blur(8px)" }}
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      className="grid grid-cols-[64px_1fr] gap-3 rounded-2xl bg-[#1F1A17]/[0.035] p-3"
                    >
                      <img src={item.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80"} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-serif-display text-xl leading-tight text-[#1F1A17]">{item.name}</h3>
                            <p className="mt-1 text-xs text-[#1F1A17]/55">{currency(item.price)}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs font-semibold text-[#B85C3E]">Remove</button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <QuantityControl quantity={item.quantity} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} />
                          <motion.strong key={item.quantity} initial={{ scale: 0.92, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-sm text-[#1F1A17]">
                            {currency(item.price * item.quantity)}
                          </motion.strong>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#1F1A17]/8 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#1F1A17]/58">Subtotal</span>
                <motion.strong key={subtotal} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif-display text-3xl text-[#1F1A17]">
                  {currency(subtotal)}
                </motion.strong>
              </div>
              <Link to="/cart" onClick={onClose}>
                <Button className="w-full" disabled={isEmpty}>Checkout</Button>
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default CartDrawer;
