import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import QuantityControl from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { currency } from "../utils/format";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [customerName, setCustomerName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [placing, setPlacing] = useState(false);

  const totalAmount = useMemo(() => subtotal, [subtotal]);

  const tableNumber = cart.table;

  async function handlePlaceOrder() {
    try {
      if (!cart.restaurantId) throw new Error("Missing restaurant context");
      if (!tableNumber) throw new Error("Missing table number");
      if (!cart.items.length) throw new Error("Cart is empty");

      setPlacing(true);
      const order = await placeOrder({
        restaurantId: cart.restaurantId,
        tableNumber,
        customerName: customerName.trim() ? customerName.trim() : null,
        items: cart.items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price || 0),
        })),
        totalAmount,
        specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : null,
      });

      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      toast.error(err?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header
        navClassName="min-h-20"
        actions={
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full border border-[#1F1A17]/15 px-3 py-2 text-sm font-medium text-[#1F1A17]">
              Table {tableNumber || "-"}
            </span>
          </div>
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
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80"}
                    alt={item.name}
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-32"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{item.category}</p>
                        <h2 className="mt-1 line-clamp-2 font-serif-display text-3xl leading-none text-[#1F1A17]">{item.name}</h2>
                      </div>
                      <button
                        className="shrink-0 rounded-full p-2 text-[#B85C3E] hover:bg-[#B85C3E]/8"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      />
                      <p className="font-semibold text-[#1F1A17]">{currency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1F1A17]">Customer name (optional)</span>
                  <input
                    className="premium-input h-12 w-full px-4"
                    placeholder="e.g., John"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </label>

                <textarea
                  className="premium-input min-h-32 w-full rounded-2xl px-4 py-3"
                  placeholder="Special instructions for the kitchen (optional)"
                  value={specialInstructions}
                  onChange={(event) => setSpecialInstructions(event.target.value)}
                />
              </div>
            </section>

            <aside className="luxury-card h-fit rounded-3xl p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="font-serif-display text-4xl text-[#1F1A17]">Order summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Table</span>
                  <strong>{tableNumber || "-"}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>{currency(subtotal)}</strong>
                </div>
                <div className="soft-divider" />
                <div className="text-base">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <strong>{currency(totalAmount)}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => navigate("/cart")}
                  disabled={placing}
                >
                  Back to Cart
                </Button>
                <Button className="w-full" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? "Placing order..." : "Place Order"}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckoutPage;

