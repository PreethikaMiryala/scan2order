import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Button from "../components/Button";
import { useOrders } from "../context/OrderContext";
import { useSocketEvents } from "../hooks/useSocketEvents";
import { currency } from "../utils/format";

function OrderTrackingPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        if (mounted) setOrder(data);
      } catch (err) {
        toast.error(err?.message || "Unable to load order");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [orderId, getOrderById]);

  useSocketEvents({
    onNewOrder: (o) => {
      if (String(o.id) === String(orderId)) setOrder(o);
    },
    onOrderStatusUpdated: (o) => {
      if (String(o.id) === String(orderId)) setOrder(o);
    },
  });

  const currentStatus = order?.status;

  const statusTimeline = useMemo(() => ["NEW", "ACCEPTED", "PREPARING", "READY", "DELIVERED", "CANCELLED"], []);

  if (loading && !order) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#1F1A17] px-4 py-24 text-white">
        <Header position="fixed" surface="transparent" brandLight navClassName="bg-transparent px-0 py-4 shadow-none" />
        <div className="mt-20">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#1F1A17] px-4 py-24 text-white">
        <Header position="fixed" surface="transparent" brandLight navClassName="bg-transparent px-0 py-4 shadow-none" />
        <div className="mt-20">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#1F1A17] px-4 py-24 text-white">
      <Header position="fixed" surface="transparent" brandLight navClassName="bg-transparent px-0 py-4 shadow-none" />
      <section className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/8 p-6 text-center shadow-2xl backdrop-blur sm:p-10">
        <CheckCircle2 className="mx-auto h-16 w-16 animate-pulse text-[#F6F4EE]" />
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/65">Order tracking</p>
        <h1 className="mt-3 font-serif-display text-4xl sm:text-5xl">{order.id}</h1>

        <div className="mt-8 grid gap-3 rounded-2xl bg-[#F6F4EE] p-5 text-left text-[#1F1A17] sm:grid-cols-2">
          <Detail label="Order ID" value={order.id} />
          <Detail label="Table" value={order.table} />
          <Detail label="Total" value={currency(Number(order.totalAmount || 0))} />
          <Detail label="Status" value={order.status} />
        </div>

        <div className="mt-6 text-left">
          <p className="text-sm font-semibold">Live status</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusTimeline
              .filter((s) => s !== "CANCELLED")
              .map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                    statusProgressClass(s, currentStatus)
                  }`}
                >
                  {s}
                </span>
              ))}
            {currentStatus === "CANCELLED" ? (
              <span className="rounded-full bg-[#B85C3E]/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">CANCELLED</span>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <Link to={`/menu/table/${order.table}`} className="inline-flex">
            <Button variant="secondary">Order More</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function statusProgressClass(step, current) {
  const steps = ["NEW", "ACCEPTED", "PREPARING", "READY", "DELIVERED"];
  const si = steps.indexOf(step);
  const ci = steps.indexOf(current);
  if (ci === -1) return "bg-[#1F1A17]/6 text-[#1F1A17]/70";
  if (si < ci) return "bg-[#1F1A17]/12 text-[#1F1A17]";
  if (si === ci) return "bg-[#1F1A17] text-white";
  return "bg-[#1F1A17]/6 text-[#1F1A17]/70";
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#1F1A17]">{value}</p>
    </div>
  );
}

export default OrderTrackingPage;

