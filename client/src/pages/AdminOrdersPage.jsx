import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useSocketEvents } from "../hooks/useSocketEvents";
import { currency } from "../utils/format";

const statusOrder = ["NEW", "ACCEPTED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

function AdminOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchOrders, patchOrderStatus, createOrder } = useOrders();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const restaurantId = user?.restaurant_id;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!restaurantId) throw new Error("Restaurant id missing");
        setLoading(true);
        const { data } = await fetchOrders(restaurantId);
        if (mounted) setOrders(data || []);
      } catch (err) {
        toast.error(err?.message || "Unable to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [restaurantId, fetchOrders]);

  // Live events
  useSocketEvents({
    onNewOrder: (order) => {
      if (order.restaurantId && String(order.restaurantId) !== String(restaurantId)) return;
      setOrders((curr) => {
        if (curr.some((o) => o.id === order.id)) return curr;
        return [order, ...curr];
      });
    },
    onOrderStatusUpdated: (order) => {
      if (order.restaurantId && String(order.restaurantId) !== String(restaurantId)) return;
      setOrders((curr) => curr.map((o) => (o.id === order.id ? order : o)));
    },
  });

  const cards = useMemo(() => {
    const next = [...orders];
    next.sort((a, b) => {
      const ai = statusOrder.indexOf(a.status);
      const bi = statusOrder.indexOf(b.status);
      if (ai !== bi) return ai - bi;
      return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
    });
    return next;
  }, [orders]);

  async function changeStatus(orderId, status) {
    try {
      await patchOrderStatus(orderId, { status });
      setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err?.message || "Status update failed");
    }
  }

  const allowedNext = {
    NEW: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Orders</p>
          <h1 className="mt-3 font-serif-display text-5xl leading-none text-[#1F1A17] sm:text-6xl">Live incoming</h1>
          <p className="mt-2 text-sm text-[#1F1A17]/60">Updates instantly via Socket.IO.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/admin/dashboard")}>
          Back
        </Button>
      </header>

      {loading ? (
        <div className="mt-10">Loading orders...</div>
      ) : cards.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No orders yet" message="Customers will appear here instantly after placing an order." />
        </div>
      ) : (
        <section className="mt-10 grid gap-4 xl:grid-cols-2">
          <AnimatePresence initial={false}>
            {cards.map((order) => (
              <motion.article key={order.id} layout className="luxury-card rounded-3xl p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{order.id}</p>
                    <h3 className="mt-2 font-serif-display text-3xl text-[#1F1A17]">Table {order.table}</h3>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-4 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate">{item.quantity} x {item.name}</span>
                      <strong className="shrink-0">{currency(Number(item.price) * Number(item.quantity))}</strong>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-[#1F1A17]/6 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#1F1A17]/70">Total</span>
                    <strong className="text-[#1F1A17]">{currency(Number(order.totalAmount || 0))}</strong>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#1F1A17]/60">
                  Created: {new Date(order.createdAt || order.created_at || Date.now()).toLocaleString()}
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {allowedNext[order.status]?.includes("ACCEPTED") ? (
                    <Button className="w-full" onClick={() => changeStatus(order.id, "ACCEPTED")}>
                      <Check size={17} /> Accept
                    </Button>
                  ) : (
                    <Button className="w-full" disabled variant="secondary">Accept</Button>
                  )}

                  {allowedNext[order.status]?.includes("PREPARING") ? (
                    <Button variant="secondary" className="w-full" onClick={() => changeStatus(order.id, "PREPARING")}>
                      Preparing
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>Preparing</Button>
                  )}

                  {allowedNext[order.status]?.includes("READY") ? (
                    <Button variant="secondary" className="w-full" onClick={() => changeStatus(order.id, "READY")}>
                      Ready
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>Ready</Button>
                  )}

                  {allowedNext[order.status]?.includes("DELIVERED") ? (
                    <Button className="w-full" onClick={() => changeStatus(order.id, "DELIVERED")}>
                      Delivered
                    </Button>
                  ) : (
                    <Button className="w-full" disabled variant="secondary">Delivered</Button>
                  )}

                  {allowedNext[order.status]?.includes("CANCELLED") ? (
                    <Button variant="danger" className="w-full sm:col-span-2" onClick={() => changeStatus(order.id, "CANCELLED")}>
                      <X size={17} /> Cancel
                    </Button>
                  ) : (
                    <Button variant="danger" className="w-full sm:col-span-2" disabled>
                      <X size={17} /> Cancel
                    </Button>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

export default AdminOrdersPage;

