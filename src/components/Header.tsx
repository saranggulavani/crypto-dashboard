import { Moon, Sun, Wifi, WifiOff, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useCryptoStore } from "../store/store";

export const Header = () => {
  const { status } = useCryptoStore();
  const [isDark, setIsDark] = useState(true);

  // Toggle Logic
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Zap className="w-6 h-6 text-yellow-600 fill-yellow-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">CryptoDash</h1>
          <p className="text-xs text-muted-foreground">Real-time BTC/USDT</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator (Bonus Feature) */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            status === "Connected"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {status === "Connected" ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {status}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors border border-input bg-background shadow-sm cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
