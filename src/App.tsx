import { Header } from "./components/Header";
import { LastUpdated } from "./components/dashboard/LastUpdated";
import { Sparkline } from "./components/dashboard/Sparkline";
import { StatCard } from "./components/dashboard/StatCard";
import { StatValue } from "./components/dashboard/StatValue";
import { TradingViewWidget } from "./components/dashboard/TradingViewWidget";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useTickerSocket } from "./hooks/useTickerSocket";
import { useCryptoStore } from "./store/store";

function App() {
  // 1. Initialize WebSocket Connection
  useTickerSocket();

  // 2. Get Data from Store
  const { ticker } = useCryptoStore();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
      <Header />

      <main className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 1. BTC Price with Sparkline - Spans 1 column but taller */}
          <Card className="flex flex-col border-border bg-card shadow-sm h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                BTC Price
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <StatValue value={ticker?.lastPrice} isPrice label="BTC Price" />
              <LastUpdated />
              <Sparkline />
            </CardContent>
          </Card>

          {/* 2. Regular Stat Cards - We use 'h-full' to match height */}
          <StatCard label="Mark Price" value={ticker?.markPrice} isPrice />
          <StatCard label="24h Change" value={ticker?.priceChangePercent24h} />
          <StatCard label="24h High" value={ticker?.high24h} isPrice />
          <StatCard label="24h Low" value={ticker?.low24h} isPrice />
          <StatCard label="24h Turnover" value={ticker?.volume24h} />
        </div>
        {/* TradingView Chart Section [cite: 23, 25] */}
        <section className="rounded-xl bg-card shadow-sm">
          <TradingViewWidget />
        </section>
      </main>
    </div>
  );
}

export default App;
