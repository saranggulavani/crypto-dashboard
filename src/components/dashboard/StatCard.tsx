import { StatValue } from "./StatValue";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  label: string;
  value: string | undefined | null;
  isPrice?: boolean;
}

export const StatCard = ({ label, value, isPrice = false }: StatCardProps) => (
  <Card className="border-border bg-card shadow-sm h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {/* Pass the label here! */}
      <StatValue value={value} isPrice={isPrice} label={label} />
    </CardContent>
  </Card>
);
