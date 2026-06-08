/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import {
  createOrder as apiCreateOrder,
  fetchOrders,
  patchOrderStatus,
} from "../services/orderService";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [orderCache, setOrderCache] = useState({});

  useEffect(() => {
    const next = {};
    orders.forEach((order) => {
      next[order.id] = order;
    });
    setOrderCache(next);
  }, [orders]);

  const getOrderById = useCallback(
    (orderId) => {
      return orderCache[orderId] || null;
    },
    [orderCache]
  );

  const refreshOrdersForRestaurant = useCallback(async (restaurantId) => {
    if (!restaurantId) return [];

    const response = await fetchOrders(restaurantId);

    const fetchedOrders =
      response?.data?.data ||
      response?.data ||
      [];

    setOrders(fetchedOrders);

    return fetchedOrders;
  }, []);

  const placeOrder = useCallback(async (payload) => {
    const response = await apiCreateOrder(payload);

    const order =
      response?.data?.data ||
      response?.data;

    if (!order) {
      throw new Error("Order creation failed");
    }

    setOrders((current) => [order, ...current]);

    setOrderCache((current) => ({
      ...current,
      [order.id]: order,
    }));

    toast.success("Order placed successfully");

    return order;
  }, []);

  const setStatus = useCallback(async (orderId, status) => {
    const response = await patchOrderStatus(orderId, {
      status,
    });

    const updatedOrder =
      response?.data?.data ||
      response?.data;

    if (!updatedOrder) {
      throw new Error("Order update failed");
    }

    setOrders((current) =>
      current.map((order) =>
        String(order.id) === String(orderId)
          ? updatedOrder
          : order
      )
    );

    setOrderCache((current) => ({
      ...current,
      [updatedOrder.id]: updatedOrder,
    }));

    return updatedOrder;
  }, []);

  const liveOrders = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(
        String(order.status || "").toUpperCase()
      )
  );

  const history = orders.filter((order) =>
    ["DELIVERED", "CANCELLED"].includes(
      String(order.status || "").toUpperCase()
    )
  );

  const value = useMemo(
    () => ({
      orders,
      liveOrders,
      history,
      setOrders,
      placeOrder,
      createOrder: placeOrder,
      submitOrder: placeOrder,
      setStatus,
      getOrderById,
      refreshOrdersForRestaurant,
    }),
    [
      orders,
      liveOrders,
      history,
      placeOrder,
      setStatus,
      getOrderById,
      refreshOrdersForRestaurant,
    ]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrders must be used within OrderProvider"
    );
  }

  return context;
}