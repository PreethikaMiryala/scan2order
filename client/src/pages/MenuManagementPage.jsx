import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Edit3, Plus, Trash2, Utensils, X, ChevronDown } from "lucide-react";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { RowSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../hooks/useMenu";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";
import { currency } from "../utils/format";

const CATEGORY_OPTIONS = [
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

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  available: true,
};

function MenuManagementPage() {
  const { restaurantId } = useAuth();
  const { items, setItems, loading, error } = useMenu(restaurantId);
  const [activeCategory, setActiveCategory] = useState("All");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => item.category))],
    [items],
  );

  const visibleItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  function openAdd() {
    setFormError("");
    setModal({ mode: "add", form: { ...emptyForm } });
  }

  function openEdit(item) {
    setFormError("");
    setModal({
      mode: "edit",
      form: {
        ...item,
        price: String(item.price),
        image_url: item.image_url || "",
        description: item.description || "",
      },
    });
  }

  function closeModal() {
    setModal(null);
    setFormError("");
  }

  function updateModalField(event) {
    const { name, value, type, checked } = event.target;
    setModal((current) => ({
      ...current,
      form: { ...current.form, [name]: type === "checkbox" ? checked : value },
    }));
  }

  async function saveItem(event) {
    event.preventDefault();
    const form = modal.form;
    const price = Number(form.price);

    if (!form.name.trim() || !form.category || !price || price <= 0) {
      setFormError("Name, category, and a valid price are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (modal.mode === "edit") {
        const updated = await updateMenuItem(form.id, {
          name: form.name.trim(),
          description: form.description,
          price,
          category: form.category,
          image_url: form.image_url,
          available: form.available,
        });

        setItems((current) =>
          current.map((item) =>
            item.id === form.id ? { ...item, ...updated } : item,
          ),
        );

        toast.success("Menu item updated");
        closeModal();
      } else {
        const created = await createMenuItem({
          restaurant_id: restaurantId,
          name: form.name.trim(),
          description: form.description,
          price,
          category: form.category,
          image_url: form.image_url,
        });

        setItems((current) => [{ ...created, available: true }, ...current]);
        toast.success("Menu item added");
        closeModal();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Operation failed",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteMenuItem(deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      toast.success("Item deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Delete failed",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">Menu management</p>
          <h1 className="mt-3 font-serif-display text-5xl leading-none text-[#1F1A17] sm:text-6xl">
            Seasonal catalogue
          </h1>
        </div>
        <Button className="w-full sm:w-auto" onClick={openAdd}>
          <Plus size={18} /> Add item
        </Button>
      </header>

      {/* Category filter chips */}
      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
              activeCategory === category
                ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-lg shadow-[#1F1A17]/12"
                : "border-[#1F1A17]/10 bg-[#FFFDF9]/78 text-[#1F1A17]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="premium-surface mt-6 overflow-hidden rounded-3xl">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : null}

      {/* Error state */}
      {!loading && error ? (
        <EmptyState title="Could not load menu" message={error} />
      ) : null}

      {/* Empty state */}
      {!loading && !error && visibleItems.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No menu items"
            message="Add your first dish to begin shaping the customer menu."
          />
        </div>
      ) : null}

      {/* Menu items table */}
      {!loading && !error && visibleItems.length > 0 ? (
        <div className="premium-surface mt-6 overflow-hidden rounded-3xl">
          {/* Table header */}
          <div className="hidden grid-cols-[1.4fr_1fr_0.6fr_0.7fr_0.7fr] gap-4 border-b border-[#1F1A17]/10 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#1F1A17]/55 lg:grid">
            <span>Item</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-[#1F1A17]/10">
            {visibleItems.map((item) => (
              <motion.article
                key={item.id}
                layout
                className="grid gap-4 p-4 transition hover:bg-[#1F1A17]/[0.025] lg:grid-cols-[1.4fr_1fr_0.6fr_0.7fr_0.7fr] lg:items-center lg:px-5"
              >
                <div className="flex min-w-0 gap-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[#1F1A17]/8 text-[#1F1A17]">
                      <Utensils size={22} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-serif-display text-xl text-[#1F1A17]">
                      {item.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-[#1F1A17]/60">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center rounded-full bg-[#C96A4A]/10 px-3 py-1 text-xs font-semibold text-[#C96A4A]">
                  {item.category}
                </span>

                <p className="text-sm font-semibold text-[#1F1A17]">
                  {currency(item.price)}
                </p>

                {/* Availability badge */}
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    item.available
                      ? "bg-[#2D6A4F]/10 text-[#2D6A4F]"
                      : "bg-[#B85C3E]/10 text-[#B85C3E]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.available ? "bg-[#2D6A4F]" : "bg-[#B85C3E]"
                    }`}
                  />
                  {item.available ? "Available" : "Unavailable"}
                </span>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-[#1F1A17]/8 text-[#1F1A17] transition hover:bg-[#1F1A17]/14 hover:scale-105"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit3 size={17} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-[#B85C3E]/8 text-[#B85C3E] transition hover:bg-[#B85C3E]/16 hover:scale-105"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      ) : null}

      {/* Add / Edit Modal */}
      {modal ? (
        <div className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-[#1F1A17]/50 p-4 py-6 backdrop-blur-md sm:place-items-center">
          <motion.form
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={saveItem}
            className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 shadow-2xl sm:p-7"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif-display text-3xl text-[#1F1A17]">
                {modal.mode === "add" ? "Add menu item" : "Edit menu item"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1F1A17]/8 text-[#1F1A17] transition hover:bg-[#1F1A17]/14"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Error */}
            {formError ? (
              <p className="mt-4 rounded-lg bg-[#B85C3E]/8 p-3 text-sm font-semibold text-[#B85C3E]">
                {formError}
              </p>
            ) : null}

            {/* Form Fields */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#1F1A17]">
                  Name <span className="text-[#B85C3E]">*</span>
                </label>
                <input
                  className="premium-input h-12 px-4"
                  name="name"
                  placeholder="e.g. Truffle Risotto"
                  value={modal.form.name}
                  onChange={updateModalField}
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1F1A17]">
                  Category <span className="text-[#B85C3E]">*</span>
                </label>
                <div className="relative">
                  <select
                    className="premium-select h-12 w-full appearance-none pr-10"
                    name="category"
                    value={modal.form.category}
                    onChange={updateModalField}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1A17]/40"
                    size={18}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1F1A17]">
                  Price (₹) <span className="text-[#B85C3E]">*</span>
                </label>
                <input
                  className="premium-input h-12 px-4"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={modal.form.price}
                  onChange={updateModalField}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#1F1A17]">
                  Image URL
                </label>
                <input
                  className="premium-input h-12 px-4"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={modal.form.image_url}
                  onChange={updateModalField}
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#1F1A17]">
                  Description
                </label>
                <textarea
                  className="premium-input min-h-28 rounded-lg px-4 py-3"
                  name="description"
                  placeholder="A brief description of the dish..."
                  value={modal.form.description}
                  onChange={updateModalField}
                />
              </div>

              {/* Available Toggle */}
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#1F1A17]">
                <input
                  type="checkbox"
                  name="available"
                  checked={modal.form.available}
                  onChange={updateModalField}
                  className="h-5 w-5 rounded border-[#1F1A17]/20 text-[#2D6A4F] focus:ring-[#C96A4A]"
                />
                Available for order
              </label>

              {/* Image Preview */}
              <div className="overflow-hidden rounded-xl border border-[#1F1A17]/12 bg-[#1F1A17]/5 sm:col-span-2">
                {modal.form.image_url ? (
                  <img
                    src={modal.form.image_url}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-40 place-items-center text-[#1F1A17]/35">
                    <Utensils size={32} />
                    <span className="mt-2 text-xs">Image preview</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button disabled={saving}>
                {saving ? "Saving..." : "Save item"}
              </Button>
            </div>
          </motion.form>
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete menu item?"
        message={`This will permanently remove "${deleteTarget?.name}" from the menu. This action cannot be undone.`}
        confirmLabel="Delete item"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}

export default MenuManagementPage;
