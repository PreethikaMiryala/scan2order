import { Check, DollarSign, History, Table2, TimerReset, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../components/Button";
import AnimatedCounter from "../components/AnimatedCounter";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { buildLocalAdminStats } from "../services/adminStatsService";
import { currency } from "../utils/format";

function AdminDashboardPage() {
  const { user } = useAuth();
  const {
  orders = [],
  liveOrders = [],
  history = [],
  setStatus = () => {}
} = useOrders() || {};
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeLiveOrders = Array.isArray(liveOrders) ? liveOrders : [];
  const safeHistory = Array.isArray(history) ? history : [];

  const stats =
    buildLocalAdminStats(safeOrders) || {
      activeOrders: 0,
      revenue: 0,
      tablesActive: 0,
      totalOrders: 0,
    };
  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">Live service</p>
          <h1 className="mt-3 font-serif-display text-5xl leading-none text-[#1F1A17] sm:text-6xl">Good evening, chef.</h1>
          <p className="mt-2 text-sm text-[#1F1A17]/60">Restaurant ID: {user?.restaurant_id || "Not available"}</p>
        </div>
      </header>

      <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={TimerReset} label="Active orders" value={stats.activeOrders} />
        <Metric icon={DollarSign} label="Revenue" value={stats.revenue} formatter={currency} />
        <Metric icon={Table2} label="Tables active" value={stats.tablesActive} />
        <Metric icon={Check} label="Today's orders" value={stats.totalOrders} />
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-serif-display text-4xl text-[#1F1A17]">Live orders</h2>
        </div>
        {safeLiveOrders.length === 0 ? (
          <EmptyState title="No active orders" message="New customer checkouts will appear here immediately after they are placed." />
        ) : (
          <motion.div layout className="grid gap-4 xl:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {safeLiveOrders.map((order) => (
              <motion.article key={order.id} layout whileHover={{ y: -4 }} className="luxury-card rounded-3xl p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{order.id}</p>
                    <h3 className="mt-2 font-serif-display text-3xl text-[#1F1A17]">Table {order.table}</h3>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status={order.paymentStatus || "Pending"} />
                  <span className="rounded-full bg-[#1F1A17]/6 px-3 py-1 text-xs font-semibold text-[#1F1A17]">{order.paymentType}</span>
                </div>
                <div className="mt-5 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate">{item.quantity} x {item.name}</span>
                      <strong className="shrink-0">{currency(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                {order.notes ? <p className="mt-4 rounded-lg bg-[#1F1A17]/6 p-3 text-sm text-[#1F1A17]/70">{order.notes}</p> : null}
                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <Button className="w-full" onClick={() => setStatus(order.id, "Accepted")}><Check size={17} /> Accept</Button>
                  <Button variant="secondary" className="w-full" onClick={() => setStatus(order.id, "Preparing")}>Prepare</Button>
                  <Button variant="secondary" className="w-full" onClick={() => setStatus(order.id, "Completed", { paymentStatus: order.paymentType === "Pay Now" ? "Paid" : order.paymentStatus })}>Complete</Button>
                  <Button variant="danger" className="w-full" onClick={() => setStatus(order.id, "Cancelled")}><X size={17} /> Cancel</Button>
                </div>
              </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center gap-3">
          <History className="h-6 w-6 text-[#C96A4A]" />
          <h2 className="font-serif-display text-4xl text-[#1F1A17]">Order history</h2>
        </div>
        {safeHistory.length === 0 ? (
          <EmptyState title="No completed orders" message="Completed, cancelled, and rejected orders will collect here for service review." />
        ) : (
          <div className="grid gap-3">
            {safeHistory.map((order) => (
              <article key={order.id} className="premium-surface grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="break-words text-xs uppercase tracking-[0.18em] text-[#C96A4A]">{order.id}</p>
                  <p className="mt-1 font-serif-display text-xl text-[#1F1A17]">Table {order.table}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="font-semibold text-[#1F1A17]">{currency(order.total)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, formatter }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="luxury-card rounded-3xl p-6">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1F1A17]/7">
        <Icon className="h-6 w-6 text-[#C96A4A]" />
      </span>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[#1F1A17]/55">{label}</p>
      <p className="mt-2 break-words font-serif-display text-4xl leading-none text-[#1F1A17]">
        <AnimatedCounter value={value} formatter={formatter} />
      </p>
    </motion.article>
  );
}

export default AdminDashboardPage;
