/**
 * The clean data format our UI components will actually consume.
 * These match the requirements for the card layout.
 */
export interface TickerData {
  symbol: string;
  lastPrice: string; // Last traded price (BTC Price) [cite: 11]
  markPrice: string; // Mark price [cite: 12]
  high24h: string; // 24h high [cite: 13]
  low24h: string; // 24h low [cite: 14]
  volume24h: string; // 24h turnover (volume) [cite: 15]
  priceChangePercent24h: string; // 24h percent change [cite: 16]
}

/**
 * Payload interface to handle both Short (delta) and Long (snapshot) keys.
 * ByBit uses 'lp' for lastPrice in deltas but 'lastPrice' in snapshots.
 */
export interface ByBitTickerPayload {
  s?: string; // Symbol (e.g., "BTCUSDT")
  lp?: string;
  lastPrice?: string;
  mp?: string;
  markPrice?: string;
  h?: string;
  highPrice24h?: string;
  l?: string;
  lowPrice24h?: string;
  v?: string;
  turnover24h?: string;
  P?: string;
  price24hPcnt?: string;
}

/**
 * The root WebSocket message structure from ByBit[cite: 8, 9, 10].
 */
export interface ByBitTicker {
  topic: string; // Should be "tickers.BTCUSDT" [cite: 9]
  type: "snapshot" | "delta";
  ts: number; // Timestamp
  data: ByBitTickerPayload; // The actual ticker data
}

/**
 * Connection status for the UI indicator bonus feature.
 */
export type ConnectionStatus =
  | "Connecting"
  | "Connected"
  | "Disconnected"
  | "Error";
