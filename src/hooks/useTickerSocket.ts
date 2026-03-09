import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect } from "react";
import type { ByBitTicker, TickerData } from "../types/types";
import { useCryptoStore } from "../store/store";

const BYBIT_WS_URL = "wss://stream.bybit.com/v5/public/linear";

export const useTickerSocket = () => {
  const { setTicker, setStatus } = useCryptoStore();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    BYBIT_WS_URL,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      // Fix: Add onOpen to ensure we reset status if network comes back
      onOpen: () => setStatus("Connected"),
    },
  );

  // 1. Manage Connection Status (WebSocket State)
  useEffect(() => {
    // If browser is offline, ignore WebSocket state and force Disconnected
    if (!navigator.onLine) {
      setStatus("Disconnected");
      return;
    }

    const statusMap = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Connected",
      [ReadyState.CLOSING]: "Disconnected",
      [ReadyState.CLOSED]: "Disconnected",
      [ReadyState.UNINSTANTIATED]: "Disconnected",
    } as const;

    setStatus(statusMap[readyState]);
  }, [readyState, setStatus]);

  // This listens for the physical Wi-Fi/Ethernet drop
  useEffect(() => {
    const handleOffline = () => {
      console.log("Network disconnected");
      setStatus("Disconnected");
    };

    const handleOnline = () => {
      console.log("Network recovered");
      // If the socket is somehow still open, we mark it connected
      // Otherwise, the library's auto-reconnect will kick in and update readyState
      if (readyState === ReadyState.OPEN) {
        setStatus("Connected");
      } else {
        setStatus("Connecting");
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [readyState, setStatus]);
  // 👆👆👆 END NEW BLOCK 👆👆👆

  // 2. Subscribe to BTCUSDT when connection opens
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        op: "subscribe",
        args: ["tickers.BTCUSDT"],
      });
    }
  }, [readyState, sendJsonMessage]);

  // 3. Listen for Data and Update Store
  useEffect(() => {
    if (!navigator.onLine) return;

    if (lastJsonMessage) {
      const message = lastJsonMessage as ByBitTicker;

      if (message.topic === "tickers.BTCUSDT" && message.data) {
        const d = message.data;

        const updates: Partial<TickerData> = {};

        if (d.lastPrice || d.lp) updates.lastPrice = d.lastPrice || d.lp;
        if (d.markPrice || d.mp) updates.markPrice = d.markPrice || d.mp;
        if (d.highPrice24h || d.h) updates.high24h = d.highPrice24h || d.h;
        if (d.lowPrice24h || d.l) updates.low24h = d.lowPrice24h || d.l;
        if (d.turnover24h || d.v) updates.volume24h = d.turnover24h || d.v;
        if (d.price24hPcnt || d.P)
          updates.priceChangePercent24h = d.price24hPcnt || d.P;

        setTicker(updates as TickerData);
      }
    }
  }, [lastJsonMessage, setTicker]);
};
