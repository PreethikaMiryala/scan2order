import { SearchX } from "lucide-react";

function EmptyState({ title, message, action }) {
  return (
    <div className="luxury-card rounded-3xl px-6 py-14 text-center">
      <SearchX className="mx-auto h-10 w-10 text-[#C96A4A]" />
      <h3 className="mt-4 font-serif-display text-3xl text-[#1F1A17]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#1F1A17]/65">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
