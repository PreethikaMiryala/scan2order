import { useCart } from "../context/CartContext";

export default function CartBadge() {
  const { itemCount } = useCart();
  if (!itemCount) return null;

  return (
    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C96A4A] px-1 text-[11px] font-bold text-white">
      {itemCount}
    </span>
  );
}

