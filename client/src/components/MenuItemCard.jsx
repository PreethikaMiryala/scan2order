import { Utensils } from "lucide-react";
import { currency } from "../utils/format";
import QuantityControl from "./QuantityControl";

function MenuItemCard({ item, quantity = 0, onAdd, onIncrease, onDecrease }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#1F1A17]/10 bg-[#FFFDF9] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#1F1A17]/18 hover:shadow-[0_18px_45px_rgba(31,26,23,0.08)]">
      <div className="aspect-[1.16] overflow-hidden bg-[#1F1A17]/5">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="grid h-full place-items-center text-[#1F1A17]/38">
            <Utensils size={34} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <h3 className="min-w-0 font-serif-display text-[1.65rem] leading-[1.08] text-[#1F1A17]">
            {item.name}
          </h3>
          <p className="shrink-0 pt-1 text-sm font-semibold text-[#1F1A17]">{currency(item.price)}</p>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#1F1A17]/58">{item.description}</p>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={onAdd}
            className="mt-6 min-h-11 w-full rounded-full bg-[#1F1A17] px-5 text-sm font-medium text-white transition duration-300 ease-out hover:bg-[#1d3026] active:scale-[0.985]"
          >
            Add to cart
          </button>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3">
            <QuantityControl quantity={quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
            <p className="text-xs font-medium text-[#1F1A17]/55">
              Subtotal: <span className="font-semibold text-[#1F1A17]">{currency(item.price * quantity)}</span>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default MenuItemCard;
