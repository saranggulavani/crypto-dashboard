import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { useCryptoStore } from "../../store/store";

export const Sparkline = () => {
  const { priceHistory, status } = useCryptoStore();

  // We need at least 2 points to draw a line
  if (priceHistory.length < 2) return null;

  return (
    <div
      className={`h-[60px] w-full mt-2 transition-opacity duration-300 ${status !== "Connected" ? "opacity-30 grayscale" : ""}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#eab308" // Yellow to match your logo/theme preference
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Disable for better real-time performance
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
