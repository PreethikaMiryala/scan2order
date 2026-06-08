import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import QuantityControl from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { currency } from "../utils/format";

function CartPage() {
  const navigate = useNavigate();
  const { cart, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [notes, setNotes] = useState("");
  const [paymentType, setPaymentType] = useState("Pay Later");
  const service = subtotal > 0 ? subtotal * 0.05 : 0;
  const total = subtotal + service;

  function handlePlaceOrder() {
    const order = placeOrder({
      restaurantId: cart.restaurantId,
      table: cart.table || "1",
      items: cart.items,
      notes,
      paymentType,
      paymentStatus: paymentType === "Pay Now" ? "Pending" : "Pay Later",
      subtotal,
      total,
      status: "New",
    });
    clearCart();
    navigate("/order-success", { state: { order } });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header
        navClassName="min-h-20"
        actions={
          <Link
            to={cart.restaurantId ? `/menu/${cart.restaurantId}?table=${cart.table || 1}` : "/"}
            className="rounded-full px-3 py-2 text-sm font-semibold text-[#1F1A17] transition duration-300 hover:bg-[#1F1A17]/7 hover:text-[#C96A4A] sm:px-4"
          >
            Menu
          </Link>
        }
      />
      <main className="page-shell py-10 sm:py-16">
        <BackButton />
        <h1 className="mt-5 font-serif-display text-5xl leading-none text-[#1F1A17] sm:text-6xl">Checkout</h1>

        {cart.items.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Your cart is empty" message="Add a few dishes from the menu before placing an order." />
          </div>
        ) : (
          <div className="mt-10 grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-4">
              {cart.items.map((item) => (
                <motion.article key={item.id} layout className="luxury-card flex gap-4 rounded-2xl p-4 sm:p-5">
                  <img src={item.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80"} alt={item.name} className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-32" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{item.category}</p>
                        <h2 className="mt-1 line-clamp-2 font-serif-display text-3xl leading-none text-[#1F1A17]">{item.name}</h2>
                      </div>
                      <button className="shrink-0 rounded-full p-2 text-[#B85C3E] hover:bg-[#B85C3E]/8" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <QuantityControl quantity={item.quantity} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} />
                      <p className="font-semibold text-[#1F1A17]">{currency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
              <textarea className="premium-input min-h-32 rounded-2xl px-4 py-3" placeholder="Notes for the kitchen" value={notes} onChange={(event) => setNotes(event.target.value)} />
            </section>

            <aside className="luxury-card h-fit rounded-3xl p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="font-serif-display text-4xl text-[#1F1A17]">Order summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between"><span>Table</span><strong>{cart.table || "1"}</strong></div>
                <div className="flex justify-between"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
                <div className="flex justify-between"><span>Service</span><strong>{currency(service)}</strong></div>
                <div className="soft-divider" />
                <div className="text-base"><div className="flex justify-between"><span>Total</span><strong>{currency(total)}</strong></div></div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-2">
                {["Pay Now", "Pay Later"].map((option) => (
                  <button key={option} onClick={() => setPaymentType(option)} className={`min-h-12 rounded-full border text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${paymentType === option ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-lg shadow-[#1F1A17]/14" : "border-[#1F1A17]/12 bg-[#FFFDF9]/78 text-[#1F1A17]"}`}>
                    {option}
                  </button>
                ))}
              </div>
              <Button className="mt-6 w-full" onClick={handlePlaceOrder}>Place Order</Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
