import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const WS_KEY = "scan2order_socket";

export default function useSocket({ enabled = true } = {}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const endpoint = useMemo(() => {
    // Keep consistent with axios baseURL
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const socket = io(endpoint, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      socketRef.current = null;
      try {
        sessionStorage.removeItem(WS_KEY);
      } catch {
        // ignore
      }
    };
  }, [enabled, endpoint]);

  return { socket: socketRef.current, connected };
}

