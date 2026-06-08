const styles = {
  New: "bg-[#C96A4A]/12 text-[#9b3e28]",
  Accepted: "bg-[#1F1A17]/12 text-[#1F1A17]",
  Preparing: "bg-[#C96A4A]/16 text-[#9b3e28]",
  DELIVERED: "bg-[#1F1A17]/12 text-[#1F1A17]",

  Cancelled: "bg-[#B85C3E]/12 text-[#B85C3E]", 
  CANCELLED_OLD: "bg-[#B85C3E]/12 text-[#B85C3E]",

  Rejected: "bg-[#B85C3E]/12 text-[#B85C3E]",
  CANCELLED: "bg-[#B85C3E]/12 text-[#B85C3E]",

  Paid: "bg-[#1F1A17]/12 text-[#1F1A17]",
  Pending: "bg-[#1F1A17]/10 text-[#1F1A17]",
};

function StatusBadge({ status }) {
  return (
    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${styles[status] || "bg-black/8 text-[#1F1A17]"}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
