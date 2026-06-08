import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import LoadingState from "../components/LoadingState";
import MenuItemCard from "../components/MenuItemCard";
import { CardSkeleton } from "../components/Skeleton";
import { useCart } from "../context/CartContext";
import { useMenu } from "../hooks/useMenu";

const CATEGORIES = [
  "All",
  "Main Course",
  "Starters",
  "Drinks",
  "Desserts",
  "Ice Cream",
  "Snacks",
  "Pastry",
  "Pizza",
  "Burger",
  "Chinese",
  "South Indian",
  "North Indian",
  "Beverages",
];

function CustomerMenuPage() {
  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const table = searchParams.get("table") || "1";
  const { items, loading, error } = useMenu(restaurantId);
  const { cart, addItem, updateQuantity } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory =
          category === "All" || item.category === category;
        const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
        return matchesCategory && text.includes(query.trim().toLowerCase());
      }),
    [items, category, query],
  );

  function quantityFor(itemId) {
    return cart.items.find((item) => item.id === itemId)?.quantity || 0;
  }

  function handleIncreaseQuantity(itemId) {
    const currentQuantity = quantityFor(itemId);
    updateQuantity(itemId, currentQuantity + 1);
  }

  function handleDecreaseQuantity(itemId) {
    const currentQuantity = quantityFor(itemId);
    updateQuantity(itemId, Math.max(0, currentQuantity - 1));
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE]">
      <Header
        actions={
          <span className="rounded-full border border-[#1F1A17]/15 px-3 py-2 text-sm font-medium text-[#1F1A17] sm:px-4">
            Table {table}
          </span>
        }
        navClassName="min-h-20"
      >
        <Link
          to="/"
          className="font-serif-display text-2xl leading-none text-[#1F1A17] transition duration-300 hover:text-[#C96A4A]"
        >
          Scan2Order
        </Link>
      </Header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-11 lg:px-10 lg:py-14">
        <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
          <BackButton />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1F1A17]/40"
            strokeWidth={1.6}
          />
          <input
            className="h-16 w-full rounded-full border border-[#1F1A17]/12 bg-[#FFFDF9] px-14 text-base text-[#1F1A17] outline-none transition duration-300 placeholder:text-[#1F1A17]/35 focus:border-[#C96A4A]/40 focus:bg-white focus:shadow-[0_10px_30px_rgba(31,26,23,0.06)]"
            placeholder="Search menu"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition duration-300 ${
                category === item
                  ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-lg shadow-[#1F1A17]/12"
                  : "border-[#1F1A17]/12 bg-transparent text-[#1F1A17] hover:border-[#1F1A17]/30 hover:bg-[#FFFDF9]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <>
            <LoadingState label="Loading menu" />
            <div className="mt-10 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </>
        ) : null}

        {/* Error */}
        {!loading && error ? (
          <div className="mt-10">
            <EmptyState title="Menu unavailable" message={error} />
          </div>
        ) : null}

        {/* Empty */}
        {!loading && !error && filteredItems.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No dishes found"
              message="Try another search or category."
            />
          </div>
        ) : null}

        {/* Items Grid */}
        {!loading && !error && filteredItems.length > 0 ? (
          <div className="mt-10 grid animate-[soft-rise_500ms_ease_both] gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={quantityFor(item.id)}
                onAdd={() => addItem(item, restaurantId, table)}
                onIncrease={() => handleIncreaseQuantity(item.id)}
                onDecrease={() => handleDecreaseQuantity(item.id)}
              />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default CustomerMenuPage;
