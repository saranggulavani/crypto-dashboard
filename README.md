# ⚡ CryptoDash: Real-Time Trading Interface

A high-performance, responsive cryptocurrency dashboard built with **React 19**, **TypeScript**, and **Tailwind v4**. This project focuses on high-frequency data streaming, architectural efficiency, and connection resilience.

---

## 📖 Project Overview

This application provides a live-streaming interface for BTC/USDT market data. It fulfills the core requirements of a modern trading terminal:

- **Live Ticker:** Real-time updates for Price, 24h High/Low, and Volume.
- **Visual Trends:** Dynamic color changes (Red/Green) based on price movement.
- **Technical Analysis:** Integrated TradingView Advanced Charting.
- **Stability:** Production-grade WebSocket management.

---

## ⚙️ How It Works (The Data Lifecycle)

### 1. Data Ingestion (WebSocket Layer)

The app uses a custom hook `useTickerSocket` to establish a persistent connection to the **ByBit V5 Public API**.

- **Subscription:** Upon connection, it sends a JSON message to subscribe to the `tickers.BTCUSDT` topic.
- **Normalization:** Raw delta updates from the API are cleaned and mapped to a strict TypeScript `TickerData` interface.

### 2. State Propagation (Zustand Layer)

Instead of storing data in a local component, we push it to a **Global Store**.

- **Partial Updates:** The store merges incoming partial data with existing data, ensuring that if the API only sends the "Price," the "24h High" doesn't disappear or reset to `---`.
- **History Tracking:** The store maintains an array of the last 60 price points to power the real-time Sparkline.

### 3. Reactive UI (Component Layer)

- **Smart Re-renders:** Components "select" only the data they need. If the `Volume` changes, the `Price` component does **not** re-render, saving CPU cycles.
- **Trend Logic:** The `StatValue` component compares the current incoming value with a `useRef` of the previous value to determine the "flash" color (Green for up, Red for down).

---

## 🏗 Key Technical Features

### 🌙 Adaptive Theme Engine

- **CSS Variables:** Built on Tailwind v4's native CSS variable support for zero-latency theme switching.
- **Chart Sync:** Uses a `MutationObserver` to detect when the user toggles Light/Dark mode. It then signals the TradingView iframe to re-render with the matching theme profile.

---

## 🛠 Tech Stack

| Category      | Technology                  | Purpose                                   |
| :------------ | :-------------------------- | :---------------------------------------- |
| **Framework** | React 19 + Vite             | Modern, fast UI development               |
| **State**     | **Zustand**                 | Granular, high-frequency state management |
| **Data**      | **ByBit WebSocket**         | Real-time ticker streaming                |
| **UI/UX**     | **Shadcn/UI** + Tailwind v4 | Accessible, utility-first architecture    |
| **Charts**    | **TradingView** + Recharts  | Professional analysis & live sparklines   |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```text
src/
├── components/     # Feature-specific blocks (Header, Sparkline, Cards)
│   └── ui/         # Shadcn/UI primitives (Generic buttons, cards)
├── hooks/          # Custom WebSocket & Connection Watchdog logic
├── lib/            # Shared utilities (Tailwind merge, Theme helpers)
├── store/          # Zustand global state definition
└── types/          # Strict TypeScript interfaces
```
