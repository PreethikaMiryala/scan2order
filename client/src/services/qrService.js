import QRCode from "qrcode";
import { getStoredValue, setStoredValue } from "../utils/storage";
import api from "./api";

const QR_KEY = "scan2order_qr_codes";

export function getQrCodes() {
  return getStoredValue(QR_KEY, []);
}

export function saveQrCodes(codes) {
  setStoredValue(QR_KEY, codes);
}

export function buildMenuUrl(restaurantId, tableNumber) {
  const origin = window.location.origin;
  // Option A (official): /menu/table/:tableNumber
  // restaurantId is embedded in DB via the table mapping, so QR only needs tableNumber.
  return `${origin}/menu/table/${encodeURIComponent(tableNumber)}`;
}


export async function createQrCode({ restaurantId, tableNumber }) {
  const url = buildMenuUrl(restaurantId, tableNumber);
  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    width: 768,
    margin: 2,
    color: { dark: "#1F1A17", light: "#FFFDF9" },
  });

  return {
    id: `qr-${restaurantId}-${tableNumber}-${Date.now()}`,
    restaurantId,
    tableNumber,
    url,
    dataUrl,
    createdAt: new Date().toISOString(),
  };
}

export async function fetchQrCodes(restaurantId) {
  const { data } = await api.get(`/api/qr-codes/${restaurantId}`);
  return data;
}

export async function persistQrCode(payload) {
  const { data } = await api.post("/api/qr-codes", payload);
  return data;
}

export async function removeQrCode(qrId) {
  const { data } = await api.delete(`/api/qr-codes/${qrId}`);
  return data;
}
