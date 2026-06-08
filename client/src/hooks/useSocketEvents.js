import { useEffect, useRef } from "react";
import useSocket from "./useSocket";

export function useSocketEvents({ onNewOrder, onOrderStatusUpdated } = {}) {
  const { socket, connected } = useSocket({ enabled: true });
  const handlersRef = useRef({ onNewOrder, onOrderStatusUpdated });

  handlersRef.current = { onNewOrder, onOrderStatusUpdated };

  useEffect(() => {
    if (!socket) return;

    function handleNewOrder(order) {
      handlersRef.current.onNewOrder?.(order);
    }
    function handleOrderStatusUpdated(order) {
      handlersRef.current.onOrderStatusUpdated?.(order);
    }

    socket.on("new-order", handleNewOrder);
    socket.on("order-status-updated", handleOrderStatusUpdated);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-status-updated", handleOrderStatusUpdated);
    };
  }, [socket, connected]);
}

