import { useEffect, useRef, useState } from "react";
import { useCryptoStore } from "../../store/store";

export const TradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const status = useCryptoStore((state) => state.status);

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current) return;

      // 1. Reset the container by emptying it
      containerRef.current.innerHTML = "";
      setIsReady(false);

      // 2. Create a NEW div inside for the widget to attach to
      // TradingView script looks for a div with the specific class or just replaces the script tag's parent content
      const widgetContainer = document.createElement("div");
      widgetContainer.className =
        "tradingview-widget-container__widget h-full w-full";
      containerRef.current.appendChild(widgetContainer);

      // 3. Check Theme
      // We check for the 'dark' class on the HTML element
      const isDark = document.documentElement.classList.contains("dark");

      // 4. Create the Script
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "BYBIT:BTCUSDT",
        interval: "D",
        timezone: "Etc/UTC",
        theme: isDark ? "dark" : "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
      });

      // 5. Append the script to the main container (not the widgetContainer)
      // The script will automatically find the 'tradingview-widget-container__widget' we created above
      containerRef.current.appendChild(script);

      setTimeout(() => setIsReady(true), 300);
    };

    renderWidget();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          renderWidget();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden"
      style={{ height: "500px" }}
    >
      {/* The Ref goes here on the wrapper */}
      <div
        ref={containerRef}
        // 3. Add grayscale and opacity if not Connected
        className={`tradingview-widget-container h-full w-full transition-all duration-500 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${status !== "Connected" ? "grayscale opacity-50 pointer-events-none" : ""}`}
      />
    </div>
  );
};
