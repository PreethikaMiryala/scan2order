import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Download, ExternalLink, Plus, Trash2 } from "lucide-react";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { createQrCode, getQrCodes, saveQrCodes } from "../services/qrService";

function QrManagementPage() {
  const { restaurantId } = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [codes, setCodes] = useState(() => getQrCodes());
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    saveQrCodes(codes);
  }, [codes]);

  const restaurantCodes = codes.filter((code) => String(code.restaurantId) === String(restaurantId));

  async function handleGenerate(event) {
    event.preventDefault();
    if (!restaurantId) {
      toast.error("Restaurant ID is not available. Please log in again.");
      return;
    }
    if (!tableNumber.trim()) {
      toast.error("Add a table number first.");
      return;
    }
    const normalizedTable = tableNumber.trim();
    const exists = restaurantCodes.some((code) => String(code.tableNumber).toLowerCase() === normalizedTable.toLowerCase());
    if (exists) {
      toast.error("A QR code for this table already exists.");
      return;
    }

    try {
      setCreating(true);
      const code = await createQrCode({ restaurantId, tableNumber: normalizedTable });
      setCodes((current) => [code, ...current]);
      setTableNumber("");
      toast.success(`QR created for table ${code.tableNumber}`);
    } catch (err) {
      toast.error(err.message || "Unable to create QR code");
    } finally {
      setCreating(false);
    }
  }

  function deleteCode() {
    if (!deleteTarget) return;
    setCodes((current) => current.filter((code) => code.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("QR code removed");
  }

  function downloadCode(code) {
    const link = document.createElement("a");
    link.href = code.dataUrl;
    link.download = `scan2order-table-${code.tableNumber}.png`;
    link.click();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="section-kicker">QR code management</p>
          <h1 className="mt-3 font-serif-display text-5xl leading-none text-[#1F1A17] sm:text-6xl">Tables that open the menu.</h1>
        </div>
        <form onSubmit={handleGenerate} className="luxury-card flex w-full flex-col gap-3 rounded-3xl p-3 sm:flex-row lg:max-w-xl">
          <input className="premium-input h-12 px-4" placeholder="Table number" value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} />
          <Button className="shrink-0" disabled={creating}><Plus size={18} /> {creating ? "Generating..." : "Generate"}</Button>
        </form>
      </header>

      {creating ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="luxury-card rounded-lg p-5">
            <Skeleton className="h-12 w-28" />
            <Skeleton className="mt-5 aspect-square w-full" />
            <Skeleton className="mt-4 h-4 w-full" />
          </div>
        </div>
      ) : null}

      {!creating && restaurantCodes.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No QR codes yet" message="Generate QR codes for each table. Every code opens the live menu with its table number attached." />
        </div>
      ) : null}

      {restaurantCodes.length > 0 ? (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {restaurantCodes.map((code) => (
            <motion.article key={code.id} whileHover={{ y: -6 }} className="luxury-card rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#C96A4A]">Table</p>
                  <h2 className="mt-1 font-serif-display text-4xl text-[#1F1A17]">{code.tableNumber}</h2>
                </div>
                <button onClick={() => setDeleteTarget(code)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#B85C3E]/8 text-[#B85C3E]" aria-label={`Delete table ${code.tableNumber} QR`}>
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="mt-5 rounded-lg bg-[#FFFDF9] p-4">
                <img src={code.dataUrl} alt={`QR code for table ${code.tableNumber}`} className="mx-auto h-auto w-full max-w-[240px]" />
              </div>
              <p className="mt-4 break-all text-xs leading-5 text-[#1F1A17]/55">{code.url}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Button variant="secondary" onClick={() => downloadCode(code)}><Download size={17} /> Download</Button>
                <a href={code.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1F1A17] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a2b22]">
                  <ExternalLink size={17} /> Open
                </a>
              </div>
            </motion.article>
          ))}
        </section>
      ) : null}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete QR code?"
        message={`Remove the QR code for table ${deleteTarget?.tableNumber}?`}
        confirmLabel="Delete QR"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteCode}
      />
    </div>
  );
}

export default QrManagementPage;
