import { create } from "zustand";
import type { ConnectionStatus, TickerData } from "../types/types";

interface CryptoState {
  // Data State
  ticker: TickerData | null;
  priceHistory: { price: number; timestamp: number }[]; // For the Sparkline bonus
  status: ConnectionStatus; // Connection status requirement [cite: 41]

  // Actions
  setTicker: (incomingData: Partial<TickerData>) => void;
  setStatus: (status: ConnectionStatus) => void;
  lastUpdated: number | null;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  ticker: null,
  priceHistory: [],
  status: "Disconnected",
  lastUpdated: null,

  /**
   * Updates the ticker data by merging new deltas with existing state.
   * This prevents fields from resetting to "---" when partial data arrives.
   */
  setTicker: (incomingData) =>
    set((state) => {
      // 1. Merge the new partial data with the existing ticker data
      const updatedTicker = state.ticker
        ? { ...state.ticker, ...incomingData }
        : (incomingData as TickerData);

      // 2. Extract numeric price for the history array
      const newPrice = parseFloat(updatedTicker.lastPrice);

      // 3. Manage price history for the 60s sparkline bonus
      const currentHistory = [
        ...state.priceHistory,
        { price: newPrice, timestamp: Date.now() },
      ];

      // Keep only the last 60 data points to represent 60 seconds of movement
      const trimmedHistory =
        currentHistory.length > 60 ? currentHistory.slice(-60) : currentHistory;

      return {
        ticker: updatedTicker,
        priceHistory: trimmedHistory,
        lastUpdated: Date.now(), // Record the time of the update
      };
    }),

  setStatus: (status) => set({ status }),
}));
