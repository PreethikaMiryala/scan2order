import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../components/Button";
import Header from "../components/Header";

function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#1F1A17] px-4 py-24 text-white">
      <Header position="fixed" surface="transparent" brandLight navClassName="bg-transparent px-0 py-4 shadow-none" />
      <section className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/8 p-6 text-center shadow-2xl backdrop-blur sm:p-10">
        <CheckCircle2 className="mx-auto h-16 w-16 animate-pulse text-[#F6F4EE]" />
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/65">Order received</p>
        <h1 className="mt-3 font-serif-display text-4xl sm:text-5xl">Thank you.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-white/72">Your order is now with the restaurant team. Estimated preparation time is 18-25 minutes.</p>
        <div className="mt-8 grid gap-3 rounded-2xl bg-[#F6F4EE] p-5 text-left text-[#1F1A17] sm:grid-cols-2">
          <Detail label="Order ID" value={order.id} />
          <Detail label="Table" value={order.table} />
          <Detail label="Payment" value={order.paymentType} />
          <Detail label="Status" value={order.status} />
        </div>
        <Link to={`/menu/${order.restaurantId}?table=${order.table}`} className="mt-8 inline-flex">
          <Button variant="secondary">Order More</Button>
        </Link>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C96A4A]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#1F1A17]">{value}</p>
    </div>
  );
}

export default OrderSuccessPage;
