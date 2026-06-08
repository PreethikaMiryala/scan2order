import api from "./api";

export async function createPaymentIntent(payload) {
  const { data } = await api.post("/api/payments/intent", payload);
  return data;
}

export async function fetchPaymentStatus(paymentId) {
  const { data } = await api.get(`/api/payments/${paymentId}`);
  return data;
}
