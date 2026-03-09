import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { useCryptoStore } from "../../store/store";

// 1. Move the Interface outside or keep it clean in the arguments
interface StatValueProps {
  value?: string | null;
  isPrice?: boolean;
  label?: string;
}

export const StatValue = ({
  value,
  isPrice = false,
  label,
}: StatValueProps) => {
  const [trend, setTrend] = useState<"neutral" | "up" | "down">("neutral");
  const prevValue = useRef<string | undefined>(undefined);

  // 2. Get Status
  const status = useCryptoStore((state) => state.status);
  const isLive = status === "Connected";

  useEffect(() => {
    // 3. Force Neutral if Disconnected
    if (!isLive) {
      setTrend("neutral");
      return;
    }

    if (!value || value === "---" || prevValue.current === undefined) {
      prevValue.current = value ?? undefined;
      return;
    }

    const current = parseFloat(value);
    const previous = parseFloat(prevValue.current);

    if (!isNaN(current) && !isNaN(previous)) {
      if (current > previous) setTrend("up");
      else if (current < previous) setTrend("down");
    }

    const timer = setTimeout(() => setTrend("neutral"), 1000);
    prevValue.current = value;
    return () => clearTimeout(timer);
  }, [value, isLive]); // Add isLive to dependency

  // Use a proper function to format the number
  const getFormattedValue = () => {
    if (!value || value === "---") return "---";
    const num = parseFloat(value);
    return isNaN(num)
      ? "---"
      : num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <div
      className={cn(
        "text-2xl font-bold tabular-nums transition-colors",
        trend === "up" && "text-green-500",
        trend === "down" && "text-red-500",
      )}
    >
      {isPrice && value && value !== "---" ? "$" : ""}

      {/* Correctly using the label to decide on symbols */}
      {!isPrice && trend === "up" && label === "24h Change" && "+"}
      {!isPrice && trend === "down" && label === "24h Change" && "-"}

      {getFormattedValue()}

      {!isPrice && value && value !== "---" && label === "24h Change" && "%"}
    </div>
  );
};
