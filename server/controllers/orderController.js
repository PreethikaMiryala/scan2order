const supabase = require("../config/supabase");
const { getIO } = require("../sockets/io");

function normalizeStatus(status) {
  const s = String(status || "").toUpperCase();
  const allowed = ["NEW", "ACCEPTED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
  if (!allowed.includes(s)) return "NEW";
  return s;
}

function buildOrderFromRow(row) {
  // Keep shapes consistent with frontend expectations
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    table: row.table_number,
    customerName: row.customer_name,
    items: row.items,
    totalAmount: row.total_amount,
    specialInstructions: row.special_instructions,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function createOrder(req, res) {
  try {
    const {
      restaurantId,
      tableNumber,
      table,
      customerName,
      items,
      totalAmount,
      total_amount,
      specialInstructions,
      special_instructions,
    } = req.body || {};

    const resolvedTableNumber = tableNumber ?? table;

    if (!restaurantId) {
      return res.status(400).json({ success: false, message: "restaurantId is required" });
    }
    if (!resolvedTableNumber) {
      return res.status(400).json({ success: false, message: "tableNumber is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items must be a non-empty array" });
    }

    const resolvedTotal = totalAmount ?? total_amount;

    const payload = {
      restaurant_id: restaurantId,
      table_number: String(resolvedTableNumber),
      customer_name: customerName || null,
      items,
      total_amount: Number(resolvedTotal ?? 0),
      special_instructions: specialInstructions ?? special_instructions ?? null,
      status: "NEW",
    };

    const order = {
  id: Date.now().toString(),
  restaurantId,
  table: resolvedTableNumber,
  customerName,
  items,
  totalAmount: resolvedTotal,
  specialInstructions,
  status: "NEW",
  createdAt: new Date().toISOString(),
};

    getIO().emit("new-order", order);

    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}

async function listOrders(req, res) {
  try {
    const { restaurantId, status } = req.query;

    let query = supabase.from("orders").select("*");

    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }
    if (status) {
      query = query.eq("status", normalizeStatus(status));
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const orders = (data || []).map(buildOrderFromRow);
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}

async function patchOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const nextStatus = normalizeStatus(status);

    const { data, error } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const order = buildOrderFromRow(data);

    getIO().emit("order-status-updated", order);

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}

module.exports = { createOrder, listOrders, patchOrderStatus };

