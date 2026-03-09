import { useEffect, useState } from "react";
import { useCryptoStore } from "../../store/store";

export const LastUpdated = () => {
  const lastUpdated = useCryptoStore((state) => state.lastUpdated);
  const [displayTag, setDisplayTag] = useState("Never");

  useEffect(() => {
    const updateRelativeTime = () => {
      if (!lastUpdated) return;

      const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);

      if (secondsAgo < 1) setDisplayTag("Just now");
      else if (secondsAgo < 60) setDisplayTag(`${secondsAgo}s ago`);
      else setDisplayTag("More than a minute ago");
    };

    // Update the text immediately and then every second
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
      Last updated: {displayTag}
    </span>
  );
};
